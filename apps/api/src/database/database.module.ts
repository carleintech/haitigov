import { createDatabaseClient, type PrismaClient } from "@haitigov/database";
import { Global, Injectable, Module, type OnModuleDestroy } from "@nestjs/common";

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  readonly client: PrismaClient;

  constructor() {
    this.client = createDatabaseClient();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }
}

@Global()
@Module({
  exports: [DatabaseService],
  providers: [DatabaseService],
})
// NestJS uses this metadata-only class as the global database module token.
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DatabaseModule {}
