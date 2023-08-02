import { InferModel } from 'drizzle-orm';
import {
  serial,
  mysqlTable,
  text,
  unique,
  int,
  timestamp,
} from 'drizzle-orm/mysql-core';

const tokenEntity = mysqlTable('token', {
  id: serial('id').primaryKey(),
  user_id: int('user_id').notNull(),
  token: text('token').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  expiredAt: timestamp('expirted_at'),
});

export type tokenSelect = InferModel<typeof tokenEntity, 'select'>;
export type tokenNew = InferModel<typeof tokenEntity, 'insert'>;

export default tokenEntity;
