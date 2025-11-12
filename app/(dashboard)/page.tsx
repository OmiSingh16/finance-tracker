'use client';
import { useGetSummary } from '@/features/summary/api/use-get-summary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Wallet, PieChart as PieChartIcon, BarChart3, Activity, Calendar, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';

// Recharts components
import { AccountSpiderChart } from '@/components/charts/spider-chart';
import { CategoryPieChart } from '@/components/charts/pie-chart';
import { DailyTrendChart } from '@/components/charts/line-chart';
import { ComparisonBarChart } from '@/components/charts/bar-chart';

const DATE_RANGES = [
  { value: '7', label: 'Last 7 Days' },
  { value: '30', label: 'Last 30 Days' },
  { value: '90', label: 'Last 3 Months' },
  { value: '365', label: 'Last 1 Year' }
];

const CATEGORY_TYPES = [
  { value: 'expense', label: 'Expense Categories' },
  { value: 'income', label: 'Income Categories' }
];

const OverviewPage = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('7');
  const [selectedCategoryType, setSelectedCategoryType] = useState('expense');

  // ✅ DYNAMIC DATE CALCULATION - Browser time
const dateRange = useMemo(() => {
  const today = new Date(); // local time
  const fromDate = new Date(today);
  fromDate.setDate(today.getDate() - parseInt(selectedDateRange));

  // Format as local YYYY-MM-DD
  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    from: formatLocalDate(fromDate),
    to: formatLocalDate(today)
  };
}, [selectedDateRange]);

  const summaryQuery = useGetSummary({
    from: dateRange.from,
    to: dateRange.to
  });

  const { data } = summaryQuery;

  if (summaryQuery.isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-6 -mt-8 rounded-t-sm">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!data) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-6 -mt-8 rounded-t-sm">
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          {/* Animated Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <svg 
                className="w-10 h-10 text-white animate-pulse" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <h1 className="text-3xl font-bold text-slate-800 mb-3">
            No Financial Data Yet
          </h1>
          
          <p className="text-slate-600 mb-6 leading-relaxed">
            Start tracking your finances to see beautiful charts and insights. 
            Your dashboard will come alive with your transaction data!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
              <div className="flex items-center gap-2 justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add First Transaction
              </div>
            </button>
            
            <button className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-medium hover:border-slate-400 transition-all duration-200">
              <div className="flex items-center gap-2 justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Learn More
              </div>
            </button>
          </div>

          {/* Features Preview */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-4">You'll be able to track:</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Income & Expenses
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Spending Trends
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Category Analysis
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                Net Worth
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  const { periodComparison, charts, summary } = data;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-6 -mt-8 rounded-t-sm">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Financial Overview</h1>
            <p className="text-slate-600">Complete analysis of your financial health</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Date Range Filter */}
            <div className="flex items-center gap-2">
  <Calendar className="h-4 w-4 text-slate-500" />
  <Select
    value={selectedDateRange}
    onValueChange={(value) => setSelectedDateRange(value)}
  >
    <SelectTrigger className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium flex items-center gap-2 w-full">
      <SelectValue placeholder="Select Date Range" />
    </SelectTrigger>
    <SelectContent>
      {DATE_RANGES.map((range) => (
        <SelectItem key={range.value} value={range.value}>
          {range.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
          </div>
        </div>
      </div>


      {/* Summary Stats Cards */}
<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
  {/* Total Income Card */}
  <Card className="bg-white border-l-4 border-l-blue-500 shadow-lg">
    <CardContent className="p-4 md:p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs md:text-sm text-slate-600">Total Income</p>
          <p className="text-lg md:text-2xl font-bold text-slate-800">
            ₹{summary.totalIncome?.toLocaleString()}
          </p>
          <p className={`text-xs ${periodComparison.currentPeriod.income >= periodComparison.lastPeriod.income ? 'text-green-600' : 'text-red-600'}`}>
            {periodComparison.currentPeriod.income >= periodComparison.lastPeriod.income ? '↗' : '↘'}
            {periodComparison.lastPeriod.income > 0
              ? Math.abs(((periodComparison.currentPeriod.income - periodComparison.lastPeriod.income) / periodComparison.lastPeriod.income) * 100).toFixed(1)
              : '0'
            }% from last period
          </p>
        </div>
        <div className="p-2 md:p-3 bg-blue-100 rounded-full">
          <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Total Expenses Card */}
  <Card className="bg-white border-l-4 border-l-rose-500 shadow-lg">
    <CardContent className="p-4 md:p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs md:text-sm text-slate-600">Total Expenses</p>
          <p className="text-lg md:text-2xl font-bold text-slate-800">
            ₹{summary.totalExpenses?.toLocaleString()}
          </p>
          <p className={`text-xs ${periodComparison.currentPeriod.expenses <= periodComparison.lastPeriod.expenses ? 'text-green-600' : 'text-red-600'}`}>
            {periodComparison.currentPeriod.expenses <= periodComparison.lastPeriod.expenses ? '↘' : '↗'}
            {periodComparison.lastPeriod.expenses > 0
              ? Math.abs(((periodComparison.currentPeriod.expenses - periodComparison.lastPeriod.expenses) / periodComparison.lastPeriod.expenses) * 100).toFixed(1)
              : '0'
            }% from last period
          </p>
        </div>
        <div className="p-2 md:p-3 bg-rose-100 rounded-full">
          <TrendingDown className="h-5 w-5 md:h-6 md:w-6 text-rose-600" />
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Net Cash Flow Card */}
  <Card className="bg-white border-l-4 border-l-emerald-500 shadow-lg">
    <CardContent className="p-4 md:p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs md:text-sm text-slate-600">Net Cash Flow</p>
          <p className={`text-lg md:text-2xl font-bold ${summary.netCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {summary.netCashFlow >= 0 ? '+' : ''}₹{Math.abs(summary.netCashFlow).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">
            {summary.transactionCount} transactions
          </p>
        </div>
        <div className="p-2 md:p-3 bg-emerald-100 rounded-full">
          <Activity className="h-5 w-5 md:h-6 md:w-6 text-emerald-600" />
        </div>
      </div>
    </CardContent>
  </Card>

  {/* Savings Rate Card */}
  <Card className="bg-white border-l-4 border-l-purple-500 shadow-lg">
    <CardContent className="p-4 md:p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs md:text-sm text-slate-600">Savings Rate</p>
          <p className={`text-lg md:text-2xl font-bold ${summary.netCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {summary.totalIncome > 0 ? ((summary.netCashFlow / summary.totalIncome) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-xs text-slate-500">
            of income saved
          </p>
        </div>
        <div className="p-2 md:p-3 bg-purple-100 rounded-full">
          <Wallet className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
        </div>
      </div>
    </CardContent>
  </Card>
</div>

      
      {/* Charts Grid */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
  {/* Line Chart - Daily Trends */}
  <Card className="bg-white shadow-lg">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center gap-2 text-slate-800">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        Daily Cash Flow Trend ({selectedDateRange} Days)
      </CardTitle>
    </CardHeader>
    <CardContent className="h-80"> {/* ✅ Fixed height */}
      <DailyTrendChart data={charts.dailyTrends} />
    </CardContent>
  </Card>

  {/* Pie Chart - Dynamic Categories */}
  <Card className="bg-white shadow-lg">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center justify-between text-slate-800">
        {/* Left side - Title with icon */}
        <div className="flex items-center gap-2">
          <PieChartIcon className={`h-5 w-5 ${
            selectedCategoryType === 'income' ? 'text-green-600' : 'text-rose-600'
          }`} />
          {selectedCategoryType === 'income' ? 'Income Categories' : 'Expense Categories'}
          ({selectedDateRange} Days)
        </div>

        {/* Right side - Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <Select
  value={selectedCategoryType}
  onValueChange={(value) => setSelectedCategoryType(value)}
>
  <SelectTrigger className="bg-transparent border-none text-sm font-medium text-slate-700">
    <SelectValue placeholder="Select Category Type" />
  </SelectTrigger>
  <SelectContent>
    {CATEGORY_TYPES.map((type) => (
      <SelectItem key={type.value} value={type.value}>
        {type.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent className="h-80"> {/* ✅ Fixed height */}
      <CategoryPieChart
        data={
          selectedCategoryType === 'income'
            ? charts.categoryBreakdown.income
            : charts.categoryBreakdown.expenses
        }
        type={selectedCategoryType as 'income' | 'expense'}
      />
    </CardContent>
  </Card>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Spider Chart - Account Distribution */}
  <Card className="bg-white shadow-lg">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center gap-2 text-slate-800">
        <Activity className="h-5 w-5 text-purple-600" />
        Account Balance Distribution
      </CardTitle>
    </CardHeader>
    <CardContent className="h-80"> {/* ✅ Fixed height */}
      <AccountSpiderChart data={charts.accountBreakdown} />
    </CardContent>
  </Card>

  {/* Bar Chart - Period Comparison */}
  <Card className="bg-white shadow-lg">
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center gap-2 text-slate-800">
        <BarChart3 className="h-5 w-5 text-emerald-600" />
        Period Comparison ({selectedDateRange} Days vs Previous)
      </CardTitle>
    </CardHeader>
    <CardContent className="h-80"> {/* ✅ Fixed height */}
      <ComparisonBarChart
        currentData={periodComparison.currentPeriod}
        lastData={periodComparison.lastPeriod}
      />
    </CardContent>
  </Card>
</div>
    </div>
  );
};

export default OverviewPage;