import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>;

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error
  >({
    mutationFn: async () => { // ✅ json parameter remove karo
      if (!id) {
        throw new Error("Account ID is required");
      }
      
      const response = await client.api.accounts[":id"]["$delete"]({
        param: { id }, // ✅ Ab id definitely string hai
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account deleted");
      queryClient.invalidateQueries({ queryKey: ['accounts', { id }] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      // TODO: Invalidate summary and transactions
    },
    onError: () => {
      toast.error('Failed to delete account');
    },
  });
  
  return mutation;
};