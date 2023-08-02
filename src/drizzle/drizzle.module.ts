import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { createConnection } from 'mysql2';
import { ConfigService } from '@nestjs/config';
export const MYSQL_CONNECTION = 'MYSQL_CONNECTION';
@Module({
  providers: [
    {
      provide: MYSQL_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connection = createConnection({
          host: configService.get('HOST_MYSQL'),
          user: configService.get('USER_MYSQL'),
          port: 3306,
          database: configService.get('DB_MYSQL'),
          password: configService.get('PASS_MYSQL'),
        });
        const db = drizzle(connection);
        // this will automatically run needed migrations on the database
        // await migrate(db, { migrationsFolder: './drizzle' });
        return db;
      },
    },
  ],
  exports: [MYSQL_CONNECTION],
})
export class DrizzleModule {}
