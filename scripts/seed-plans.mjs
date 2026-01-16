import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const plans = [
  {
    id: "1",
    name: "Basic",
    description: "Perfect for getting started",
    price: 7.99,
    features: JSON.stringify(["10 Documents", "Max document size: 15MB/pdf", "150 document questions"]),
    status: true,
    isFree: false,
    isPopular: false,
    billingCycle: "monthly",
    pdfs: 10,
    questions: 150,
    pdfSize: 15,
    pdfPages: 100,
  },
  {
    id: "2",
    name: "Intermediate",
    description: "For growing needs",
    price: 19.99,
    features: JSON.stringify(["20 Documents", "Max document size: 20MB/pdf", "250 document questions"]),
    status: true,
    isFree: false,
    isPopular: false,
    billingCycle: "monthly",
    pdfs: 20,
    questions: 250,
    pdfSize: 20,
    pdfPages: 150,
  },
  {
    id: "3",
    name: "Advanced",
    description: "Most popular choice",
    price: 34.99,
    features: JSON.stringify(["40 Documents", "Max document size: 35MB/pdf", "400 document questions"]),
    status: true,
    isFree: false,
    isPopular: true,
    billingCycle: "monthly",
    pdfs: 40,
    questions: 400,
    pdfSize: 35,
    pdfPages: 200,
  },
  {
    id: "4",
    name: "Professional",
    description: "For power users",
    price: 59.99,
    features: JSON.stringify(["70 Documents", "Max document size: 50MB/pdf", "700 document questions"]),
    status: true,
    isFree: false,
    isPopular: false,
    billingCycle: "monthly",
    pdfs: 70,
    questions: 700,
    pdfSize: 50,
    pdfPages: 300,
  },
];

async function main() {
  console.log("Seeding plans...");

  for (const plan of plans) {
    const result = await prisma.plan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    });
    console.log(`Upserted plan: ${result.name} (ID: ${result.id})`);
  }

  console.log("\nAll plans:");
  const allPlans = await prisma.plan.findMany();
  console.log(allPlans);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
