import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';

interface LineChartProps {
  data: Array<{
    date: string;
    income: number;
    expenses: number;
    net: number;
  }>;
}

// ✅ Format date for display - MOVED OUTSIDE
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

// ✅ Tooltip component - MOVED OUTSIDE
interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-slate-200/50">
        <p className="font-bold text-slate-800 mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-slate-700">
                {entry.name}:
              </span>
              <span 
                className="text-sm font-bold ml-1"
                style={{ color: entry.color }}
              >
                ₹{entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const DailyTrendChart = ({ data }: LineChartProps) => {
  // ✅ Format dates for better display
  const formattedData = data.map(item => ({
    ...item,
    displayDate: formatDate(item.date),
  }));

  // ✅ Custom colors with gradients
  const getAreaGradient = (color: string) => (
    <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity={0.3}/>
      <stop offset="100%" stopColor={color} stopOpacity={0}/>
    </linearGradient>
  );

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart
        data={formattedData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <defs>
          {getAreaGradient('#10b981')}  {/* Income - Emerald */}
          {getAreaGradient('#ef4444')}  {/* Expenses - Red */}
          {getAreaGradient('#3b82f6')}  {/* Net - Blue */}
        </defs>
        
        {/* Grid */}
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="#f1f5f9" 
          vertical={false}
          strokeOpacity={0.6}
        />
        
        {/* Axes */}
        <XAxis 
          dataKey="displayDate"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 11 }}
          interval="preserveStartEnd"
        />
        
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 11 }}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
        />
        
        {/* Tooltip */}
        <Tooltip content={<CustomTooltip />} />
        
        {/* Legend */}
        <Legend 
          wrapperStyle={{
            paddingTop: '10px',
            paddingBottom: '20px',
            fontSize: '12px',
            fontWeight: '500'
          }}
          iconType="circle"
          iconSize={8}
        />
        
        {/* Income Area */}
        <Area
          type="monotone"
          dataKey="income"
          name="Income"
          stroke="#10b981"
          fill="url(#gradient-#10b981)"
          strokeWidth={3}
          activeDot={{ 
            r: 6, 
            stroke: '#10b981', 
            strokeWidth: 2, 
            fill: '#ffffff',
            className: 'shadow-lg'
          }}
          animationBegin={0}
          animationDuration={2000}
          animationEasing="ease-out"
        />
        
        {/* Expenses Area */}
        <Area
          type="monotone"
          dataKey="expenses"
          name="Expenses"
          stroke="#ef4444"
          fill="url(#gradient-#ef4444)"
          strokeWidth={3}
          activeDot={{ 
            r: 6, 
            stroke: '#ef4444', 
            strokeWidth: 2, 
            fill: '#ffffff',
            className: 'shadow-lg'
          }}
          animationBegin={300}
          animationDuration={2000}
          animationEasing="ease-out"
        />
        
        {/* Net Line (Dashed) */}
        <Line
          type="monotone"
          dataKey="net"
          name="Net"
          stroke="#3b82f6"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ 
            r: 4, 
            stroke: '#3b82f6', 
            strokeWidth: 2, 
            fill: '#ffffff' 
          }}
          activeDot={{ 
            r: 6, 
            stroke: '#3b82f6', 
            strokeWidth: 2, 
            fill: '#ffffff' 
          }}
          animationBegin={600}
          animationDuration={2000}
          animationEasing="ease-out"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};