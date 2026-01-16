import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create test user
  const hashedPassword = await bcrypt.hash('TestPassword123!', 12);

  const user = await prisma.user.upsert({
    where: { email: 'test@file.energy' },
    update: {},
    create: {
      email: 'test@file.energy',
      username: 'testuser',
      password: hashedPassword,
      isActive: true,
      role: 'USER',
    },
  });

  console.log('Created user:', user.email);

  // Create or get a plan
  let plan = await prisma.plan.findFirst({
    where: { name: 'Pro' },
  });

  if (!plan) {
    plan = await prisma.plan.create({
      data: {
        name: 'Pro',
        price: 19.99,
        pdfs: 50,
        questions: 500,
        pdfSize: 25,
        pdfPages: 100,
        status: true,
      },
    });
    console.log('Created plan:', plan.name);
  }

  // Create subscription with credits
  const expiringAt = new Date();
  expiringAt.setFullYear(expiringAt.getFullYear() + 1);

  // Delete existing subscription for this user first
  await prisma.subscription.deleteMany({
    where: { userId: user.id },
  });

  const subscription = await prisma.subscription.create({
    data: {
      userId: user.id,
      planId: plan.id,
      status: 'ACTIVE',
      paymentGateway: 'test',
      pdfs: 45,
      questions: 480,
      pdfSize: 25,
      pdfPages: 100,
      currency: 'EUR',
      expiringAt,
    },
  });

  console.log('Created subscription with:', {
    pdfs: subscription.pdfs,
    questions: subscription.questions,
    status: subscription.status,
  });

  // Delete existing chats for this user
  await prisma.chat.deleteMany({
    where: { userId: user.id },
  });

  // Create sample chat/document records
  const chats = [
    {
      title: 'Q3 Financial Report.pdf',
      chatHistory: JSON.stringify([
        { type: 'human', content: 'What were the total revenues in Q3?', timestamp: new Date().toISOString() },
        { type: 'ai', content: 'According to the Q3 Financial Report, total revenues were $2.4 million, representing a 15% increase from Q2.', timestamp: new Date().toISOString() },
      ]),
    },
    {
      title: 'Product Requirements Doc.docx',
      chatHistory: JSON.stringify([
        { type: 'human', content: 'Summarize the key features', timestamp: new Date().toISOString() },
        { type: 'ai', content: 'The key features outlined in this PRD include: 1) User authentication with SSO, 2) Real-time collaboration, 3) Export to multiple formats, 4) AI-powered insights.', timestamp: new Date().toISOString() },
      ]),
    },
    {
      title: 'Research Paper - AI Trends 2025.pdf',
      chatHistory: JSON.stringify([
        { type: 'human', content: 'What are the main AI trends predicted?', timestamp: new Date().toISOString() },
        { type: 'ai', content: 'The paper highlights 5 major AI trends for 2025: 1) Multimodal AI systems, 2) AI agents for automation, 3) Edge AI deployment, 4) Responsible AI frameworks, 5) AI in healthcare breakthroughs.', timestamp: new Date().toISOString() },
      ]),
    },
  ];

  for (const chatData of chats) {
    await prisma.chat.create({
      data: {
        userId: user.id,
        title: chatData.title,
        chatHistory: chatData.chatHistory,
        path: chatData.title,
      },
    });
  }

  console.log('Created', chats.length, 'sample documents/chats');

  console.log('\n✅ Test user ready:');
  console.log('   Email: test@file.energy');
  console.log('   Password: TestPassword123!');
  console.log('   PDFs remaining: 45');
  console.log('   Questions remaining: 480');
  console.log('   Documents: 3');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
