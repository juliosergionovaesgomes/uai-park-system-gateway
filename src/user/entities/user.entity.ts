import { InferModel } from 'drizzle-orm';
import {
  serial,
  mysqlTable,
  text,
  unique,
  varchar,
} from 'drizzle-orm/mysql-core';

const userEntity = mysqlTable(
  'user',
  {
    id: serial('id').primaryKey(),
    first_name: text('first_name').notNull(),
    last_name: text('last_name').notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    tfa_secret: varchar('tfa_secret', { length: 255 }).default(''),
    password: text('password').notNull(),
  },
  (t) => ({
    email: unique().on(t.email),
  }),
);
export type UserSelect = InferModel<typeof userEntity, 'select'>;
export type UserNew = InferModel<typeof userEntity, 'insert'>;

export default userEntity;
