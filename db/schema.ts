import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from 'drizzle-zod'
import { InferSelectModel, relations } from 'drizzle-orm';
import { z } from 'zod';

// Accounts table - Bank accounts and wallet information
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  plaidId: text('plaid_id'),
  name: text('name').notNull(),
  type: varchar('type', { length: 50 }).default('savings'), 
  balance: varchar('balance', { length: 100 }).default('0'), 
  userId: text('user_id').notNull(),
});

export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

export const insertAccountSchema = createInsertSchema(accounts);

// Categories table - Transaction categorization
export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  plaidId: text('plaid_id'),
  name: text('name').notNull(),
  type: varchar('type', { length: 50 }).default('expense'), 
  status: varchar('status', { length: 50 }).default('active'), 
  lastUsed: timestamp('last_used'), 
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(), 
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const insertCategorySchema = createInsertSchema(categories);

// Transactions table - Financial transactions record
export const transactions = pgTable("transactions", {
  id: text('id').primaryKey(),
  amount: integer('amount').notNull(),
  payee: text('payee').notNull(),
  notes: text('notes'),
  date: timestamp('date', { mode: 'date' }).notNull(),
  accountId: text('account_id').references(() => accounts.id, {
    onDelete: 'cascade',
  }).notNull(),
  categoryId: text("category_id").references(() => categories.id, {
    onDelete: 'set default'
  }),
  userId: text('user_id').notNull(),
  type: varchar('type', { length: 20 }).default('expense'), 
  createdAt: timestamp('created_at').defaultNow(),
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});
