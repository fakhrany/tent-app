"use client";

import { MapPin, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PropertyCardProps {
  id: string;
  name: string;
  location: string;
  developer: string;
  price: string;
  pricePerSqm?: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  type: string;
  featured?: boolean;
  availability?: string;
  image?: string;
  onViewDetails?: () => void;
  onFavorite?: () => void;
  language?: "en" | "ar";
}

export function PropertyCard({
  name,
  location,
  developer,
  price,
  pricePerSqm,
  bedrooms,
  bathrooms,
  size,
  type,
  featured,
  availability = "available",
  image,
  onViewDetails,
  onFavorite,
  language = "en",
}: PropertyCardProps) {
  return (
    <div
      style={{
        width: "280px",
        background: "#FFFFFF",
        borderRadius: "12px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
        overflow: "hidden",
        border: "1.5px solid #E5E0D8",
        animation: "slideUp 0.2s ease",
      }}
    >
      {/* Image Header */}
      <div
        style={{
          height: "100px",
          background: "linear-gradient(135deg, #FFF7ED, #FEF3C7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "3rem",
          position: "relative",
        }}
      >
        {image ? (
          <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span>
            {type === "apartment" ? "🏢" : type === "villa" ? "🏡" : type === "penthouse" ? "🌆" : "🏠"}
          </span>
        )}
        
        {/* Badges */}
        <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", display: "flex", gap: "0.25rem" }}>
          {featured && (
            <div
              style={{
                padding: "0.25rem 0.5rem",
                background: "rgba(217,119,6,0.95)",
                borderRadius: "4px",
                fontSize: "0.5625rem",
                fontWeight: "700",
                color: "white",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <Sparkles size={10} strokeWidth={3} />
              {language === "en" ? "Featured" : "مميز"}
            </div>
          )}
          {availability === "available" && (
            <div
              style={{
                padding: "0.25rem 0.5rem",
                background: "rgba(5,150,105,0.95)",
                borderRadius: "4px",
                fontSize: "0.5625rem",
                fontWeight: "700",
                color: "white",
                textTransform: "uppercase",
              }}
            >
              {language === "en" ? "Available" : "متاح"}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "0.875rem" }}>
        <h4
          style={{
            margin: "0 0 0.25rem 0",
            color: "#1A1611",
            fontSize: "0.9375rem",
            fontWeight: "700",
            letterSpacing: "-0.01em",
          }}
        >
          {name}
        </h4>
        
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            color: "#8A8680",
            fontSize: "0.6875rem",
            marginBottom: "0.625rem",
          }}
        >
          <MapPin size={11} />
          <span>{location}</span>
          <span>•</span>
          <span style={{ fontWeight: "600" }}>{developer}</span>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.5rem",
            marginBottom: "0.625rem",
            padding: "0.625rem",
            background: "#FAF8F5",
            borderRadius: "8px",
            border: "1px solid #E5E0D8",
          }}
        >
          {[
            { icon: "🛏", value: bedrooms, label: language === "en" ? "BR" : "غرف" },
            { icon: "🚿", value: bathrooms, label: language === "en" ? "BA" : "حمام" },
            { icon: "📐", value: `${size}m²`, label: language === "en" ? "Area" : "مساحة" },
          ].map((stat, idx) => (
            <div key={idx} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.125rem", marginBottom: "0.125rem" }}>{stat.icon}</div>
              <div style={{ fontWeight: "700", fontSize: "0.75rem", color: "#1A1611" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "0.5625rem", color: "#8A8680", marginTop: "0.0625rem" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Price */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "0.625rem",
            paddingBottom: "0.625rem",
            borderBottom: "1px solid #E5E0D8",
          }}
        >
          <div>
            <div
              style={{
                color: "#D97706",
                fontWeight: "800",
                fontSize: "1.125rem",
                letterSpacing: "-0.02em",
              }}
            >
              {formatPrice(parseFloat(price))}
            </div>
            {pricePerSqm && (
              <div
                style={{
                  color: "#8A8680",
                  fontSize: "0.625rem",
                  marginTop: "0.125rem",
                }}
              >
                ~{pricePerSqm.toLocaleString()} EGP/m²
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={onViewDetails}
            style={{
              flex: 1,
              padding: "0.5rem",
              background: "linear-gradient(135deg, #D97706, #B45309)",
              border: "none",
              borderRadius: "6px",
              color: "white",
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "700",
              boxShadow: "0 2px 6px rgba(217,119,6,0.3)",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(217,119,6,0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(217,119,6,0.3)";
            }}
          >
            {language === "en" ? "View Details" : "عرض"}
          </button>
          
          <button
            onClick={onFavorite}
            style={{
              padding: "0.5rem",
              background: "#FAF8F5",
              border: "1px solid #D4CFC6",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.875rem",
              minWidth: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#D97706";
              e.currentTarget.style.background = "#FFF7ED";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#D4CFC6";
              e.currentTarget.style.background = "#FAF8F5";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
}
