import { PrismaClient } from '@prisma/client';

// Shared Prisma client singleton (Next.js global pattern)
// Prevents connection pool exhaustion from creating new clients per request
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
