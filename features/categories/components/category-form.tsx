 import {z} from 'zod'
import {Trash, Folder, Tag, Sparkles, CheckCircle2, Loader2} from 'lucide-react'
import {useForm} from 'react-hook-form'
import {zodResolver} from "@hookform/resolvers/zod"

import { Input } from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import { insertCategorySchema } from '@/db/schema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from 'react'

// CATEGORY SCHEMA - NAME AND TYPE BOTH REQUIRED
const formSchema = insertCategorySchema.pick({
  name: true,
  type: true, // ✅ TYPE ADD KARNA JARURI HAI
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit : (values: FormValues)=> void;
  onDelete?: ()=> void;
  disabled?: boolean;
};

// CATEGORY SUGGESTIONS - TYPE KE SAATH
const categorySuggestions = [
  { 
    name: "Food & Dining", 
    type: "expense" as const,
    icon: <Tag className="h-4 w-4" />, 
    color: "bg-blue-100 text-blue-700 border-blue-200" 
  },
  { 
    name: "Transportation", 
    type: "expense" as const,
    icon: <Folder className="h-4 w-4" />, 
    color: "bg-green-100 text-green-700 border-green-200" 
  },
  { 
    name: "Entertainment", 
    type: "expense" as const,
    icon: <Tag className="h-4 w-4" />, 
    color: "bg-orange-100 text-orange-700 border-orange-200" 
  },
  { 
    name: "Salary Income", 
    type: "income" as const,
    icon: <Folder className="h-4 w-4" />, 
    color: "bg-red-100 text-red-700 border-red-200" 
  },
];

export const CategoryForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}: Props)=>{
  const [isDeleting, setIsDeleting] = useState(false);
  
  // DEFAULT VALUES - TYPE KE SAATH
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: '',
      type: "expense", // ✅ DEFAULT TYPE
    },
  })

  const handleSubmit = (values : FormValues)=>{
    onSubmit(values);
  }

  const handleDelete = ()=>{
    setIsDeleting(true);
    onDelete?.();
  }

  // SUGGESTION HANDLER - TYPE KE SAATH
  const handleSuggestionClick = (suggestion: any) => {
    form.setValue('name', suggestion.name, { shouldValidate: true });
    form.setValue('type', suggestion.type, { shouldValidate: true }); // ✅ TYPE BHI SET KARO
  }

  // Unique ID for the input fields
  const nameInputId = `category-name-${id || 'new'}`;
  const typeSelectId = `category-type-${id || 'new'}`;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        {/* Form Fields - NAME AND TYPE BOTH */}
        <div className="space-y-4 mt-5">
          <FormField 
            name='name'
            control={form.control}
            render={({field})=>(
              <FormItem>
                <FormLabel 
                  htmlFor={nameInputId}
                  className="flex items-center gap-2 text-slate-700 font-semibold text-base"
                >
                  <Folder className="h-4 w-4 text-blue-600" />
                  Category Name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id={nameInputId}
                      disabled={disabled}
                      placeholder='e.g. Food & Dining, Transportation, Salary'  
                      {...field}
                      autoComplete="off"
                      className="h-12 pl-11 text-base border-2 border-slate-200 focus:border-blue-500 transition-all duration-200 rounded-xl bg-white/80 backdrop-blur-sm"
                    />
                    <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  </div>
                </FormControl>
                <FormMessage className="text-sm font-medium" />
              </FormItem>
            )}
          />

          {/* TYPE FIELD - SHADCN SELECT COMPONENT */}
          <FormField 
            name='type'
            control={form.control}
            render={({field})=>(
              <FormItem>
                <FormLabel 
                  htmlFor={typeSelectId}
                  className="flex items-center gap-2 text-slate-700 font-semibold text-base"
                >
                  <Tag className="h-4 w-4 text-green-600" />
                  Category Type
                </FormLabel>
                <Select
                  disabled={disabled}
                  onValueChange={field.onChange}
                  value={field.value || "expense"}
                  defaultValue={field.value || "expense"} 
                >
                  <FormControl>
                    <SelectTrigger 
                      id={typeSelectId}
                      className="h-12 text-base border-2 border-slate-200 focus:border-blue-500 transition-all duration-200 rounded-xl bg-white/80 backdrop-blur-sm"
                    >
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-sm font-medium" />
              </FormItem>
            )}
          />

          {/* Quick Suggestions - UPDATED WITH TYPE */}
          {!id && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Quick suggestions:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categorySuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={disabled}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:shadow-md ${suggestion.color} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {suggestion.icon}
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{suggestion.name}</span>
                      <span className="text-xs opacity-75 capitalize">{suggestion.type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
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
                {id ? 'Update Category' : 'Create Category'}
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
                  Delete Category
                </div>
              )}
            </Button>
          )}
        </div>

        {/* Help Text - UPDATED FOR CATEGORIES */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg mt-1">
              <Folder className="h-4 w-4 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800 text-sm">
                Best Practices
              </h4>
              <ul className="text-slate-600 text-xs space-y-1">
                <li>• Use clear and specific category names</li>
                <li>• Choose correct type (Income/Expense) for proper tracking</li>
                <li>• Group similar transactions together</li>
                <li>• Use consistent naming across categories</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
