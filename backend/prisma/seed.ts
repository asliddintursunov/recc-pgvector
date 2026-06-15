import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

const PRODUCT_EMBEDDING_DIMENSIONS = 1536;

const users = [
  { id: '11111111-1111-4111-8111-111111111111', username: 'alice' },
  { id: '22222222-2222-4222-8222-222222222222', username: 'bekzod' },
  { id: '33333333-3333-4333-8333-333333333333', username: 'charlie' },
  { id: '44444444-4444-4444-8444-444444444444', username: 'dilnoza' },
  { id: '55555555-5555-4555-8555-555555555555', username: 'emily' },
];

const products = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    title: 'MacBook Air M3 13-inch',
    description: 'Lightweight laptop with Apple silicon, all-day battery life, and a bright Liquid Retina display.',
    tags: ['new', 'electronics', 'laptop'],
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    title: 'Dell XPS 15 Creator Laptop',
    description: 'Premium Windows laptop for design, video editing, and productivity workloads.',
    tags: ['new', 'electronics', 'laptop'],
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    title: 'Lenovo ThinkPad T14',
    description: 'Durable business laptop with comfortable keyboard and strong security features.',
    tags: ['used', 'electronics', 'laptop'],
  },
  {
    id: '00000000-0000-4000-8000-000000000004',
    title: 'iPhone 15 Pro',
    description: 'Flagship smartphone with titanium body, advanced camera system, and fast performance.',
    tags: ['new', 'electronics', 'smartphone'],
  },
  {
    id: '00000000-0000-4000-8000-000000000005',
    title: 'Samsung Galaxy S24',
    description: 'Android smartphone with bright display, AI photo tools, and long battery life.',
    tags: ['new', 'electronics', 'smartphone'],
  },
  {
    id: '00000000-0000-4000-8000-000000000006',
    title: 'Google Pixel 8a',
    description: 'Affordable smartphone with clean Android software and excellent computational photography.',
    tags: ['new', 'electronics', 'smartphone'],
  },
  {
    id: '00000000-0000-4000-8000-000000000007',
    title: 'Sony WH-1000XM5 Headphones',
    description: 'Wireless noise-canceling headphones for travel, focus, and high-quality music listening.',
    tags: ['new', 'audio', 'wireless'],
  },
  {
    id: '00000000-0000-4000-8000-000000000008',
    title: 'Apple AirPods Pro 2',
    description: 'Compact wireless earbuds with active noise cancellation and spatial audio.',
    tags: ['new', 'audio', 'wireless'],
  },
  {
    id: '00000000-0000-4000-8000-000000000009',
    title: 'JBL Flip 6 Portable Speaker',
    description: 'Waterproof Bluetooth speaker with punchy sound for outdoor use and small gatherings.',
    tags: ['new', 'audio', 'wireless'],
  },
  {
    id: '00000000-0000-4000-8000-000000000010',
    title: 'PlayStation 5 Slim',
    description: 'Current generation gaming console with fast SSD storage and immersive controller feedback.',
    tags: ['new', 'gaming', 'electronics'],
  },
  {
    id: '00000000-0000-4000-8000-000000000011',
    title: 'Nintendo Switch OLED',
    description: 'Portable gaming console with vivid OLED screen and flexible docked or handheld play.',
    tags: ['new', 'gaming', 'electronics'],
  },
  {
    id: '00000000-0000-4000-8000-000000000012',
    title: 'Xbox Wireless Controller',
    description: 'Comfortable wireless game controller for Xbox consoles, PC, and cloud gaming.',
    tags: ['new', 'gaming', 'wireless'],
  },
  {
    id: '00000000-0000-4000-8000-000000000013',
    title: 'Dyson V15 Detect Vacuum',
    description: 'Cordless vacuum cleaner with laser dust detection and powerful suction.',
    tags: ['new', 'home_appliance', 'wireless'],
  },
  {
    id: '00000000-0000-4000-8000-000000000014',
    title: 'Instant Pot Duo 7-in-1',
    description: 'Multi-cooker for pressure cooking, slow cooking, rice, steaming, and meal prep.',
    tags: ['new', 'home_appliance'],
  },
  {
    id: '00000000-0000-4000-8000-000000000015',
    title: 'Philips 3200 Espresso Machine',
    description: 'Automatic espresso machine for cappuccino, latte, and fresh coffee at home.',
    tags: ['new', 'home_appliance'],
  },
  {
    id: '00000000-0000-4000-8000-000000000016',
    title: 'IKEA Markus Office Chair',
    description: 'Ergonomic office chair with high back support for long work sessions.',
    tags: ['new', 'furniture'],
  },
  {
    id: '00000000-0000-4000-8000-000000000017',
    title: 'Standing Desk 140cm',
    description: 'Height-adjustable desk for home offices, study spaces, and hybrid work.',
    tags: ['new', 'furniture'],
  },
  {
    id: '00000000-0000-4000-8000-000000000018',
    title: 'Modern Bookshelf',
    description: 'Minimal wooden bookshelf for living rooms, bedrooms, and office organization.',
    tags: ['new', 'furniture', 'books'],
  },
  {
    id: '00000000-0000-4000-8000-000000000019',
    title: 'Nike Pegasus Running Shoes',
    description: 'Daily running shoes with responsive cushioning for road training and walking.',
    tags: ['new', 'fitness'],
  },
  {
    id: '00000000-0000-4000-8000-000000000020',
    title: 'Adjustable Dumbbell Set',
    description: 'Space-saving dumbbells for strength training at home.',
    tags: ['new', 'fitness'],
  },
  {
    id: '00000000-0000-4000-8000-000000000021',
    title: 'Fitbit Charge 6',
    description: 'Fitness tracker with heart rate monitoring, GPS, sleep insights, and wellness metrics.',
    tags: ['new', 'fitness', 'wireless'],
  },
  {
    id: '00000000-0000-4000-8000-000000000022',
    title: 'Atomic Habits by James Clear',
    description: 'Practical book about building better habits through small, consistent changes.',
    tags: ['new', 'books'],
  },
  {
    id: '00000000-0000-4000-8000-000000000023',
    title: 'Clean Code by Robert C. Martin',
    description: 'Software engineering book focused on readable, maintainable programming practices.',
    tags: ['new', 'books'],
  },
  {
    id: '00000000-0000-4000-8000-000000000024',
    title: 'The Pragmatic Programmer',
    description: 'Classic programming book covering professional habits, debugging, design, and craftsmanship.',
    tags: ['new', 'books'],
  },
  {
    id: '00000000-0000-4000-8000-000000000025',
    title: 'Used iPad Air 5',
    description: 'Pre-owned tablet with M1 chip, sharp display, and support for Apple Pencil.',
    tags: ['used', 'electronics'],
  },
  {
    id: '00000000-0000-4000-8000-000000000026',
    title: 'Used Canon EOS M50 Camera',
    description: 'Pre-owned mirrorless camera for photography, vlogging, and content creation.',
    tags: ['used', 'electronics'],
  },
  {
    id: '00000000-0000-4000-8000-000000000027',
    title: 'Logitech MX Master 3S Mouse',
    description: 'Wireless productivity mouse with quiet clicks, ergonomic shape, and fast scrolling.',
    tags: ['new', 'electronics', 'wireless'],
  },
  {
    id: '00000000-0000-4000-8000-000000000028',
    title: 'Keychron K2 Mechanical Keyboard',
    description: 'Compact wireless mechanical keyboard for office work, coding, and gaming setups.',
    tags: ['new', 'electronics', 'wireless'],
  },
  {
    id: '00000000-0000-4000-8000-000000000029',
    title: 'LG 27-inch 4K Monitor',
    description: 'High-resolution display for productivity, coding, design, and entertainment.',
    tags: ['new', 'electronics'],
  },
  {
    id: '00000000-0000-4000-8000-000000000030',
    title: 'Gaming Desk Mat XL',
    description: 'Large desk mat for keyboard, mouse, gaming accessories, and workspace protection.',
    tags: ['new', 'gaming', 'furniture'],
  },
] as const;

const interactions = [
  ['11111111-1111-4111-8111-111111111111', '00000000-0000-4000-8000-000000000001', 'like'],
  ['11111111-1111-4111-8111-111111111111', '00000000-0000-4000-8000-000000000002', 'click'],
  ['11111111-1111-4111-8111-111111111111', '00000000-0000-4000-8000-000000000023', 'like'],
  ['11111111-1111-4111-8111-111111111111', '00000000-0000-4000-8000-000000000028', 'search'],
  ['22222222-2222-4222-8222-222222222222', '00000000-0000-4000-8000-000000000010', 'like'],
  ['22222222-2222-4222-8222-222222222222', '00000000-0000-4000-8000-000000000011', 'click'],
  ['22222222-2222-4222-8222-222222222222', '00000000-0000-4000-8000-000000000012', 'like'],
  ['22222222-2222-4222-8222-222222222222', '00000000-0000-4000-8000-000000000030', 'search'],
  ['33333333-3333-4333-8333-333333333333', '00000000-0000-4000-8000-000000000007', 'like'],
  ['33333333-3333-4333-8333-333333333333', '00000000-0000-4000-8000-000000000008', 'click'],
  ['33333333-3333-4333-8333-333333333333', '00000000-0000-4000-8000-000000000009', 'search'],
  ['33333333-3333-4333-8333-333333333333', '00000000-0000-4000-8000-000000000027', 'click'],
  ['44444444-4444-4444-8444-444444444444', '00000000-0000-4000-8000-000000000013', 'like'],
  ['44444444-4444-4444-8444-444444444444', '00000000-0000-4000-8000-000000000014', 'click'],
  ['44444444-4444-4444-8444-444444444444', '00000000-0000-4000-8000-000000000016', 'like'],
  ['44444444-4444-4444-8444-444444444444', '00000000-0000-4000-8000-000000000017', 'search'],
  ['55555555-5555-4555-8555-555555555555', '00000000-0000-4000-8000-000000000019', 'like'],
  ['55555555-5555-4555-8555-555555555555', '00000000-0000-4000-8000-000000000020', 'click'],
  ['55555555-5555-4555-8555-555555555555', '00000000-0000-4000-8000-000000000021', 'like'],
  ['55555555-5555-4555-8555-555555555555', '00000000-0000-4000-8000-000000000022', 'search'],
] as const;

async function main() {
  const password = await hash('password123');
  const userIds = users.map((user) => user.id);
  const productIds = products.map((product) => product.id);

  await prisma.interaction.deleteMany({
    where: {
      userId: { in: userIds },
      productId: { in: productIds },
    },
  });

  for (const user of users) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: { password },
      create: {
        id: user.id,
        username: user.username,
        password,
      },
    });
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        title: product.title,
        description: product.description,
        tags: [...product.tags],
      },
      create: {
        id: product.id,
        title: product.title,
        description: product.description,
        tags: [...product.tags],
      },
    });

    await updateProductEmbedding(product.id, createProductEmbedding(product));
  }

  await prisma.interaction.createMany({
    data: interactions.map(([userId, productId, actionType]) => ({
      userId,
      productId,
      actionType,
    })),
  });

  console.log(`Seeded ${users.length} users, ${products.length} products, and ${interactions.length} interactions.`);
}

async function updateProductEmbedding(productId: string, embedding: number[]) {
  const vector = `[${embedding.join(',')}]`;

  await prisma.$executeRaw`
    UPDATE "Product"
    SET "embedding" = ${vector}::vector
    WHERE "id" = ${productId}
  `;
}

function createProductEmbedding(product: (typeof products)[number]): number[] {
  const vector = new Array<number>(PRODUCT_EMBEDDING_DIMENSIONS).fill(0);
  const tokens = [
    product.title,
    product.description,
    ...product.tags,
  ];

  for (const token of tokens) {
    addTokenVector(vector, token);
  }

  return normalizeVector(vector);
}

function addTokenVector(vector: number[], token: string) {
  let seed = hashString(token);

  for (let i = 0; i < vector.length; i++) {
    seed = nextSeed(seed);
    vector[i] += ((seed % 2000) / 1000 - 1) * tokenWeight(token);
  }
}

function tokenWeight(token: string): number {
  return token.includes(' ') ? 0.2 : 1;
}

function normalizeVector(vector: number[]): number[] {
  const length = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));

  return vector.map((value) => Number((value / length).toFixed(6)));
}

function hashString(value: string): number {
  let hashValue = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hashValue ^= value.charCodeAt(i);
    hashValue = Math.imul(hashValue, 16777619);
  }

  return hashValue >>> 0;
}

function nextSeed(seed: number): number {
  return (Math.imul(seed, 1664525) + 1013904223) >>> 0;
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
