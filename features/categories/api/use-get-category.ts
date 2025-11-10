import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

export const useGetCategory = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["categories", { id }], // ✅ Fix 1
    queryFn: async () => {
      const response = await client.api.categories[':id'].$get({
        param: { id } // ✅ Fix 2
      });

      if (!response.ok) {
        throw new Error("Fail to fetch category");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};