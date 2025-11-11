import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetTransactions = () => {
  const query = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {}
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const result = await response.json();
      
      // ✅ Type assertion with proper checking
      const data = result.data as any[];
      

      if (!Array.isArray(data)) {
        return [];
      }

      return data.map(transaction => ({
        id: String(transaction.id),
        amount: Number(transaction.amount) || 0,
        payee: String(transaction.payee),
        notes: transaction.notes ? String(transaction.notes) : null,
        date: new Date(transaction.date),
        accountId: String(transaction.accountId),
        categoryId: transaction.categoryId ? String(transaction.categoryId) : null,
        userId: String(transaction.userId),
        type: transaction.type ? String(transaction.type) : 'expense',
        createdAt: transaction.createdAt ? new Date(transaction.createdAt) : null,
        accountName: String(transaction.accountName),
        categoryName: transaction.categoryName ? String(transaction.categoryName) : null
      }));
    },
  });
  return query;
};