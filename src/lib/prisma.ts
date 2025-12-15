import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as any;

export const prisma =
  globalForPrisma.prisma ||  // Use existing PrismaClient if it exists
  new PrismaClient({          // Otherwise, create a new one
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') 
  globalForPrisma.prisma = prisma; // Cache the client for hot reload in dev
