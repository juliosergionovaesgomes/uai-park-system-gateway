import userEntity, { UserNew, UserSelect } from 'src/user/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { MySql2Database } from 'drizzle-orm/mysql2';
import { MYSQL_CONNECTION } from 'src/drizzle/drizzle.module';
import { SQL, eq, sql } from 'drizzle-orm';

@Injectable()
export class UserService {
  constructor(
    @Inject(MYSQL_CONNECTION) protected readonly db: MySql2Database,
  ) {}

  async save(newUser: UserNew): Promise<UserSelect> {
    const [infoInsert, _dados] = await this.db
      .insert(userEntity)
      .values(newUser);

    // return user inseting
    return await this.db
      .select()
      .from(userEntity)
      .where(eq(userEntity.id, infoInsert.insertId))[0];
  }

  async findOne(options: SQL<unknown>): Promise<UserSelect> {
    const user = await this.db.select().from(userEntity).where(options);
    return user[0];
  }

  async updatePassword(optionsWhere: SQL<unknown>, user: { password: string }) {
    return await this.db.update(userEntity).set(user).where(optionsWhere);
  }
  async update(optionsWhere: SQL<unknown>, user: object) {
    return await this.db.update(userEntity).set(user).where(optionsWhere);
  }
}
