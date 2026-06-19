import { PrismaClient, PRODUCT_TAG, USER_ROLE } from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient();

type SeedProduct = {
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
    tags: PRODUCT_TAG[];
};

const merchantUsername = "seed_merchant";
const merchantPassword = "password123";

const products: SeedProduct[] = [
    {
        title: "AeroBook Pro 14",
        description: "Lightweight laptop with a bright display, long battery life, and fast SSD storage for everyday productivity.",
        price: 1299,
        tags: [PRODUCT_TAG.new, PRODUCT_TAG.laptop, PRODUCT_TAG.electronics],
    },
    {
        title: "AeroBook Student 13",
        description: "Compact laptop for school, browsing, documents, and video calls with quiet cooling.",
        price: 749,
        tags: [PRODUCT_TAG.new, PRODUCT_TAG.laptop, PRODUCT_TAG.electronics],
    },
    {
        title: "Forge Gaming Laptop 16",
        description: "High-refresh gaming laptop with dedicated graphics, RGB keyboard, and advanced thermal design.",
        price: 1699,
        tags: [PRODUCT_TAG.gaming, PRODUCT_TAG.laptop, PRODUCT_TAG.electronics],
    },
    {
        title: "PixelWave X Phone",
        description: "Flagship smartphone with vivid OLED display, all-day battery, and a versatile camera system.",
        price: 999,
        tags: [PRODUCT_TAG.new, PRODUCT_TAG.smartphone, PRODUCT_TAG.electronics],
    },
    {
        title: "PixelWave Mini Phone",
        description: "Pocket-friendly smartphone with strong performance and wireless charging.",
        price: 699,
        tags: [PRODUCT_TAG.smartphone, PRODUCT_TAG.wireless, PRODUCT_TAG.electronics],
    },
    {
        title: "Used MetroPhone 11",
        description: "Pre-owned smartphone in good condition with fresh battery health and unlocked carrier support.",
        price: 329,
        tags: [PRODUCT_TAG.used, PRODUCT_TAG.smartphone, PRODUCT_TAG.electronics],
    },
    {
        title: "SonicPods Wireless Earbuds",
        description: "Compact wireless earbuds with active noise cancellation and pocket charging case.",
        price: 149,
        tags: [PRODUCT_TAG.audio, PRODUCT_TAG.wireless, PRODUCT_TAG.electronics],
    },
    {
        title: "SonicMax Over-Ear Headphones",
        description: "Comfortable over-ear headphones with deep bass, soft cushions, and Bluetooth multipoint.",
        price: 229,
        tags: [PRODUCT_TAG.audio, PRODUCT_TAG.wireless],
    },
    {
        title: "Studio USB Microphone",
        description: "Plug-and-play microphone for podcasts, streaming, meetings, and voice recording.",
        price: 119,
        tags: [PRODUCT_TAG.audio, PRODUCT_TAG.electronics],
    },
    {
        title: "ArcadeBox Console",
        description: "Family gaming console with fast storage, 4K output, and two wireless controllers.",
        price: 499,
        tags: [PRODUCT_TAG.gaming, PRODUCT_TAG.electronics, PRODUCT_TAG.wireless],
    },
    {
        title: "ProStrike Gaming Keyboard",
        description: "Mechanical keyboard with hot-swappable switches, compact layout, and customizable lighting.",
        price: 139,
        tags: [PRODUCT_TAG.gaming, PRODUCT_TAG.electronics],
    },
    {
        title: "SwiftAim Wireless Mouse",
        description: "Lightweight gaming mouse with low-latency wireless connection and programmable buttons.",
        price: 89,
        tags: [PRODUCT_TAG.gaming, PRODUCT_TAG.wireless, PRODUCT_TAG.electronics],
    },
    {
        title: "HomeChef Air Fryer",
        description: "Countertop air fryer with digital presets for quick meals and easy cleanup.",
        price: 129,
        tags: [PRODUCT_TAG.home_appliance, PRODUCT_TAG.new],
    },
    {
        title: "PureBrew Coffee Maker",
        description: "Programmable coffee maker with reusable filter, thermal carafe, and compact footprint.",
        price: 99,
        tags: [PRODUCT_TAG.home_appliance, PRODUCT_TAG.new],
    },
    {
        title: "CleanBot Vacuum",
        description: "Robot vacuum with app scheduling, smart mapping, and automatic recharge.",
        price: 349,
        tags: [PRODUCT_TAG.home_appliance, PRODUCT_TAG.wireless, PRODUCT_TAG.electronics],
    },
    {
        title: "Nordic Oak Desk",
        description: "Minimal writing desk with solid oak finish, cable cutout, and sturdy metal legs.",
        price: 279,
        tags: [PRODUCT_TAG.furniture, PRODUCT_TAG.new],
    },
    {
        title: "ErgoFlex Office Chair",
        description: "Adjustable office chair with lumbar support, breathable mesh, and smooth rolling casters.",
        price: 239,
        tags: [PRODUCT_TAG.furniture, PRODUCT_TAG.new],
    },
    {
        title: "Used Lounge Sofa",
        description: "Comfortable three-seat sofa with durable fabric and minor cosmetic wear.",
        price: 399,
        tags: [PRODUCT_TAG.used, PRODUCT_TAG.furniture],
    },
    {
        title: "FitTrack Smart Watch",
        description: "Fitness watch with heart-rate tracking, sleep insights, GPS workouts, and phone notifications.",
        price: 199,
        tags: [PRODUCT_TAG.fitness, PRODUCT_TAG.wireless, PRODUCT_TAG.electronics],
    },
    {
        title: "CoreBalance Yoga Mat",
        description: "Non-slip exercise mat with extra cushioning for yoga, stretching, and floor workouts.",
        price: 39,
        tags: [PRODUCT_TAG.fitness, PRODUCT_TAG.new],
    },
    {
        title: "IronFlex Dumbbell Set",
        description: "Adjustable dumbbell pair for compact strength training at home.",
        price: 249,
        tags: [PRODUCT_TAG.fitness],
    },
    {
        title: "JavaScript Patterns Handbook",
        description: "Practical programming book covering modern JavaScript architecture and reusable patterns.",
        price: 45,
        tags: [PRODUCT_TAG.books, PRODUCT_TAG.new],
    },
    {
        title: "Data Science Field Guide",
        description: "Beginner-friendly guide to data analysis, visualization, machine learning, and model evaluation.",
        price: 52,
        tags: [PRODUCT_TAG.books, PRODUCT_TAG.new],
    },
    {
        title: "Used Fantasy Novel Collection",
        description: "Set of five pre-owned fantasy novels with light shelf wear.",
        price: 34,
        tags: [PRODUCT_TAG.used, PRODUCT_TAG.books],
    },
    {
        title: "CinemaView 32 Monitor",
        description: "Large 4K monitor with accurate colors, USB-C input, and ergonomic stand.",
        price: 599,
        tags: [PRODUCT_TAG.electronics, PRODUCT_TAG.new],
    },
    {
        title: "StreamCam 4K Webcam",
        description: "High-resolution webcam with autofocus, dual microphones, and privacy cover.",
        price: 159,
        tags: [PRODUCT_TAG.electronics, PRODUCT_TAG.audio],
    },
    {
        title: "ChargeHub Wireless Stand",
        description: "Three-in-one wireless charging stand for phone, earbuds, and watch.",
        price: 79,
        tags: [PRODUCT_TAG.wireless, PRODUCT_TAG.smartphone, PRODUCT_TAG.electronics],
    },
    {
        title: "KitchenScale Digital Pro",
        description: "Precise digital kitchen scale with tare function, stainless platform, and bright LCD.",
        price: 29,
        tags: [PRODUCT_TAG.home_appliance],
    },
    {
        title: "RetroGame Controller",
        description: "Bluetooth controller inspired by classic consoles with modern low-latency support.",
        price: 59,
        tags: [PRODUCT_TAG.gaming, PRODUCT_TAG.wireless],
    },
    {
        title: "Reading Lamp Flex",
        description: "Adjustable LED desk lamp with touch dimming, warm light mode, and USB charging port.",
        price: 69,
        tags: [PRODUCT_TAG.furniture, PRODUCT_TAG.electronics],
    },
];

function buildEmbedding(product: SeedProduct): number[] {
    const tagScore = product.tags.reduce((total, tag) => total + tag.length, 0);
    const text = `${product.title} ${product.description}`;

    return Array.from({ length: 1536 }, (_, index) => {
        const charCode = text.charCodeAt(index % text.length);
        const wave = Math.sin((index + 1) * (tagScore + 1) * 0.013);
        const value = ((charCode % 37) / 37 + wave) / 2;

        return Number(value.toFixed(6));
    });
}

async function main() {
    const password = await hash(merchantPassword);

    const merchant = await prisma.user.upsert({
        where: { username: merchantUsername },
        update: {
            password,
            role: USER_ROLE.merchant,
        },
        create: {
            username: merchantUsername,
            password,
            role: USER_ROLE.merchant,
        },
    });

    await prisma.$transaction(async (tx) => {
        const existingProducts = await tx.product.findMany({
            where: { merchantId: merchant.id },
            select: { id: true },
        });
        const existingProductIds = existingProducts.map((product) => product.id);

        if (existingProductIds.length > 0) {
            await tx.interaction.deleteMany({
                where: { productId: { in: existingProductIds } },
            });
            await tx.purchaseHistory.deleteMany({
                where: { productId: { in: existingProductIds } },
            });
            await tx.product.deleteMany({
                where: { id: { in: existingProductIds } },
            });
        }

        for (const product of products) {
            const createdProduct = await tx.product.create({
                data: {
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    tags: product.tags,
                    merchantId: merchant.id,
                },
            });
            const embedding = `[${buildEmbedding(product).join(",")}]`;

            await tx.$executeRaw`
                UPDATE "Product"
                SET "embedding" = ${embedding}::vector
                WHERE "id" = ${createdProduct.id}
            `;
        }
    });

    console.log(`Seeded merchant: ${merchantUsername} / ${merchantPassword}`);
    console.log(`Seeded ${products.length} products.`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
