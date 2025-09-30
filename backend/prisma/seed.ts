import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const data = [
    { title: 'Dark mode', description: 'Add a dark theme for better night usability' },
    { title: 'Mobile onboarding', description: 'Improve first-time mobile user flow' },
    { title: 'Plugin API', description: 'Allow third-party plugins to extend product' },
    { title: 'Analytics dashboard', description: 'Custom analytics for power users' },
    { title: 'Export to CSV', description: 'Ability to export data to CSV' },
    { title: 'Multi-language support', description: 'Add translations for key languages' },
    { title: 'Realtime collaboration', description: 'Multiple users editing at once' },
    { title: 'SSO login', description: 'Support Google/Apple/SSO sign-in' },
    { title: 'Inline editor improvements', description: 'Faster and richer editing experience' },
    { title: 'Custom themes', description: 'Allow users to create custom UI themes' }
  ];

  for (const item of data) {
    await prisma.idea.create({ data: item });
  }

  console.log('Seed completed');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
