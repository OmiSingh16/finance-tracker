import {z} from 'zod'
import {Trash, Receipt, Tag, Sparkles, CheckCircle2, Loader2, Calendar, User, Wallet} from 'lucide-react'
import {useForm} from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { insertTransactionSchema } from '@/db/schema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts'
import { useGetCategories } from '@/features/categories/api/use-get-categories'

// TRANSACTION SCHEMA - ALL REQUIRED FIELDS
const formSchema = insertTransactionSchema.pick({
  amount: true,
  payee: true,
  notes: true,
  date: true,
  accountId: true,
  categoryId: true,
  type: true,
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

// TRANSACTION SUGGESTIONS
const transactionSuggestions = [
  { 
    amount: 1000,
    payee: "Grocery Store", 
    type: "expense" as const,
    icon: <Tag className="h-4 w-4" />, 
    color: "bg-blue-100 text-blue-700 border-blue-200" 
  },
  { 
    amount: 500,
    payee: "Fuel Station", 
    type: "expense" as const,
    icon: <Tag className="h-4 w-4" />, 
    color: "bg-green-100 text-green-700 border-green-200" 
  },
  { 
    amount: 2000,
    payee: "Restaurant", 
    type: "expense" as const,
    icon: <Tag className="h-4 w-4" />, 
    color: "bg-orange-100 text-orange-700 border-orange-200" 
  },
  { 
    amount: 50000,
    payee: "Salary", 
    type: "income" as const,
    icon: <Wallet className="h-4 w-4" />, 
    color: "bg-red-100 text-red-700 border-red-200" 
  },
];

export const TransactionForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const accountsQuery = useGetAccounts();
  const categoriesQuery = useGetCategories();
  
  const accounts = accountsQuery.data || [];
  const categories = categoriesQuery.data || [];
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      amount: 0,
      payee: '',
      notes: '',
      date: new Date().toISOString().split('T')[0],
      accountId: '',
      categoryId: '',
      type: "expense",
    },
  })

  const handleSubmit = (values: FormValues) => {
    let dateValue: string;
    
    if (values.date instanceof Date) {
      dateValue = values.date.toISOString();
    } else if (typeof values.date === 'string') {
      dateValue = new Date(values.date).toISOString();
    } else {
      dateValue = new Date().toISOString();
    }

    const formattedValues = {
      ...values,
      date: dateValue,
      amount: Number(values.amount) || 0,
      accountId: values.accountId || '',
      categoryId: values.categoryId || '',
      type: values.type || 'expense'
    };

    onSubmit(formattedValues);
  }

  const handleDelete = () => {
    setIsDeleting(true);
    onDelete?.();
  }

  const handleSuggestionClick = (suggestion: any) => {
    form.setValue('amount', suggestion.amount, { shouldValidate: true });
    form.setValue('payee', suggestion.payee, { shouldValidate: true });
    form.setValue('type', suggestion.type, { shouldValidate: true });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'> {/* ✅ Reduced from space-y-6 */}
        <div className="space-y-3"> {/* ✅ Reduced from space-y-4 */}
          
          {/* AMOUNT FIELD */}
          <FormField 
            name='amount'
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold text-sm"> {/* ✅ Reduced text-base to text-sm */}
                  <Wallet className="h-4 w-4 text-blue-600" />
                  Amount
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      disabled={disabled}
                      placeholder="0.00"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      className="h-10 pl-10 text-sm border-2 border-slate-200 focus:border-blue-500 transition-all duration-200 rounded-xl bg-white/80 backdrop-blur-sm" 
                    />
                    <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" /> 
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-medium" /> {/* ✅ Reduced text-sm to text-xs */}
              </FormItem>
            )}
          />

          {/* PAYEE FIELD */}
          <FormField 
            name='payee'
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold text-sm"> {/* ✅ Reduced text-base to text-sm */}
                  <User className="h-4 w-4 text-green-600" />
                  Payee
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      disabled={disabled}
                      placeholder="e.g. Grocery Store, Salary, etc."
                      {...field}
                      className="h-10 pl-10 text-sm border-2 border-slate-200 focus:border-blue-500 transition-all duration-200 rounded-xl bg-white/80 backdrop-blur-sm" 
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" /> {/* ✅ Reduced h-5 to h-4 */}
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-medium" /> {/* ✅ Reduced text-sm to text-xs */}
              </FormItem>
            )}
          />

          {/* DATE FIELD */}
          <FormField 
            name='date'
            control={form.control}
            render={({field}) => {
              let inputValue = '';
              
              if (field.value instanceof Date) {
                inputValue = field.value.toISOString().split('T')[0];
              } else if (typeof field.value === 'string') {
                inputValue = field.value.split('T')[0];
              } else {
                inputValue = new Date().toISOString().split('T')[0];
              }

              const today = new Date().toISOString().split('T')[0];

              return (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold text-sm"> {/* ✅ Reduced text-base to text-sm */}
                    <Calendar className="h-4 w-4 text-purple-600" />
                    Date (Past & Current Only)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="date"
                        disabled={disabled}
                        value={inputValue}
                        max={today}
                        onChange={e => {
                          const selectedDate = new Date(e.target.value);
                          const today = new Date();
                          today.setHours(23, 59, 59, 999);
                          
                          if (selectedDate <= today) {
                            field.onChange(e.target.value);
                          }
                        }}
                        className="h-10 pl-10 text-sm border-2 border-slate-200 focus:border-blue-500 transition-all duration-200 rounded-xl bg-white/80 backdrop-blur-sm" 
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" /> {/* ✅ Reduced h-5 to h-4 */}
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-amber-600">
                    • Only past and current dates are allowed
                  </FormDescription>
                  <FormMessage className="text-xs font-medium" /> {/* ✅ Reduced text-sm to text-xs */}
                </FormItem>
              );
            }}
          />

          {/* NOTES FIELD */}
          <FormField 
            name='notes'
            control={form.control}
            render={({field}) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold text-sm"> {/* ✅ Reduced text-base to text-sm */}
                  <Receipt className="h-4 w-4 text-orange-600" />
                  Notes
                </FormLabel>
                <FormControl>
                  <Textarea
                    disabled={disabled}
                    placeholder="Additional notes about this transaction"
                    {...field}
                    value={field.value || ''}
                    className="min-h-20 text-sm border-2 border-slate-200 focus:border-blue-500 transition-all duration-200 rounded-xl bg-white/80 backdrop-blur-sm" 
                  />
                </FormControl>
                <FormMessage className="text-xs font-medium" /> {/* ✅ Reduced text-sm to text-xs */}
              </FormItem>
            )}
          />

          {/* TYPE, ACCOUNT & CATEGORY IN ONE ROW */}
          <div className="grid grid-cols-3 gap-3"> {/* ✅ Reduced gap-4 to gap-3 */}
            {/* TYPE FIELD */}
            <FormField 
              name='type'
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold text-xs"> {/* ✅ Reduced text-sm to text-xs */}
                    <Tag className="h-3 w-3 text-green-600" />
                    Type
                  </FormLabel>
                  <Select
                    disabled={disabled}
                    onValueChange={field.onChange}
                    value={field.value || "expense"}
                    defaultValue={field.value || "expense"}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs border-2 border-slate-200 focus:border-blue-500 transition-all duration-200 rounded-xl bg-white/80 backdrop-blur-sm"> {/* ✅ Reduced h-10 to h-9 */}
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />

            {/* ACCOUNT FIELD */}
            <FormField 
              name='accountId'
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold text-xs"> {/* ✅ Reduced text-sm to text-xs */}
                    <Wallet className="h-3 w-3 text-blue-600" />
                    Account
                  </FormLabel>
                  <Select
                    disabled={disabled || accountsQuery.isLoading}
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    defaultValue={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 text-xs border-2 border-slate-200 focus:border-blue-500 transition-all duration-200 rounded-xl bg-white/80 backdrop-blur-sm"> {/* ✅ Reduced h-10 to h-9 */}
                        <SelectValue placeholder={accountsQuery.isLoading ? "..." : "Account"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />

            {/* CATEGORY FIELD */}
            <FormField 
              name='categoryId'
              control={form.control}
              render={({field}) => {
                const selectedType = form.watch('type');
                const filteredCategories = categories.filter(
                  category => category.type === selectedType
                );

                return (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-slate-700 font-semibold text-xs"> {/* ✅ Reduced text-sm to text-xs */}
                      <Tag className="h-3 w-3 text-green-600" />
                      Category
                    </FormLabel>
                    <Select
                      disabled={disabled || categoriesQuery.isLoading || filteredCategories.length === 0}
                      onValueChange={field.onChange}
                      value={field.value || ""}
                      defaultValue={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9 text-xs border-2 border-slate-200 focus:border-blue-500 transition-all duration-200 rounded-xl bg-white/80 backdrop-blur-sm"> {/* ✅ Reduced h-10 to h-9 */}
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs font-medium" />
                  </FormItem>
                )
              }}
            />
          </div>

          {/* Quick Suggestions */}
          {!id && (
            <div className="space-y-2"> {/* ✅ Reduced space-y-3 to space-y-2 */}
              <div className="flex items-center gap-2 text-xs text-slate-600"> {/* ✅ Reduced text-sm to text-xs */}
                <Sparkles className="h-3 w-3 text-amber-500" /> {/* ✅ Reduced h-4 to h-3 */}
                Quick suggestions:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {transactionSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={disabled}
                    className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-md ${suggestion.color} disabled:opacity-50 disabled:cursor-not-allowed`} 
                  >
                    {suggestion.icon}
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-medium">{suggestion.payee}</span> {/* ✅ Reduced text-sm to text-xs */}
                      <span className="text-xs opacity-75">₹{suggestion.amount}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2"> {/* ✅ Reduced space-y-3 to space-y-2, pt-4 to pt-2 */}
          <Button 
            type="submit" 
            disabled={disabled}
            className="w-full h-11 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none" 
            
          >
            {disabled ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> {/* ✅ Reduced h-5 to h-4 */}
                {id ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {id ? <CheckCircle2 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />} 
                {id ? 'Update Transaction' : 'Create Transaction'}
              </div>
            )}
          </Button>

          {!!id && (
            <Button
              type='button'
              disabled={disabled || isDeleting}
              onClick={handleDelete}
              className='w-full h-11 bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none' 
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> {/* ✅ Reduced h-5 to h-4 */}
                  Deleting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash className="h-4 w-4" /> {/* ✅ Reduced h-5 to h-4 */}
                  Delete Transaction
                </div>
              )}
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3"> {/* ✅ Reduced p-4 to p-3 */}
          <div className="flex items-start gap-2"> {/* ✅ Reduced gap-3 to gap-2 */}
            <div className="p-1 bg-blue-100 rounded-lg mt-1"> {/* ✅ Reduced p-2 to p-1 */}
              <Receipt className="h-3 w-3 text-blue-600" /> {/* ✅ Reduced h-4 to h-3 */}
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 text-xs"> {/* ✅ Reduced text-sm to text-xs */}
                Best Practices
              </h4>
              <ul className="text-slate-600 text-xs space-y-0.5"> {/* ✅ Reduced space-y-1 to space-y-0.5 */}
                <li>• Enter accurate amounts and dates</li>
                <li>• Use specific payee names for better tracking</li>
                <li>• Add notes for transaction context</li>
                <li>• Categorize transactions properly</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}