import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>['json'];

export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      if (!id) {
        throw new Error("Transaction ID is missing");
      }
      
      const response = await client.api.transactions[":id"]["$patch"]({
        param: { id },
        json,
      })
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transaction updated");
      
      // INVALIDATE BOTH QUERIES
      queryClient.invalidateQueries({ queryKey: ['transactions'] }); // MAIN LIST
      queryClient.invalidateQueries({ queryKey: ['transaction', { id }] });
       // SINGLE TRANSACTION
       queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: () => {
      toast.error('Failed to edit transaction')
    },
  });
  return mutation;
};