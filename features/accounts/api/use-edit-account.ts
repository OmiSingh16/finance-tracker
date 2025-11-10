import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>['json'];

export const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async (json) => {
      if (!id) {
        throw new Error("Account ID is missing");
      }
      
      const response = await client.api.accounts[":id"]["$patch"]({
        param: { id },
        json,
      })
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account updated");
      
      // INVALIDATE BOTH QUERIES
      queryClient.invalidateQueries({ queryKey: ['accounts'] }); // MAIN LIST
      queryClient.invalidateQueries({ queryKey: ['account', { id }] }); // SINGLE ACCOUNT
    },
    onError: () => {
      toast.error('Failed to edit account')
    },
  });
  return mutation;
};