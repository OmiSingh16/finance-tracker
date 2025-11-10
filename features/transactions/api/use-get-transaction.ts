import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

// ✅ Manual type define karo
type Transaction = {
  id: string;
  amount: number;
  payee: string;
  notes: string | null;
  date: Date;
  accountId: string;
  categoryId: string | null;
  userId: string;
  type: string | null;
  createdAt: Date | null;
  accountName: string;
  categoryName: string | null;
};

export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["transaction", { id }],
    queryFn: async (): Promise<Transaction> => {
      if (!id) throw new Error("Transaction ID is required");

      const response = await client.api.transactions[":id"].$get({
        param: { id }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transaction");
      }

      const result = await response.json();
      
      // ✅ Type assertion use karo
      const data = result.data as any;
      
      console.log("🔴 Single Transaction Raw Data:", data);

      return {
        id: data.id,
        amount: data.amount,
        payee: data.payee,
        notes: data.notes,
        date: new Date(data.date),
        accountId: data.accountId,
        categoryId: data.categoryId,
        userId: data.userId,
        type: data.type,
        createdAt: data.createdAt ? new Date(data.createdAt) : null,
        accountName: data.accountName,
        categoryName: data.categoryName
      };
    },
  });
  return query;
};