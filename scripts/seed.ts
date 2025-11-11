// scripts/seed.ts
import { db } from '@/db/drizzle';
import { accounts, categories, transactions } from '@/db/schema';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';

// Sample user ID (replace with actual user ID from your auth system)
const SAMPLE_USER_ID = "user_2abc123def456";

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Check if categories already exist for this user
    const existingCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, SAMPLE_USER_ID))
      .limit(1);

    if (existingCategories.length > 0) {
      console.log('✅ Categories already exist, skipping seed...');
      return;
    }

    // 1️⃣ SEED CATEGORIES
    console.log('📂 Seeding categories...');
    
    const expenseCategories = [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Healthcare',
      'Travel',
      'Education'
    ];

    const incomeCategories = [
      'Salary',
      'Freelance',
      'Investments',
      'Gifts',
      'Business'
    ];

    for (const name of expenseCategories) {
      await db.insert(categories).values({
        id: createId(),
        userId: SAMPLE_USER_ID,
        name,
        type: 'expense',
        status: 'active',
        lastUsed: new Date().toISOString(), // ISO string
      });
    }

    for (const name of incomeCategories) {
      await db.insert(categories).values({
        id: createId(),
        userId: SAMPLE_USER_ID,
        name,
        type: 'income',
        status: 'active',
        lastUsed: new Date().toISOString(),
      });
    }

    console.log('✅ Categories seeded successfully!');

    // 2️⃣ SEED ACCOUNTS
    console.log('🏦 Seeding accounts...');

    const sampleAccounts = [
      { name: 'HDFC Bank', type: 'savings', balance: '50000' },
      { name: 'SBI Account', type: 'savings', balance: '25000' },
      { name: 'ICICI Credit Card', type: 'credit', balance: '15000' },
      { name: 'Cash Wallet', type: 'cash', balance: '5000' },
      { name: 'PayTM UPI', type: 'digital', balance: '2000' },
    ];

    const insertedAccounts = [];
    for (const account of sampleAccounts) {
      const [insertedAccount] = await db.insert(accounts)
        .values({
          id: createId(),
          userId: SAMPLE_USER_ID,
          name: account.name,
          type: account.type,
          balance: account.balance,
        })
        .returning();
      insertedAccounts.push(insertedAccount);
    }

    console.log('✅ Accounts seeded successfully!');

    // 3️⃣ SEED SAMPLE TRANSACTIONS
    console.log('💰 Seeding sample transactions...');

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const allDbCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, SAMPLE_USER_ID));

    const allDbAccounts = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, SAMPLE_USER_ID));

    const sampleTransactions = [
      {
        amount: 75000,
        payee: 'Tech Company Inc',
        notes: 'Monthly salary',
        date: today,
        type: 'income',
        categoryName: 'Salary',
        accountName: 'HDFC Bank',
      },
      {
        amount: 1500,
        payee: 'Uber',
        notes: 'Office commute',
        date: yesterday,
        type: 'expense',
        categoryName: 'Transportation',
        accountName: 'SBI Account',
      },
      {
        amount: 2500,
        payee: 'Big Bazaar',
        notes: 'Monthly groceries',
        date: today,
        type: 'expense',
        categoryName: 'Food & Dining',
        accountName: 'HDFC Bank',
      },
    ];

    for (const tx of sampleTransactions) {
      const category = allDbCategories.find(c => c.name === tx.categoryName);
      const account = allDbAccounts.find(a => a.name === tx.accountName);

      if (category && account) {
        await db.insert(transactions).values({
  id: createId(),
  userId: SAMPLE_USER_ID,
  amount: tx.amount, // number, not string
  payee: tx.payee,
  notes: tx.notes,
  date: tx.date.toISOString().split('T')[0], // string
  type: tx.type,
  categoryId: category.id,
  accountId: account.id,
});
      }
    }

    console.log('✅ Sample transactions seeded successfully!');
    console.log('🎉 Database seeding completed!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .then(() => {
    console.log('✅ Seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
