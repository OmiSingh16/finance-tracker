import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

// ✅ Same type use karo
interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  status?: string | null;
  lastUsed?: string | null;
  userId?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  plaidId?: string | null;
}

export const useGetCategory = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["categories", { id }],
    queryFn: async (): Promise<Category> => { // ✅ Return type specify karo
      const response = await client.api.categories[':id'].$get({
        param: { id }
      });

      if (!response.ok) {
        throw new Error("Fail to fetch category");
      }
      
      const { data } = await response.json();
      
      // ✅ STEP 2: IMPORTANT - Data transformation yahan karo
      return {
        ...data,
        // ✅ Type ko force karo 'income' ya 'expense' mein
        type: (data.type === 'income' ? 'income' : 'expense') as 'income' | 'expense'
      };
    },
  });
  return query;
};