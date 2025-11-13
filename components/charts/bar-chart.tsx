import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface BarChartProps {
  currentData: {
    income: number;
    expenses: number;
    remaining: number;
  };
  lastData: {
    income: number;
    expenses: number;
    remaining: number;
  };
}

// ✅ MOVED OUTSIDE COMPONENT - Tooltip components
interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

// ✅ Single Tooltip - Outside component
const SingleTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-xl  border border-slate-200">
        <p className="font-bold text-slate-800 mb-2">{label}</p>
        <p className={`text-lg font-bold ${
          data.type === 'income' ? 'text-green-600' :
          data.type === 'expense' ? 'text-red-600' :
          data.type === 'profit' ? 'text-blue-600' : 'text-orange-600'
        }`}>
          ₹{payload[0].value.toLocaleString()}
        </p>
        <p className="text-sm text-slate-600 mt-1">
          {data.type === 'profit' && 'Great! You saved money'}
          {data.type === 'loss' && 'You spent more than earned'}
          {data.type === 'income' && 'Money earned this period'}
          {data.type === 'expense' && 'Money spent this period'}
        </p>
      </div>
    );
  }
  return null;
};

// ✅ Comparison Tooltip - Outside component  
const ComparisonTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    const current = payload.find((p: any) => p.dataKey === 'current');
    const last = payload.find((p: any) => p.dataKey === 'last');
    
    const growth = last ? ((current.value - last.value) / last.value * 100) : 100;
    
    return (
      <div className="bg-white p-4 rounded-lg shadow-xl border border-slate-200">
        <p className="font-bold text-slate-800 mb-2">{label}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-medium">Current:</span>
            <span className="font-bold">₹{current.value.toLocaleString()}</span>
          </div>
          {last && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last:</span>
              <span>₹{last.value.toLocaleString()}</span>
            </div>
          )}
          {last && (
            <div className={`text-sm font-medium ${
              growth >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {growth >= 0 ? '↗' : '↘'} {Math.abs(growth).toFixed(1)}% growth
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const ComparisonBarChart = ({ currentData, lastData }: BarChartProps) => {
  // ✅ Check if last period has any data
  const hasLastPeriodData = lastData.income > 0 || lastData.expenses > 0;
  
  // ✅ Single period view if no last period data
  const singlePeriodData = [
    {
      name: 'Income',
      value: currentData.income,
      type: 'income'
    },
    {
      name: 'Expenses', 
      value: currentData.expenses,
      type: 'expense'
    },
    {
      name: 'Net Profit',
      value: currentData.remaining,
      type: currentData.remaining >= 0 ? 'profit' : 'loss'
    },
  ];

  // ✅ Two period comparison view
  const comparisonData = [
    {
      name: 'Income',
      current: currentData.income,
      last: lastData.income,
    },
    {
      name: 'Expenses', 
      current: currentData.expenses,
      last: lastData.expenses,
    },
    {
      name: 'Net',
      current: currentData.remaining,
      last: lastData.remaining,
    },
  ];

  // ✅ Colors for single period
  const getSinglePeriodColor = (type: string) => {
    switch(type) {
      case 'income': return '#10b981'; // Green
      case 'expense': return '#ef4444'; // Red
      case 'profit': return '#3b82f6'; // Blue
      case 'loss': return '#f59e0b'; // Orange
      default: return '#6b7280';
    }
  };

  // ✅ If no last period data, show single period view
  if (!hasLastPeriodData) {
    return (
      <ResponsiveContainer width="60%" height={300}>
        <BarChart data={singlePeriodData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<SingleTooltip />} />
          <Bar 
            dataKey="value" 
            name="Amount"
            radius={[6, 6, 0, 0]}
            animationBegin={0}
            animationDuration={1500}
          >
            {singlePeriodData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getSinglePeriodColor(entry.type)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // ✅ Show comparison view if last period has data
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={comparisonData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis 
          dataKey="name" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 12 }}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<ComparisonTooltip />} />
        <Legend />
        <Bar 
          dataKey="current" 
          name="Current Period"
          fill="#3b82f6"
          radius={[6, 6, 0, 0]}
          animationBegin={0}
          animationDuration={1500}
        />
        <Bar 
          dataKey="last" 
          name="Last Period"
          fill="#94a3b8" 
          radius={[6, 6, 0, 0]}
          animationBegin={300}
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};