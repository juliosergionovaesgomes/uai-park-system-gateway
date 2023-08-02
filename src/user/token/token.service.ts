import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { MYSQL_CONNECTION } from 'src/drizzle/drizzle.module';
import tokenEntity, {
  tokenNew,
  tokenSelect,
} from '../entities/revokeToken.entity';
import { SQL, eq } from 'drizzle-orm';

@Injectable()
export class TokenService {
  constructor(
    @Inject(MYSQL_CONNECTION) protected readonly db: MySql2Database,
  ) {}

  async save(newToken: tokenNew) {
    return await this.db.insert(tokenEntity).values(newToken);
  }

  async findOne(options: SQL<unknown>): Promise<tokenSelect> {
    const find = await this.db
      .selectDistinct()
      .from(tokenEntity)
      .where(options);
    return find[0];
  }

  async delete(options: SQL<unknown>) {
    return await this.db.delete(tokenEntity).where(options);
  }
}
