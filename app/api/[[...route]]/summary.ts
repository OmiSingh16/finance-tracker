// app/api/summary/route.ts
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import z from 'zod';
import { 
  subDays, 
  parse, 
  differenceInDays, 
  format, 
  eachDayOfInterval, 
  endOfDay 
} from 'date-fns';
import { db } from '@/db/drizzle';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { accounts, transactions, categories } from '@/db/schema';

const app = new Hono();

// =============================================================================
// TYPES
// =============================================================================
interface FinancialData {
  income: number;
  expenses: number;
  remaining: number;
}

interface DailyTrend {
  date: string;
  income: number;
  expenses: number;
  net: number;
}

interface CategoryData {
  name: string;
  value: number;
  type: 'income' | 'expense';
}

interface AccountData {
  name: string;
  balance: number;
  type: string;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Fetch financial summary data for a period
 */
async function fetchFinancialData(
  userId: string,
  startDate: Date,
  endDate: Date,
  accountId?: string
): Promise<FinancialData> {
  try {
    const data = await db
      .select({
        income: sql`
          COALESCE(SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount} ELSE 0 END), 0)
        `.mapWith(Number),
        expenses: sql`
          COALESCE(SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount} ELSE 0 END), 0)
        `.mapWith(Number),
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          accountId ? eq(transactions.accountId, accountId) : undefined,
          gte(transactions.date, format(startDate, 'yyyy-MM-dd')),
lte(transactions.date, format(endDate, 'yyyy-MM-dd')),

        )
      );

    const result = data[0];
    
    return {
      income: result?.income || 0,
      expenses: result?.expenses || 0,
      remaining: (result?.income || 0) - (result?.expenses || 0)
    };
  } catch (error) {
    return { income: 0, expenses: 0, remaining: 0 };
  }
}

/**
 * Fetch daily trends for line chart
 */
async function fetchDailyTrends(
  userId: string, 
  startDate: Date, 
  endDate: Date, 
  accountId?: string
): Promise<DailyTrend[]> {
  try {
    const dailyData = await db
      .select({
        date: sql<string>`DATE(${transactions.date})`,
        income: sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'income' THEN ${transactions.amount} ELSE 0 END), 0)`.mapWith(Number),
        expenses: sql`COALESCE(SUM(CASE WHEN ${transactions.type} = 'expense' THEN ${transactions.amount} ELSE 0 END), 0)`.mapWith(Number),
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          accountId ? eq(transactions.accountId, accountId) : undefined,
          gte(transactions.date, format(startDate, 'yyyy-MM-dd')),
lte(transactions.date, format(endDate, 'yyyy-MM-dd')),

        )
      )
      .groupBy(transactions.date)
.orderBy(transactions.date)


    // Fill missing days with zero values
    const allDays = eachDayOfInterval({ start: startDate, end: endDate });
    const dailyTrends = allDays.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayData = dailyData.find(d => d.date === dateStr);
      
      return {
        date: dateStr,
        income: dayData?.income || 0,
        expenses: dayData?.expenses || 0,
        net: (dayData?.income || 0) - (dayData?.expenses || 0)
      };
    });

    return dailyTrends;
  } catch (error) {
    return [];
  }
}

/**
 * Fetch category breakdown for pie chart
 */
async function fetchCategoryBreakdown(
  userId: string, 
  startDate: Date, 
  endDate: Date, 
  accountId?: string
): Promise<{ expenses: CategoryData[]; income: CategoryData[] }> {
  try {
    const allCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        type: categories.type,
      })
      .from(categories)
      .where(eq(categories.userId, userId))
      .orderBy(categories.name);

    const categoryTransactions = await db
      .select({
        categoryId: transactions.categoryId,
        amount: sql`COALESCE(SUM(${transactions.amount}), 0)`.mapWith(Number),
        type: transactions.type,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          accountId ? eq(transactions.accountId, accountId) : undefined,
        gte(transactions.date, format(startDate, 'yyyy-MM-dd')),
lte(transactions.date, format(endDate, 'yyyy-MM-dd')),

        )
      )
      .groupBy(transactions.categoryId, transactions.type);

    const expenseByCategory = allCategories
      .filter(cat => cat.type === 'expense')
      .map(category => {
        const transaction = categoryTransactions.find(t => 
          t.categoryId === category.id && t.type === 'expense'
        );
        return {
          name: category.name,
          value: Math.abs(transaction?.amount || 0),
          type: 'expense' as const
        };
      });

    const incomeByCategory = allCategories
      .filter(cat => cat.type === 'income')
      .map(category => {
        const transaction = categoryTransactions.find(t => 
          t.categoryId === category.id && t.type === 'income'
        );
        return {
          name: category.name,
          value: transaction?.amount || 0,
          type: 'income' as const
        };
      });

    const uncategorizedExpense = categoryTransactions.find(t => 
      t.categoryId === null && t.type === 'expense'
    );
    
    const uncategorizedIncome = categoryTransactions.find(t => 
      t.categoryId === null && t.type === 'income'
    );

    if (uncategorizedExpense && uncategorizedExpense.amount > 0) {
      expenseByCategory.push({
        name: 'Uncategorized',
        value: Math.abs(uncategorizedExpense.amount),
        type: 'expense'
      });
    }

    if (uncategorizedIncome && uncategorizedIncome.amount > 0) {
      incomeByCategory.push({
        name: 'Uncategorized',
        value: uncategorizedIncome.amount,
        type: 'income'
      });
    }

    const finalExpenses = expenseByCategory.filter(item => item.value > 0);
    const finalIncome = incomeByCategory.filter(item => item.value > 0);

    return {
      expenses: finalExpenses,
      income: finalIncome
    };
    
  } catch (error) {
    return { expenses: [], income: [] };
  }
}

/**
 * Fetch account breakdown for spider chart
 */
async function fetchAccountBreakdown(userId: string): Promise<AccountData[]> {
  try {
    const accountData = await db
      .select({
        id: accounts.id,
        name: accounts.name,
        balance: accounts.balance,
        type: accounts.type,
      })
      .from(accounts)
      .where(eq(accounts.userId, userId));

    return accountData.map(account => ({
      name: account.name,
      balance: parseInt(account.balance || '0'),
      type: account.type as string 
    }));
  } catch (error) {
    return [];
  }
}

/**
 * Fetch transaction count for period
 */
async function fetchTransactionCount(
  userId: string, 
  startDate: Date, 
  endDate: Date, 
  accountId?: string
): Promise<number> {
  try {
    const result = await db
      .select({
        count: sql`COUNT(*)`.mapWith(Number),
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          accountId ? eq(transactions.accountId, accountId) : undefined,
         gte(transactions.date, format(startDate, 'yyyy-MM-dd')),
lte(transactions.date, format(endDate, 'yyyy-MM-dd')),

        )
      );

    return result[0]?.count || 0;
  } catch (error) {
    return 0;
  }
}

// =============================================================================
// MAIN API ROUTE - ✅ FIXED: REMOVED IST ADJUSTMENT
// =============================================================================
app.get(
  '/',
  clerkMiddleware(),
  zValidator(
    'query',
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    }),
  ),
  async (c) => {
    const auth = getAuth(c);
    const { from, to, accountId } = c.req.valid('query');
    
    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    try {
      // =========================================================================
      // DATE RANGE SETUP - ✅ FIXED: NO IST ADJUSTMENT
      // =========================================================================
      const currentDate = new Date();
      const defaultTo = currentDate;
      const defaultFrom = subDays(defaultTo, 30);

      // Parse dates - ✅ Use as is
      const startDate = from 
        ? parse(from, 'yyyy-MM-dd', new Date())
        : defaultFrom;
      
      let endDate = to 
        ? parse(to, 'yyyy-MM-dd', new Date())
        : defaultTo;

      // ✅ Set end date to end of day
      endDate.setHours(23, 59, 59, 999);

      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return c.json({ error: 'Invalid date format' }, 400);
      }

      // Calculate comparison period
      const periodLength = differenceInDays(endDate, startDate) + 1;
      const lastPeriodStart = subDays(startDate, periodLength);
      const lastPeriodEnd = subDays(endDate, periodLength);

      // =========================================================================
      // PARALLEL DATA FETCHING
      // =========================================================================
      const [
        currentPeriod, 
        lastPeriod, 
        dailyTrends, 
        categoryBreakdown, 
        accountBreakdown,
        transactionCount
      ] = await Promise.all([
        fetchFinancialData(auth.userId, startDate, endDate, accountId),
        fetchFinancialData(auth.userId, lastPeriodStart, lastPeriodEnd, accountId),
        fetchDailyTrends(auth.userId, startDate, endDate, accountId),
        fetchCategoryBreakdown(auth.userId, startDate, endDate, accountId),
        fetchAccountBreakdown(auth.userId),
        fetchTransactionCount(auth.userId, startDate, endDate, accountId)
      ]);

      // =========================================================================
      // RESPONSE STRUCTURE
      // =========================================================================
      const response = {
        periodComparison: {
          currentPeriod,
          lastPeriod
        },
        
        charts: {
          dailyTrends,
          categoryBreakdown,
          accountBreakdown,
          monthlyComparison: {
            current: currentPeriod,
            last: lastPeriod
          }
        },
        
        summary: {
          totalIncome: currentPeriod.income,
          totalExpenses: currentPeriod.expenses,
          netCashFlow: currentPeriod.remaining,
          transactionCount
        },

        meta: {
          dateRange: {
            start: format(startDate, 'yyyy-MM-dd'),
            end: format(endDate, 'yyyy-MM-dd'),
            periodLength
          },
          accountFilter: accountId || 'all'
        }
      };

      return c.json(response);

    } catch (error) {
      return c.json({ 
        error: 'Failed to fetch summary data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 500);
    }
  }
);

export default app;