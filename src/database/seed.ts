/**
 * HomeVistaa Database Seed Script
 *
 * Seeds the database with:
 * - Admin user
 * - Builders
 * - Properties (from frontend mockData)
 * - Blogs (from frontend mockData)
 * - Interior Designs (from frontend mockData)
 *
 * Run with: npm run db:seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function paise(crore: number): bigint {
  return BigInt(Math.round(crore));
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

async function seedAdminUser(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@homevistaa.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@123456';
  const adminName = process.env.ADMIN_NAME ?? 'Admin';

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log('  ⏭  Admin already exists, skipping');
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.create({
    data: { name: adminName, email: adminEmail, passwordHash, role: 'admin', emailVerified: true },
  });
  console.log(`  ✅ Admin created: ${adminEmail}`);
}

async function seedBuilders() {
  const builders = [
    {
      id: 'b-1', name: 'Aura Heights Developers', logo: 'AH', rating: 4.8, experience: 25,
      projectsCount: 142,
      description: 'Aura Heights is a pioneer in luxury living, constructing iconic high-rise residential properties with gold-standard amenities and architectural brilliance.',
    },
    {
      id: 'b-2', name: 'Vanguard Realty Group', logo: 'VR', rating: 4.6, experience: 18,
      projectsCount: 88,
      description: 'Vanguard Realty focuses on sustainable urban planning, offering eco-friendly apartments and green villaments with high-tech automation features.',
    },
    {
      id: 'b-3', name: 'Meridian Estates', logo: 'ME', rating: 4.9, experience: 30,
      projectsCount: 210,
      description: 'Meridian Estates has defined skyline luxury for three decades, specializing in premium waterfront villas and commercial spaces in major economic hubs.',
    },
    {
      id: 'b-4', name: 'Skyline Infrastructure', logo: 'SI', rating: 4.4, experience: 12,
      projectsCount: 45,
      description: 'Skyline Infrastructure delivers premium design aesthetics at accessible prices, bridging the gap between quality construction and modern architecture.',
    },
  ];

  for (const builder of builders) {
    await prisma.builder.upsert({
      where: { id: builder.id },
      create: builder,
      update: builder,
    });
  }
  console.log(`  ✅ ${builders.length} builders seeded`);
}

async function seedProperties(): Promise<void> {
  const properties = [
    {
      id: 'prop-1',
      title: 'The Obsidian Pavilion',
      description: 'A masterpiece of contemporary architecture, the Obsidian Pavilion rises above the skyline offering panoramic ocean views, private elevator access, and a custom temperature-controlled infinity pool.',
      price: paise(45000000),
      priceFormatted: '₹ 4.50 Cr',
      location: 'Worli, South Mumbai',
      locality: 'Worli',
      city: 'Mumbai',
      type: 'apartment' as const,
      beds: 3, baths: 4, area: 2850, pricePerSqFt: 15789,
      possessionDate: 'Ready to Move', possessionStatus: 'ready' as const,
      reraId: 'P51900010943', featured: true, rating: 4.9, verified: true,
      builderId: 'b-1',
      amenities: ['Infinity Pool', 'Private Elevator', '24/7 Concierge', 'Home Automation', 'Gymnasium', 'Valet Parking', 'Sky Lounge'],
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
      ],
      floorPlans: [
        { name: '3 BHK Royal Suite (East)', beds: 3, baths: 4, area: 2850, price: paise(45000000), image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80' },
      ],
      distanceHubs: [
        { place: 'Bandra-Worli Sea Link', distance: '1.5 km' },
        { place: 'Chhatrapati Shivaji Airport', distance: '14.2 km' },
        { place: 'Phoenix Palladium Mall', distance: '3.0 km' },
      ],
    },
    {
      id: 'prop-2',
      title: 'Meridian Whispering Palms',
      description: 'Tucked away in the serene greenery of Whitefield, Meridian Whispering Palms features ultra-luxury triplex villas with expansive private terrace gardens.',
      price: paise(32000000),
      priceFormatted: '₹ 3.20 Cr',
      location: 'Whitefield, Bangalore',
      locality: 'Whitefield',
      city: 'Bangalore',
      type: 'villa' as const,
      beds: 4, baths: 5, area: 4200, pricePerSqFt: 7619,
      possessionDate: 'Dec 2027', possessionStatus: 'under_construction' as const,
      reraId: 'PRM/KA/RERA/1251/446/PR/220526/004910', featured: true, rating: 4.8, verified: true,
      builderId: 'b-3',
      amenities: ['Private Garden', 'Clubhouse', 'Tennis Court', 'Solar Power Grid', 'Pet Park', 'Swimming Pool', 'EV Charging Point'],
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      ],
      floorPlans: [
        { name: '4 BHK Grand Villa', beds: 4, baths: 5, area: 4200, price: paise(32000000), image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80' },
      ],
      distanceHubs: [
        { place: 'ITPL Tech Park', distance: '2.1 km' },
        { place: 'Whitefield Metro Station', distance: '1.8 km' },
        { place: 'Manipal Hospital', distance: '3.5 km' },
      ],
    },
    {
      id: 'prop-3',
      title: 'Aura Prime Boulevard',
      description: 'A premium commercial business complex designed for enterprise hubs with Grade A retail shops and corporate glass offices.',
      price: paise(18000000),
      priceFormatted: '₹ 1.80 Cr',
      location: 'BKC, Mumbai',
      locality: 'Bandra Kurla Complex',
      city: 'Mumbai',
      type: 'commercial' as const,
      commercialType: 'office' as const,
      area: 1200, pricePerSqFt: 15000,
      possessionDate: 'Ready to Move', possessionStatus: 'ready' as const,
      featured: true, rating: 4.7, verified: true,
      builderId: 'b-1',
      amenities: ['High-Speed Fiber', 'Central AC', 'Double Height Lobby', 'Multi-Level Parking', 'Power Backup', 'CCTV Surveillance'],
      images: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
      ],
      floorPlans: [],
      distanceHubs: [
        { place: 'BKC Metro Station', distance: '0.5 km' },
        { place: 'CSIA Airport', distance: '8.0 km' },
      ],
    },
    {
      id: 'prop-4',
      title: 'Skyline Serenity Residences',
      description: 'Modern 2 BHK apartments with premium finishes in the heart of Delhi NCR, perfect for young professionals.',
      price: paise(8500000),
      priceFormatted: '₹ 85 Lakh',
      location: 'Sector 54, Gurgaon',
      locality: 'Sector 54',
      city: 'Delhi NCR',
      type: 'apartment' as const,
      beds: 2, baths: 2, area: 1100, pricePerSqFt: 7727,
      possessionDate: 'Mar 2026', possessionStatus: 'ready' as const,
      featured: false, rating: 4.5, verified: true,
      builderId: 'b-4',
      amenities: ['Rooftop Terrace', 'Co-working Space', 'Smart Home', 'EV Charging', 'Gymnasium'],
      images: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?auto=format&fit=crop&w=800&q=80',
      ],
      floorPlans: [
        { name: '2 BHK Premium', beds: 2, baths: 2, area: 1100, price: paise(8500000), image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80' },
      ],
      distanceHubs: [
        { place: 'HUDA City Centre Metro', distance: '1.2 km' },
        { place: 'Cyber City', distance: '3.5 km' },
      ],
    },
    {
      id: 'prop-5',
      title: 'Dubai Marina Pinnacle Tower',
      description: 'Breathtaking waterfront luxury apartments in Dubai Marina with unobstructed sea views and direct yacht berth access.',
      price: paise(125000000),
      priceFormatted: '₹ 12.50 Cr',
      location: 'Dubai Marina, UAE',
      locality: 'Dubai Marina',
      city: 'Dubai',
      type: 'apartment' as const,
      beds: 3, baths: 4, area: 3200, pricePerSqFt: 39062,
      possessionDate: 'Ready to Move', possessionStatus: 'ready' as const,
      reraId: 'DXB-RERA-2023-1482', featured: true, rating: 5.0, verified: true,
      builderId: 'b-2',
      amenities: ['Private Beach', 'Infinity Pool', 'Yacht Berth', '24/7 Butler', 'Helipad', 'Spa & Wellness', 'Concierge'],
      images: [
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
      ],
      floorPlans: [
        { name: '3 BHK Sea View Suite', beds: 3, baths: 4, area: 3200, price: paise(125000000), image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
      ],
      distanceHubs: [
        { place: 'Dubai Marina Mall', distance: '0.3 km' },
        { place: 'DMCC Metro Station', distance: '0.8 km' },
        { place: 'Dubai International Airport', distance: '28.0 km' },
      ],
    },
  ];

  for (const prop of properties) {
    const { amenities, images, floorPlans, distanceHubs, ...propertyData } = prop;
    await prisma.property.upsert({
      where: { id: propertyData.id },
      create: {
        ...propertyData,
        amenities: { create: amenities.map((amenity) => ({ amenity })) },
        images: { create: images.map((url, idx) => ({ url, isPrimary: idx === 0, sortOrder: idx })) },
        floorPlans: { create: floorPlans },
        distanceHubs: { create: distanceHubs },
      },
      update: {},
    });
  }
  console.log(`  ✅ ${properties.length} properties seeded`);
}

async function seedBlogs(): Promise<void> {
  const blogs = [
    { category: 'legal' as const, title: 'Understanding RERA Regulations: A Buyer Guide', description: 'Demystifying the Real Estate Regulation Act. Learn how to verify builder project registry states, interpret possession delays, and claim refunds.', author: 'Adv. Sameer Sen', readTime: '6 min read', image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80' },
    { category: 'finance' as const, title: 'How Floating Interest Rates Work in Mortgages', description: 'An in-depth analysis of floating vs. fixed home loan rates. Know how RBI repo rate changes impact tenure schedules and monthly EMI calculations.', author: 'Nisha Kapoor (CFA)', readTime: '5 min read', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80' },
    { category: 'investment' as const, title: 'Top Localities for Villa Acquisitions in Bangalore', description: 'Whitefield, Devanahalli, or Sarjapur? Audit spatial parameters, tech corridor distance metrics, and historical appreciation values.', author: 'Vikram Malhotra', readTime: '8 min read', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80' },
    { category: 'design' as const, title: 'Modular Kitchen Space Optimizations for Penthouses', description: 'Maximize space with sleek L-shaped countertops, integrated pull-out pantries, quartz backsplash designs, and warm LED setups.', author: 'Kabir Dev (Architect)', readTime: '4 min read', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80' },
    { category: 'legal' as const, title: 'The Blueprint for Drafting Online Rental Agreements', description: 'Verify e-stamping legal validity, draft proper termination notification clauses, and prevent common registry disputes.', author: 'Adv. Sameer Sen', readTime: '5 min read', image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80' },
    { category: 'investment' as const, title: 'Dubai Waterfront Skyscraper Growth Capital Metrics', description: 'Analyze Dubai Marina yacht club rental yields, tax-free offshore registry rules, and high-tier inventory appreciations.', author: 'Sanjay Dutt (Partner)', readTime: '7 min read', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80' },
  ];

  for (const blog of blogs) {
    await prisma.blog.create({ data: blog }).catch(() => {}); // skip duplicates
  }
  console.log(`  ✅ ${blogs.length} blog articles seeded`);
}

async function seedInteriors(): Promise<void> {
  const designs = [
    { roomType: 'kitchen' as const, title: 'The Italian Obsidian Kitchen', description: 'Deep charcoal matte modular drawers, integrated smart dishwasher drawers, built-in dual convection ovens, and gold-veined Calacatta marble countertops.', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80', specsJson: ['Calacatta Marble', 'Charcoal Matte', 'Smart Integration', 'Soft Close'] },
    { roomType: 'kitchen' as const, title: 'Minimalist Alabaster Galley', description: 'Streamlined handle-less overhead cabinets, hidden range hoods, warm under-cabinet LED setups, and seamless scratch-resistant white quartz surfaces.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', specsJson: ['Quartz Tops', 'Under-cabinet LEDs', 'Push-to-open', 'Alabaster White'] },
    { roomType: 'bedroom' as const, title: 'The Royal Velvet Suite', description: 'Double-height velvet tufted master headboards, integrated reading spotlights, custom floating bedside tables, and modular walk-in glass wardrobe units.', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80', specsJson: ['Velvet Tufted', 'Glass Wardrobes', 'Floating Sideboards', 'Ambient Spotlight'] },
    { roomType: 'bedroom' as const, title: 'Sleek Walnut Sanctuary', description: 'Rich walnut timber veneer backings, hidden floor-level wash-light strips, minimalist platform bed sets, and full-length bronzed privacy mirror modules.', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80', specsJson: ['Walnut Veneer', 'Platform Bed', 'Wash-light LEDs', 'Bronze Mirror'] },
    { roomType: 'living' as const, title: 'Obsidian Sky Lounge Living', description: 'L-shaped premium mohair sofas, floating geometric entertainment consoles, brushed brass accent walls, and custom acoustic ceiling panelling.', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80', specsJson: ['Mohair Fabric', 'Brass Accents', 'Acoustic Ceilings', 'Floating TV Unit'] },
    { roomType: 'living' as const, title: 'Nordic Ivory Retreat', description: 'Clean Scandinavian-inspired white oak shelving, natural stone feature walls, sculptural pendant lighting, and cream bouclé accent chairs.', image: 'https://images.unsplash.com/photo-1567225477277-c8162eb8e073?auto=format&fit=crop&w=600&q=80', specsJson: ['White Oak', 'Stone Wall', 'Pendant Lighting', 'Bouclé Upholstery'] },
  ];

  for (const design of designs) {
    await prisma.interiorDesign.create({ data: design }).catch(() => {});
  }
  console.log(`  ✅ ${designs.length} interior designs seeded`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log('\n🌱 Starting database seed...\n');

  await seedAdminUser();
  await seedBuilders();
  await seedProperties();
  await seedBlogs();
  await seedInteriors();

  console.log('\n✅ Database seeded successfully!\n');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
