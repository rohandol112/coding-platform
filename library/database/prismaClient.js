/**
 * @fileoverview Prisma Client Singleton
 * Single source of truth for database access
 */

import { PrismaClient } from '@prisma/client';

/**
 * Prisma client singleton
 * Ensures only one instance across the application
 */
class DatabaseClient {
  constructor() {
    if (!DatabaseClient.instance) {
      this.prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
      DatabaseClient.instance = this;
    }
    return DatabaseClient.instance;
  }

  /**
   * Get Prisma client instance
   * @returns {PrismaClient}
   */
  getClient() {
    return this.prisma;
  }

  /**
   * Disconnect from database
   * @returns {Promise<void>}
   */
  async disconnect() {
    await this.prisma.$disconnect();
  }
}

// Export singleton instance
const dbClient = new DatabaseClient();
export default dbClient.getClient();
