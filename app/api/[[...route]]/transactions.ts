import { Hono } from "hono";
import { db } from '@/db/drizzle';
import { z } from "zod";
import { zValidator } from '@hono/zod-validator';
import { subDays, parse } from 'date-fns';
import { createId } from '@paralleldrive/cuid2';
import { transactions, insertTransactionSchema, accounts, categories } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray, gte, lte, desc, sql } from 'drizzle-orm';
import { format } from "date-fns"; // add at the top

const app = new Hono()

// GET ALL TRANSACTIONS WITH FILTERS - ✅ FIXED: REMOVED IST ADJUSTMENT
.get('/',
  zValidator('query',
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
      categoryId: z.string().optional(),
    })
  ), 
  clerkMiddleware(), 
  async (c) => {
    const auth = getAuth(c);
    const { from, to, accountId, categoryId } = c.req.valid('query');

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);
    
    // ✅ FIXED: REMOVE IST ADJUSTMENT - Use dates as is
    const startDate = from 
      ? parse(from, 'yyyy-MM-dd', new Date())
      : defaultFrom;
    const endDate = to 
      ? parse(to, 'yyyy-MM-dd', new Date())
      : defaultTo;

    // ✅ Set end date to end of day for inclusive range
    endDate.setHours(23, 59, 59, 999);

    const data = await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        payee: transactions.payee,
        notes: transactions.notes,
        date: transactions.date,
        accountId: transactions.accountId,
        categoryId: transactions.categoryId,
        userId: transactions.userId,
        type: transactions.type,
        createdAt: transactions.createdAt,
        accountName: accounts.name,
        categoryName: categories.name
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(
        eq(transactions.userId, auth.userId),
        gte(transactions.date, format(startDate, 'yyyy-MM-dd')),
lte(transactions.date, format(endDate, 'yyyy-MM-dd')),
        accountId ? eq(transactions.accountId, accountId) : undefined,
        categoryId ? eq(transactions.categoryId, categoryId) : undefined
      ))
      .orderBy(desc(transactions.date));

    return c.json({ data });
  }
)

// GET SINGLE TRANSACTION
.get('/:id',
  zValidator("param", z.object({
    id: z.string().optional(),
  })),
  clerkMiddleware(),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    if (!id) {
      return c.json({ error: "Missing Id" }, 400);
    }
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const [data] = await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        payee: transactions.payee,
        notes: transactions.notes,
        date: transactions.date,
        accountId: transactions.accountId,
        categoryId: transactions.categoryId,
        userId: transactions.userId,
        type: transactions.type,
        createdAt: transactions.createdAt,
        accountName: accounts.name,
        categoryName: categories.name
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          eq(transactions.userId, auth.userId),
          eq(transactions.id, id)
        ),
      );

    if (!data) {
      return c.json({ error: "Not found" }, 404);
    }
    return c.json({ data });
  }
)

// CREATE TRANSACTION
.post('/', 
  clerkMiddleware(), 
  zValidator('json', insertTransactionSchema.pick({
    amount: true,
    payee: true,
    notes: true,
    date: true,
    accountId: true,
    categoryId: true,
    type: true,
  })), 
  async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid('json');

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // ✅ VALIDATE CATEGORY ID
    if (!values.categoryId) {
      return c.json({ error: 'Category is required' }, 400);
    }

    const [data] = await db.transaction(async (tx) => {
      // 1. Transaction create karo WITH CATEGORY ID
      const [transaction] = await tx.insert(transactions).values({
        id: createId(),
        userId: auth.userId,
        ...values,
        categoryId: values.categoryId,
      }).returning();

      // 2. Account balance update karo
      if (values.type === 'income') {
        await tx.update(accounts)
          .set({
            balance: sql`CAST(${accounts.balance} AS INTEGER) + ${values.amount}`
          })
          .where(eq(accounts.id, values.accountId));
      } else {
        await tx.update(accounts)
          .set({
            balance: sql`CAST(${accounts.balance} AS INTEGER) - ${values.amount}`
          })
          .where(eq(accounts.id, values.accountId));
      }

      return [transaction];
    });

    return c.json({ data });
  }
)

// BULK DELETE TRANSACTIONS
.post('/bulk-delete',
  clerkMiddleware(),
  zValidator('json', z.object({
    ids: z.array(z.string()),
  })),
  async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid('json');

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const data = await db.transaction(async (tx) => {
      const transactionsToDelete = await tx
        .select({
          id: transactions.id,
          amount: transactions.amount,
          type: transactions.type,
          accountId: transactions.accountId
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, auth.userId),
            inArray(transactions.id, values.ids)
          )
        );

      const accountUpdates: { [accountId: string]: number } = {};
      
      transactionsToDelete.forEach(transaction => {
        const amount = transaction.amount;
        const adjustment = transaction.type === 'income' ? -amount : amount;
        
        if (!accountUpdates[transaction.accountId]) {
          accountUpdates[transaction.accountId] = 0;
        }
        accountUpdates[transaction.accountId] += adjustment;
      });

      for (const [accountId, adjustment] of Object.entries(accountUpdates)) {
        const [account] = await tx
          .select({ balance: accounts.balance })
          .from(accounts)
          .where(eq(accounts.id, accountId));
        
        const currentBalance = parseInt(account.balance || '0');
        const newBalance = (currentBalance + adjustment).toString();
        
        await tx.update(accounts)
          .set({
            balance: newBalance
          })
          .where(eq(accounts.id, accountId));
      }

      const deletedTransactions = await tx
        .delete(transactions)
        .where(
          and(
            eq(transactions.userId, auth.userId),
            inArray(transactions.id, values.ids)
          )
        )
        .returning({
          id: transactions.id,
        });

      return deletedTransactions;
    });

    return c.json({ data });
  }
)

// UPDATE TRANSACTION
.patch("/:id",
  clerkMiddleware(),
  zValidator('param', z.object({
    id: z.string().optional(),
  })),
  zValidator('json', insertTransactionSchema.pick({
    amount: true,
    payee: true,
    notes: true,
    date: true,
    accountId: true,
    categoryId: true,
    type: true,
  })),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");
    const values = c.req.valid("json");

    if (!id) {
      return c.json({ error: 'Missing id' }, 400);
    }
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db.transaction(async (tx) => {
      const [oldTransaction] = await tx
        .select({
          amount: transactions.amount,
          type: transactions.type,
          accountId: transactions.accountId
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, auth.userId),
            eq(transactions.id, id),
          )
        );

      if (!oldTransaction) {
        throw new Error("Transaction not found");
      }

      const oldAmount = oldTransaction.amount;
      
      if (oldTransaction.type === 'income') {
        await tx.update(accounts)
          .set({
            balance: sql`CAST(${accounts.balance} AS INTEGER) - ${oldAmount}`
          })
          .where(eq(accounts.id, oldTransaction.accountId));
      } else {
        await tx.update(accounts)
          .set({
            balance: sql`CAST(${accounts.balance} AS INTEGER) + ${oldAmount}`
          })
          .where(eq(accounts.id, oldTransaction.accountId));
      }

      const newAmount = values.amount;
      
      if (values.type === 'income') {
        await tx.update(accounts)
          .set({
            balance: sql`CAST(${accounts.balance} AS INTEGER) + ${newAmount}`
          })
          .where(eq(accounts.id, values.accountId));
      } else {
        await tx.update(accounts)
          .set({
            balance: sql`CAST(${accounts.balance} AS INTEGER) - ${newAmount}`
          })
          .where(eq(accounts.id, values.accountId));
      }

      const [updatedTransaction] = await tx
        .update(transactions)
        .set(values)
        .where(
          and(
            eq(transactions.userId, auth.userId),
            eq(transactions.id, id),
          )
        )
        .returning({
          id: transactions.id,
          amount: transactions.amount,
          payee: transactions.payee,
          notes: transactions.notes,
          date: transactions.date,
          accountId: transactions.accountId,
          categoryId: transactions.categoryId,
          userId: transactions.userId,
          type: transactions.type,
          createdAt: transactions.createdAt,
        });

      return updatedTransaction;
    });

    if (!data) {
      return c.json({ error: "Not found" }, 404);
    }
    return c.json({ data });
  }
)

// DELETE TRANSACTION
.delete("/:id",
  clerkMiddleware(),
  zValidator('param', z.object({
    id: z.string().optional(),
  })),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    if (!id) {
      return c.json({ error: 'Missing id' }, 400);
    }
    if (!auth?.userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db.transaction(async (tx) => {
      const [transactionToDelete] = await tx
        .select({
          amount: transactions.amount,
          type: transactions.type,
          accountId: transactions.accountId
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, auth.userId),
            eq(transactions.id, id),
          )
        );

      if (!transactionToDelete) {
        throw new Error("Transaction not found");
      }

      const amount = transactionToDelete.amount;
      
      if (transactionToDelete.type === 'income') {
        await tx.update(accounts)
          .set({
            balance: sql`CAST(${accounts.balance} AS INTEGER) - ${amount}`
          })
          .where(eq(accounts.id, transactionToDelete.accountId));
      } else {
        await tx.update(accounts)
          .set({
            balance: sql`CAST(${accounts.balance} AS INTEGER) + ${amount}`
          })
          .where(eq(accounts.id, transactionToDelete.accountId));
      }

      const [deletedTransaction] = await tx
        .delete(transactions)
        .where(
          and(
            eq(transactions.userId, auth.userId),
            eq(transactions.id, id),
          )
        )
        .returning({
          id: transactions.id
        });

      return deletedTransaction;
    });

    if (!data) {
      return c.json({ error: "Not found" }, 404);
    }
    return c.json({ data });
  }
);

export default app;