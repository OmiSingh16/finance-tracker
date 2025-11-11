import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

// ✅ STEP 1: Type define karo
interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  // Agar aur fields hain to add karo
  status?: string | null;
  lastUsed?: string | null;
  userId?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  plaidId?: string | null;
}

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => { // ✅ Return type specify karo
      const response = await client.api.categories.$get();

      if (!response.ok) {
        throw new Error("Fail to fetch categories");
      }
      
      const { data } = await response.json();
      
      // ✅ STEP 2: IMPORTANT - Data transformation yahan karo
      return data.map((category: any) => ({
        ...category,
        // ✅ Type ko force karo 'income' ya 'expense' mein
        type: (category.type === 'income' ? 'income' : 'expense') as 'income' | 'expense'
      }));
    },
  });
  return query;
};