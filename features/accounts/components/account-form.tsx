import {z} from 'zod'
import { insertAccountSchema } from '@/db/schema'
import {Trash, Landmark, Wallet, CreditCard, Building, Sparkles, CheckCircle2, Loader2} from 'lucide-react'
import {useForm} from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"

import { Input } from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useState } from 'react'

// UPDATE SCHEMA - ADD TYPE AND BALANCE
const formSchema = insertAccountSchema.pick({
  name: true,
  type: true,      // ADD THIS
  balance: true,   // ADD THIS
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit : (values: FormValues)=> void;
  onDelete?: ()=> void;
  disabled?: boolean;
};

// UPDATE ACCOUNT SUGGESTIONS - ADD TYPE AND BALANCE
const accountSuggestions = [
  { 
    name: "HDFC", 
    type: "savings",           // ADD THIS
    balance: "0",              // ADD THIS
    icon: <Landmark className="h-4 w-4" />, 
    color: "bg-blue-100 text-blue-700 border-blue-200" 
  },
  { 
    name: "SBI", 
    type: "current",           // ADD THIS
    balance: "0",              // ADD THIS
    icon: <Building className="h-4 w-4" />, 
    color: "bg-green-100 text-green-700 border-green-200" 
  },
  { 
    name: "Cash Wallet", 
    type: "cash",              // ADD THIS
    balance: "0",              // ADD THIS
    icon: <Wallet className="h-4 w-4" />, 
    color: "bg-orange-100 text-orange-700 border-orange-200" 
  },
  { 
    name: "ICICI", 
    type: "credit card",       // ADD THIS
    balance: "0",              // ADD THIS
    icon: <CreditCard className="h-4 w-4" />, 
    color: "bg-red-100 text-red-700 border-red-200" 
  },
];

export const AccountForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props)=>{
  const [isDeleting, setIsDeleting] = useState(false);
  
  // UPDATE DEFAULT VALUES
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: '',
      type: 'savings',    // ADD THIS
      balance: '0',       // ADD THIS
    },
  })

  const handleSubmit = (values : FormValues)=>{
    onSubmit(values);
  }

  const handleDelete = ()=>{
    setIsDeleting(true);
    onDelete?.();
  }

  // UPDATE SUGGESTION HANDLER
  const handleSuggestionClick = (suggestion: any) => {
    form.setValue('name', suggestion.name, { shouldValidate: true });
    form.setValue('type', suggestion.type, { shouldValidate: true });    // ADD THIS
    form.setValue('balance', suggestion.balance, { shouldValidate: true }); // ADD THIS
  }

  // Unique ID for the input field
  const inputId = `account-name-${id || 'new'}`;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        {/* Header Section - SAME */}
        {/* <div className="text-center space-y-3">
          <div className={`p-4 rounded-2xl inline-flex ${id ? 'bg-green-100' : 'bg-linear-to-r from-blue-100 to-purple-100'}`}>
            {id ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : (
              // <Sparkles className="h-6 w-6 text-purple-600" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {id ? 'Update Account' : 'Create New Account'}
            </h2>
            <p className="text-slate-600 mt-1">
              {id ? 'Update your account details' : 'Add a new account to track your finances'}
            </p>
          </div>
        </div> */}

        {/* Form Fields - ADD TYPE AND BALANCE FIELDS */}
        <div className="space-y-4 mt-5">
          <FormField 
            name='name'
            control={form.control}
            render={({field})=>(
              <FormItem>
                <FormLabel 
                  htmlFor={inputId}
                  className="flex items-center gap-2 text-slate-700 font-semibold text-base"
                >
                  <Landmark className="h-4 w-4 text-blue-600" />
                  Account Name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id={inputId}
                      disabled={disabled}
                      placeholder='e.g. HDFC Savings, SBI Current, Cash Wallet'
                      {...field}
                      autoComplete="account-name"
                      className="h-12 pl-11 text-base border-2 border-slate-200 focus:border-blue-500 transition-all duration-200 rounded-xl bg-white/80 backdrop-blur-sm"
                    />
                    <Landmark className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  </div>
                </FormControl>
                <FormMessage className="text-sm font-medium" />
              </FormItem>
            )}
          />

          {/* ADD TYPE FIELD */}
          <FormField 
            name='type'
            control={form.control}
            render={({field})=>(
              <FormItem>
                <FormLabel 
                 htmlFor="account-type-select" 
                className="flex items-center gap-2 text-slate-700 font-semibold text-base">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  Account Type
                </FormLabel>
                <FormControl>
                  <Select
  value={field.value || ''}
  onValueChange={field.onChange}
  disabled={disabled}
>
  <SelectTrigger className="h-12 px-4 text-base border-2 border-slate-200 focus:border-blue-500 transition-all duration-200 rounded-xl bg-white/80 backdrop-blur-sm w-full">
    <SelectValue placeholder="Select Account Type" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="savings">Savings Account</SelectItem>
    <SelectItem value="current">Current Account</SelectItem>
    <SelectItem value="cash">Cash Wallet</SelectItem>
    <SelectItem value="credit card">Credit Card</SelectItem>
  </SelectContent>
</Select>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ADD BALANCE FIELD */}
          <FormField 
            name='balance'
            control={form.control}
            render={({field})=>(
              <FormItem>
                <FormLabel 
                htmlFor="account-balance-input"
                className="flex items-center gap-2 text-slate-700 font-semibold text-base">
                  <Wallet className="h-4 w-4 text-green-600" />
                  Initial Balance
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                       id="account-balance-input"
                      type="number"
                      disabled={disabled}
                      placeholder='Enter initial balance'
                      {...field}
                      value={field.value || ''} 
                       autoComplete="off" 
                      className="h-12 pl-11 text-base border-2 border-slate-200 focus:border-blue-500 transition-all duration-200 rounded-xl bg-white/80 backdrop-blur-sm"
                    />
                    <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Quick Suggestions - SAME */}
          {!id && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Quick suggestions:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {accountSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={disabled}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-md ${suggestion.color} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {suggestion.icon}
                    <span className="text-sm font-medium">{suggestion.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - SAME */}
        <div className="space-y-3 pt-4">
          <Button 
            type="submit" 
            disabled={disabled}
            className="w-full h-10 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            {disabled ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                {id ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {id ? <CheckCircle2 className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                {id ? 'Update Account' : 'Create Account'}
              </div>
            )}
          </Button>

          {!!id && (
            <Button
              type='button'
              disabled={disabled || isDeleting}
              onClick={handleDelete}
              className="w-full h-10 bg-linear-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Deleting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash className="h-5 w-5" />
                  Delete Account
                </div>
              )}
            </Button>
          )}
        </div>

        {/* Help Text - SAME */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg mt-1">
              <Landmark className="h-4 w-4 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 text-sm">
                Best Practices
              </h4>
              <ul className="text-slate-600 text-xs space-y-1">
                <li>• Include bank name and account type</li>
                <li>• Use consistent naming across accounts</li>
                <li>• Add specific details like branch if needed</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}