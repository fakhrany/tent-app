import { db } from "./index";
import { developers, projects, units } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.delete(units);
  await db.delete(projects);
  await db.delete(developers);

  // Seed Developers
  const [emaar, sodic, hydePark, mountainView, tmg, palmHills] = await db
    .insert(developers)
    .values([
      {
        name: "Emaar Misr",
        nameAr: "إعمار مصر",
        slug: "emaar-misr",
        logo: "https://via.placeholder.com/150?text=Emaar",
        country: "Egypt",
        website: "https://emaarmisr.com",
        description: "Leading real estate developer in Egypt",
        descriptionAr: "مطور عقاري رائد في مصر",
        verified: true,
        establishedYear: 2012,
      },
      {
        name: "Sodic",
        nameAr: "سوديك",
        slug: "sodic",
        logo: "https://via.placeholder.com/150?text=Sodic",
        country: "Egypt",
        website: "https://sodic.com",
        description: "Premium lifestyle communities",
        descriptionAr: "مجتمعات سكنية راقية",
        verified: true,
        establishedYear: 1996,
      },
      {
        name: "Hyde Park",
        nameAr: "هايد بارك",
        slug: "hyde-park",
        logo: "https://via.placeholder.com/150?text=HydePark",
        country: "Egypt",
        website: "https://hydeparkdevelopments.com",
        description: "Integrated residential communities",
        descriptionAr: "مجتمعات سكنية متكاملة",
        verified: true,
        establishedYear: 2007,
      },
      {
        name: "Mountain View",
        nameAr: "ماونتن فيو",
        slug: "mountain-view",
        logo: "https://via.placeholder.com/150?text=MountainView",
        country: "Egypt",
        website: "https://mountainview.com.eg",
        description: "Innovative urban living spaces",
        descriptionAr: "مساحات معيشة حضرية مبتكرة",
        verified: true,
        establishedYear: 1998,
      },
      {
        name: "Talaat Moustafa Group",
        nameAr: "مجموعة طلعت مصطفى",
        slug: "tmg",
        logo: "https://via.placeholder.com/150?text=TMG",
        country: "Egypt",
        website: "https://talaatmoustafa.com",
        description: "Egypt's leading real estate conglomerate",
        descriptionAr: "أكبر مجموعة عقارية في مصر",
        verified: true,
        establishedYear: 1954,
      },
      {
        name: "Palm Hills",
        nameAr: "بالم هيلز",
        slug: "palm-hills",
        logo: "https://via.placeholder.com/150?text=PalmHills",
        country: "Egypt",
        website: "https://palmhillsdevelopments.com",
        description: "Luxury residential developments",
        descriptionAr: "تطويرات سكنية فاخرة",
        verified: true,
        establishedYear: 2005,
      },
    ])
    .returning();

  console.log("✅ Developers seeded");

  // Seed Projects
  const projectsData = await db
    .insert(projects)
    .values([
      // New Cairo Projects
      {
        developerId: emaar.id,
        name: "Uptown Cairo",
        nameAr: "أب تاون كايرو",
        slug: "uptown-cairo",
        city: "New Cairo",
        cityAr: "القاهرة الجديدة",
        district: "Mokattam",
        districtAr: "المقطم",
        lat: "30.0131",
        lng: "31.4748",
        deliveryDate: new Date("2025-12-31"),
        completionStatus: "construction",
        amenities: ["pool", "gym", "spa", "park", "security", "mall"],
        amenitiesAr: ["مسبح", "صالة رياضية", "سبا", "حديقة", "أمن", "مول"],
        description:
          "An integrated urban development spanning 4.5 million square meters",
        descriptionAr: "تطوير عمراني متكامل على مساحة 4.5 مليون متر مربع",
        images: [
          "https://via.placeholder.com/800x600?text=Uptown+Cairo+1",
          "https://via.placeholder.com/800x600?text=Uptown+Cairo+2",
        ],
        totalUnits: 5000,
        featured: true,
      },
      {
        developerId: hydePark.id,
        name: "Hyde Park New Cairo",
        nameAr: "هايد بارك القاهرة الجديدة",
        slug: "hyde-park-new-cairo",
        city: "New Cairo",
        cityAr: "القاهرة الجديدة",
        district: "Fifth Settlement",
        districtAr: "التجمع الخامس",
        lat: "30.0276",
        lng: "31.4913",
        deliveryDate: new Date("2024-06-30"),
        completionStatus: "ready",
        amenities: ["park", "gym", "clubhouse", "security", "commercial"],
        amenitiesAr: ["حديقة", "صالة رياضية", "نادي", "أمن", "تجاري"],
        description: "Premium residential compound with Central Park",
        descriptionAr: "كمبوند سكني راقي مع سنترال بارك",
        images: [
          "https://via.placeholder.com/800x600?text=Hyde+Park+1",
          "https://via.placeholder.com/800x600?text=Hyde+Park+2",
        ],
        totalUnits: 3000,
        featured: true,
      },
      {
        developerId: mountainView.id,
        name: "Mountain View iCity",
        nameAr: "ماونتن فيو آي سيتي",
        slug: "mountain-view-icity",
        city: "New Cairo",
        cityAr: "القاهرة الجديدة",
        district: "6th October City",
        districtAr: "مدينة 6 أكتوبر",
        lat: "29.9626",
        lng: "31.1656",
        deliveryDate: new Date("2026-12-31"),
        completionStatus: "construction",
        amenities: ["pool", "gym", "cinema", "park", "commercial", "medical"],
        amenitiesAr: ["مسبح", "صالة رياضية", "سينما", "حديقة", "تجاري", "طبي"],
        description: "Smart city with integrated services",
        descriptionAr: "مدينة ذكية بخدمات متكاملة",
        images: [
          "https://via.placeholder.com/800x600?text=iCity+1",
          "https://via.placeholder.com/800x600?text=iCity+2",
        ],
        totalUnits: 4500,
        featured: false,
      },
      // 6th of October Projects
      {
        developerId: sodic.id,
        name: "Eastown",
        nameAr: "إيست تاون",
        slug: "eastown-sodic",
        city: "6th of October",
        cityAr: "السادس من أكتوبر",
        district: "New Cairo",
        districtAr: "القاهرة الجديدة",
        lat: "30.0244",
        lng: "31.4185",
        deliveryDate: new Date("2024-12-31"),
        completionStatus: "ready",
        amenities: ["pool", "gym", "park", "clubhouse", "school"],
        amenitiesAr: ["مسبح", "صالة رياضية", "حديقة", "نادي", "مدرسة"],
        description: "Modern community with European architecture",
        descriptionAr: "مجتمع عصري بتصميم أوروبي",
        images: [
          "https://via.placeholder.com/800x600?text=Eastown+1",
          "https://via.placeholder.com/800x600?text=Eastown+2",
        ],
        totalUnits: 2000,
        featured: true,
      },
      {
        developerId: palmHills.id,
        name: "Palm Hills October",
        nameAr: "بالم هيلز أكتوبر",
        slug: "palm-hills-october",
        city: "6th of October",
        cityAr: "السادس من أكتوبر",
        district: "West",
        districtAr: "غرب",
        lat: "29.9797",
        lng: "30.9397",
        deliveryDate: new Date("2025-06-30"),
        completionStatus: "construction",
        amenities: ["golf", "pool", "gym", "spa", "commercial"],
        amenitiesAr: ["جولف", "مسبح", "صالة رياضية", "سبا", "تجاري"],
        description: "Luxury living with golf course",
        descriptionAr: "حياة فاخرة مع ملعب جولف",
        images: [
          "https://via.placeholder.com/800x600?text=Palm+Hills+1",
          "https://via.placeholder.com/800x600?text=Palm+Hills+2",
        ],
        totalUnits: 2500,
        featured: false,
      },
      // New Capital Projects
      {
        developerId: tmg.id,
        name: "Capital Heights",
        nameAr: "كابيتال هايتس",
        slug: "capital-heights",
        city: "New Capital",
        cityAr: "العاصمة الإدارية",
        district: "R7",
        districtAr: "R7",
        lat: "30.0131",
        lng: "31.7373",
        deliveryDate: new Date("2027-12-31"),
        completionStatus: "planning",
        amenities: ["pool", "gym", "spa", "park", "medical", "commercial"],
        amenitiesAr: ["مسبح", "صالة رياضية", "سبا", "حديقة", "طبي", "تجاري"],
        description: "Luxury towers in the heart of New Capital",
        descriptionAr: "أبراج فاخرة في قلب العاصمة الإدارية",
        images: [
          "https://via.placeholder.com/800x600?text=Capital+Heights+1",
          "https://via.placeholder.com/800x600?text=Capital+Heights+2",
        ],
        totalUnits: 1500,
        featured: true,
      },
      {
        developerId: emaar.id,
        name: "Mivida New Capital",
        nameAr: "ميفيدا العاصمة",
        slug: "mivida-new-capital",
        city: "New Capital",
        cityAr: "العاصمة الإدارية",
        district: "R8",
        districtAr: "R8",
        lat: "30.0244",
        lng: "31.7499",
        deliveryDate: new Date("2028-06-30"),
        completionStatus: "planning",
        amenities: ["park", "gym", "pool", "commercial", "school", "medical"],
        amenitiesAr: ["حديقة", "صالة رياضية", "مسبح", "تجاري", "مدرسة", "طبي"],
        description: "Green integrated community",
        descriptionAr: "مجتمع أخضر متكامل",
        images: [
          "https://via.placeholder.com/800x600?text=Mivida+1",
          "https://via.placeholder.com/800x600?text=Mivida+2",
        ],
        totalUnits: 3500,
        featured: false,
      },
    ])
    .returning();

  console.log("✅ Projects seeded");

  // Seed Units (varied properties)
  const unitsToInsert = [];
  
  for (const project of projectsData) {
    const numUnits = Math.floor(Math.random() * 8) + 4; // 4-12 units per project
    
    for (let i = 0; i < numUnits; i++) {
      const bedrooms = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
      const type = bedrooms === 1 ? "studio" : bedrooms <= 3 ? "apartment" : Math.random() > 0.5 ? "penthouse" : "villa";
      const size = bedrooms * 70 + Math.floor(Math.random() * 50) + 50;
      const pricePerSqm = 25000 + Math.floor(Math.random() * 15000);
      const price = size * pricePerSqm;
      
      unitsToInsert.push({
        projectId: project.id,
        unitNumber: `${project.slug.substring(0, 3).toUpperCase()}-${i + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 3))}`,
        type: type as any,
        bedrooms,
        bathrooms: String(bedrooms === 1 ? 1 : bedrooms === 2 ? 1.5 : bedrooms - 1),
        sizeSqm: String(size),
        priceEgp: String(price),
        priceUsd: String(Math.round(price / 50)), // Rough EGP to USD
        currency: "EGP",
        images: [
          `https://via.placeholder.com/800x600?text=Unit+${i + 1}+View+1`,
          `https://via.placeholder.com/800x600?text=Unit+${i + 1}+View+2`,
        ],
        floor: Math.floor(Math.random() * 15) + 1,
        view: ["garden", "pool", "street", "city"][Math.floor(Math.random() * 4)] as any,
        facing: ["north", "south", "east", "west"][Math.floor(Math.random() * 4)] as any,
        furnishing: ["unfurnished", "semi", "fully"][Math.floor(Math.random() * 3)] as any,
        paymentPlan: {
          downPaymentPercent: [10, 15, 20, 25][Math.floor(Math.random() * 4)],
          installmentYears: [5, 7, 10][Math.floor(Math.random() * 3)],
          installmentMonths: 0,
          monthlyInstallment: Math.round(price * 0.02),
        },
        availability: ["available", "available", "available", "reserved"][Math.floor(Math.random() * 4)] as any,
        features: ["balcony", "parking", "storage", "garden"].slice(0, Math.floor(Math.random() * 3) + 1),
        featuresAr: ["شرفة", "موقف سيارات", "مخزن", "حديقة"].slice(0, Math.floor(Math.random() * 3) + 1),
      });
    }
  }

  await db.insert(units).values(unitsToInsert);

  console.log(`✅ ${unitsToInsert.length} units seeded`);
  console.log("🎉 Database seeding completed!");
}

seed()
  .catch((error) => {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
