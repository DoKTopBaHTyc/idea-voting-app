import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const data = [
    {
      title: "Dark mode",
      description: "Add a dark theme for better night usability",
    },
    {
      title: "Mobile onboarding",
      description: "Improve first-time mobile user flow",
    },
    {
      title: "Plugin API",
      description: "Allow third-party plugins to extend product",
    },
    {
      title: "Analytics dashboard",
      description: "Custom analytics for power users",
    },
    { title: "Export to CSV", description: "Ability to export data to CSV" },
    {
      title: "Multi-language support",
      description: "Add translations for key languages",
    },
    {
      title: "Realtime collaboration",
      description: "Multiple users editing at once",
    },
    { title: "SSO login", description: "Support Google/Apple/SSO sign-in" },
    {
      title: "Inline editor improvements",
      description: "Faster and richer editing experience",
    },
    {
      title: "Custom themes",
      description: "Allow users to create custom UI themes",
    },
    {
      title: "Performance audit",
      description: "Identify and fix key performance bottlenecks",
    },
    {
      title: "Database optimization",
      description: "Improve query performance and scalability",
    },
    {
      title: "Offline mode",
      description: "Basic functionality available without internet",
    },
    {
      title: "Progressive Web App (PWA)",
      description: "Installable app-like experience in browser",
    },
    {
      title: "Two-factor authentication (2FA)",
      description: "Add an extra layer of account security",
    },
    {
      title: "Audit log",
      description: "Track user actions for security and compliance",
    },
    {
      title: "Role-based access control",
      description: "Fine-grained permissions for teams",
    },
    {
      title: "Data encryption at rest",
      description: "Enhance security for stored user data",
    },
    {
      title: "Advanced search & filters",
      description: "Find content with powerful search operators",
    },
    {
      title: "Templates library",
      description: "Pre-built templates for quick start",
    },
    {
      title: "Keyboard shortcuts",
      description: "Boost productivity with extensive keyboard support",
    },
    {
      title: "Command palette",
      description: "Quick access to actions via a command menu",
    },
    {
      title: "Automation rules",
      description: 'Let users create custom "if-this-then-that" rules',
    },
    {
      title: "Version history",
      description: "View and restore previous versions of content",
    },
    {
      title: "Bookmarks & favorites",
      description: "Allow users to mark and quickly access important items",
    },
    {
      title: "Slack/Discord integration",
      description: "Receive notifications and take action from chat",
    },
    {
      title: "API rate limiting",
      description: "Manage API load and ensure stability",
    },
    {
      title: "Webhooks",
      description: "Send real-time data to other apps on events",
    },
    {
      title: "Team workspaces",
      description: "Separate spaces for different teams or projects",
    },
    {
      title: "Guest collaborators",
      description: "Invite external users with limited access",
    },
  ];

  for (const item of data) {
    await prisma.idea.create({ data: item });
  }

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
