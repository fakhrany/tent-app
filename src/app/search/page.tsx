"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Home as HomeIcon, Send, Globe, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useMapStore } from "@/stores/mapStore";
import { useChatStore } from "@/stores/chatStore";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { PropertyCard } from "@/components/map/PropertyCard";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hoveredProperty, setHoveredProperty] = useState<any>(null);

  const { messages, isLoading, language, addMessage, setLoading, setLanguage } = useChatStore();
  const { pins, setPins, hoveredPin, setHoveredPin } = useMapStore();

  const chatMutation = trpc.chat.query.useMutation({
    onSuccess: (data) => {
      addMessage({
        role: "assistant",
        content: data.answer,
        sources: data.sources,
      });
      
      // Update map pins
      if (data.mapPins && data.mapPins.length > 0) {
        setPins(
          data.mapPins.map((pin: any) => ({
            id: pin.id,
            lat: pin.lat,
            lng: pin.lng,
            name: pin.name,
            price: pin.price,
            bedrooms: pin.bedrooms,
            type: pin.type,
            featured: Math.random() > 0.7, // Randomly mark some as featured
          }))
        );
      }
      
      setLoading(false);
    },
    onError: (error) => {
      console.error("Search error:", error);
      addMessage({
        role: "assistant",
        content: language === "en" 
          ? "Sorry, there was an error. Please try again." 
          : "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.",
      });
      setLoading(false);
    },
  });

  const handleSearch = () => {
    if (!query.trim()) return;

    addMessage({ role: "user", content: query });
    setLoading(true);
    setQuery("");

    chatMutation.mutate({ query, language });
  };

  const handlePinHover = (pinId: string | null) => {
    setHoveredPin(pinId);
    if (pinId) {
      // Find property details from sources
      const allSources = messages
        .filter((m) => m.role === "assistant" && m.sources)
        .flatMap((m) => m.sources);
      const property = allSources.find((s: any) => s?.id === pinId);
      setHoveredProperty(property);
    } else {
      setHoveredProperty(null);
    }
  };

  const followUpChips = language === "en"
    ? ["2BR only", "Sort by price", "Near schools", "With pool"]
    : ["٢ غرفة فقط", "ترتيب بالسعر", "قرب المدارس", "مع مسبح"];

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#F5F3EF",
        fontFamily: "Inter, sans-serif",
        direction: language === "ar" ? "rtl" : "ltr",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "0.625rem 1.5rem",
          borderBottom: "1px solid #E5E0D8",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
          onClick={() => router.push("/")}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              background: "linear-gradient(135deg, #D97706, #B45309)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HomeIcon size={14} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: "0.9375rem", fontWeight: "700", color: "#1A1611" }}>Tent</span>
        </div>
        
        <button
          onClick={() => setLanguage(language === "en" ? "ar" : "en")}
          style={{
            padding: "0.375rem 0.75rem",
            border: "1px solid #D4CFC6",
            borderRadius: "6px",
            background: "#FFFFFF",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            color: "#5C574E",
            fontWeight: "500",
            fontSize: "0.75rem",
          }}
        >
          <Globe size={12} />
          <span>{language === "en" ? "EN" : "AR"}</span>
        </button>
      </header>

      {/* Split View */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Chat Panel - 40% */}
        <div
          style={{
            flex: "0 0 40%",
            display: "flex",
            flexDirection: "column",
            borderRight: language === "ar" ? "none" : "1px solid #E5E0D8",
            borderLeft: language === "ar" ? "1px solid #E5E0D8" : "none",
            background: "#FFFFFF",
          }}
        >
          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.25rem" }}>
            {messages.map((message, idx) => (
              <div key={idx} style={{ marginBottom: "1.5rem" }}>
                {message.role === "user" ? (
                  // User Message
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #FEF3C7, #FFF7ED)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#D97706",
                          fontWeight: "700",
                          fontSize: "0.6875rem",
                          border: "1.5px solid #D97706",
                        }}
                      >
                        U
                      </div>
                      <span style={{ color: "#8A8680", fontSize: "0.6875rem", fontWeight: "600" }}>
                        {language === "en" ? "You" : "أنت"}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: "0.875rem 1rem",
                        background: "#FAF8F5",
                        borderRadius: "10px",
                        border: "1px solid #E5E0D8",
                        marginLeft: language === "ar" ? 0 : "2rem",
                        marginRight: language === "ar" ? "2rem" : 0,
                      }}
                    >
                      <p
                        style={{
                          color: "#1A1611",
                          margin: 0,
                          lineHeight: "1.5",
                          fontSize: "0.875rem",
                        }}
                      >
                        {message.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  // AI Message
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #D97706, #B45309)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 6px rgba(217,119,6,0.25)",
                        }}
                      >
                        <Sparkles size={12} color="white" strokeWidth={2.5} />
                      </div>
                      <span
                        style={{ color: "#8A8680", fontSize: "0.6875rem", fontWeight: "600" }}
                      >
                        Tent AI
                      </span>
                      <div
                        style={{
                          marginLeft: "auto",
                          padding: "0.125rem 0.375rem",
                          background: "#FFF7ED",
                          borderRadius: "4px",
                          fontSize: "0.5625rem",
                          fontWeight: "700",
                          color: "#D97706",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        AI
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "1rem 1.125rem",
                        background: "#FBF9F6",
                        borderRadius: "10px",
                        border: "1px solid #E5E0D8",
                        marginLeft: language === "ar" ? 0 : "2rem",
                        marginRight: language === "ar" ? "2rem" : 0,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      }}
                    >
                      <p
                        style={{
                          color: "#5C574E",
                          lineHeight: "1.6",
                          margin: 0,
                          fontSize: "0.8125rem",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {message.content}
                      </p>

                      {/* Sources */}
                      {message.sources && message.sources.length > 0 && (
                        <details style={{ marginTop: "0.875rem" }}>
                          <summary
                            style={{
                              cursor: "pointer",
                              color: "#D97706",
                              fontWeight: "700",
                              marginBottom: "0.5rem",
                              fontSize: "0.75rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              userSelect: "none",
                            }}
                          >
                            <span>
                              {language === "en"
                                ? `▼ Sources (${message.sources.length})`
                                : `▼ المصادر (${message.sources.length})`}
                            </span>
                          </summary>
                          <div
                            style={{
                              marginTop: "0.625rem",
                              paddingTop: "0.625rem",
                              borderTop: "1px solid #E5E0D8",
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.5rem",
                            }}
                          >
                            {message.sources.map((source: any, sidx: number) => (
                              <div
                                key={sidx}
                                style={{
                                  padding: "0.625rem",
                                  background: "#FFFFFF",
                                  borderRadius: "6px",
                                  border: "1px solid #E5E0D8",
                                  display: "flex",
                                  gap: "0.625rem",
                                  alignItems: "center",
                                  transition: "all 0.2s",
                                  cursor: "pointer",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.borderColor = "#D97706";
                                  e.currentTarget.style.transform = "translateX(2px)";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.borderColor = "#E5E0D8";
                                  e.currentTarget.style.transform = "translateX(0)";
                                }}
                              >
                                <span
                                  style={{
                                    color: "#D97706",
                                    fontWeight: "800",
                                    fontSize: "0.6875rem",
                                    background: "#FFF7ED",
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "4px",
                                    minWidth: "24px",
                                    textAlign: "center",
                                  }}
                                >
                                  {sidx + 1}
                                </span>
                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      fontWeight: "700",
                                      color: "#1A1611",
                                      fontSize: "0.75rem",
                                      marginBottom: "0.125rem",
                                    }}
                                  >
                                    {source.name}
                                  </div>
                                  <div
                                    style={{
                                      color: "#8A8680",
                                      fontSize: "0.6875rem",
                                      display: "flex",
                                      gap: "0.375rem",
                                    }}
                                  >
                                    <span>{source.location}</span>
                                    <span>•</span>
                                    <span>
                                      {(parseFloat(source.price) / 1000000).toFixed(1)}M EGP
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>

                    {/* Follow-up Chips */}
                    {idx === messages.length - 1 && (
                      <div
                        style={{
                          display: "flex",
                          gap: "0.375rem",
                          marginTop: "0.75rem",
                          flexWrap: "wrap",
                          marginLeft: language === "ar" ? 0 : "2rem",
                          marginRight: language === "ar" ? "2rem" : 0,
                        }}
                      >
                        {followUpChips.map((chip, cidx) => (
                          <button
                            key={cidx}
                            onClick={() => {
                              setQuery(chip);
                              setTimeout(handleSearch, 100);
                            }}
                            style={{
                              padding: "0.375rem 0.75rem",
                              background: "#FFFFFF",
                              border: "1px solid #E5E0D8",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              color: "#5C574E",
                              transition: "all 0.2s",
                              fontWeight: "500",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.borderColor = "#D97706";
                              e.currentTarget.style.background = "#FFF7ED";
                              e.currentTarget.style.color = "#D97706";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.borderColor = "#E5E0D8";
                              e.currentTarget.style.background = "#FFFFFF";
                              e.currentTarget.style.color = "#5C574E";
                            }}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginLeft: language === "ar" ? 0 : "2rem",
                  marginRight: language === "ar" ? "2rem" : 0,
                  color: "#8A8680",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#D97706",
                    animation: "pulse 1.5s infinite",
                  }}
                />
                <span style={{ fontSize: "0.8125rem" }}>
                  {language === "en" ? "Searching properties..." : "البحث عن العقارات..."}
                </span>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: "0.875rem 1.25rem",
              borderTop: "1px solid #E5E0D8",
              background: "#FFFFFF",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#FAF8F5",
                border: "1px solid #E5E0D8",
                borderRadius: "8px",
                padding: "0.5rem 0.75rem",
                transition: "all 0.2s",
              }}
            >
              <input
                type="text"
                placeholder={
                  language === "en" ? "Ask a follow-up..." : "اسأل سؤالاً متابعة..."
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "#1A1611",
                  fontSize: "0.8125rem",
                  textAlign: language === "ar" ? "right" : "left",
                }}
              />
              <button
                onClick={handleSearch}
                style={{
                  padding: "0.375rem",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  borderRadius: "6px",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#FFF7ED")}
                onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Send size={16} color="#D97706" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Map Panel - 60% */}
        <div style={{ flex: "0 0 60%", position: "relative", background: "#F0EDE8" }}>
          <InteractiveMap onPinHover={handlePinHover} />

          {/* Floating Property Card on Hover */}
          {hoveredPin && hoveredProperty && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 100,
                pointerEvents: "none",
              }}
            >
              <PropertyCard
                id={hoveredProperty.id}
                name={hoveredProperty.name}
                location={hoveredProperty.location}
                developer={hoveredProperty.developer || "Unknown"}
                price={hoveredProperty.price}
                bedrooms={hoveredProperty.bedrooms}
                bathrooms={hoveredProperty.bathrooms}
                size={hoveredProperty.size}
                type={hoveredProperty.type || "apartment"}
                language={language}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
