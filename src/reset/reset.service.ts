import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { MYSQL_CONNECTION } from 'src/drizzle/drizzle.module';
import resetEntity, { resetNew, resetSelect } from './entities/reset.entity';
import { SQL } from 'drizzle-orm';

@Injectable()
export class ResetService {
  constructor(
    @Inject(MYSQL_CONNECTION) protected readonly db: MySql2Database,
  ) {}

  async save(newToken: resetNew) {
    return await this.db.insert(resetEntity).values(newToken);
  }

  async findOne(options: SQL<unknown>): Promise<resetSelect> {
    const find = await this.db
      .selectDistinct()
      .from(resetEntity)
      .where(options);
    return find[0];
  }

  async delete(options: SQL<unknown>) {
    return await this.db.delete(resetEntity).where(options);
  }
}
