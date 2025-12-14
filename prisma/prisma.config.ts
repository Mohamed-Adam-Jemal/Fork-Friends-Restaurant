export default defineConfig({
  schema: './prisma/schema.prisma',
  client: {
    // Pass database URL directly
    directUrl: process.env.DATABASE_URL!,
  },
});
