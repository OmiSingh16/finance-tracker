'use client';
import { useGetSummary } from '@/features/summary/api/use-get-summary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day
    
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - parseInt(selectedDateRange));
    
    return {
      from: fromDate.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0]
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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">No data available</h1>
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
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
              <Calendar className="h-4 w-4 text-slate-500" />
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium text-slate-700"
              >
                {DATE_RANGES.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>


      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white border-l-4 border-l-blue-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-600">Total Income</p>
                <p className="text-2xl font-bold text-slate-800">
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
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-rose-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-600">Total Expenses</p>
                <p className="text-2xl font-bold text-slate-800">
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
              <div className="p-3 bg-rose-100 rounded-full">
                <TrendingDown className="h-6 w-6 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-emerald-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-600">Net Cash Flow</p>
                <p className={`text-2xl font-bold ${summary.netCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {summary.netCashFlow >= 0 ? '+' : ''}₹{Math.abs(summary.netCashFlow).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">
                  {summary.transactionCount} transactions
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-purple-500 shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-600">Savings Rate</p>
                <p className={`text-2xl font-bold ${summary.netCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {summary.totalIncome > 0 ? ((summary.netCashFlow / summary.totalIncome) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-slate-500">
                  of income saved
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Wallet className="h-6 w-6 text-purple-600" />
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
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={selectedCategoryType}
            onChange={(e) => setSelectedCategoryType(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium text-slate-700"
          >
            {CATEGORY_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
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