import { InferModel } from 'drizzle-orm';
import {
  serial,
  mysqlTable,
  text,
  unique,
  int,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

const resetEntity = mysqlTable(
  'reset',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 50 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
  },
  (t) => ({
    token: unique().on(t.token),
  }),
);

export type resetSelect = InferModel<typeof resetEntity, 'select'>;
export type resetNew = InferModel<typeof resetEntity, 'insert'>;

export default resetEntity;
