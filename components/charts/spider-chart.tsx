import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SpiderChartProps {
  data: Array<{
    name: string;
    balance: number;
    type: string | null;
  }>;
}

// ✅ Tooltip component - MOVED OUTSIDE
interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-slate-200/50 min-w-[180px]">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-3 h-3 rounded-full ${data.isNegative ? 'bg-rose-500' : 'bg-indigo-500'} shadow-sm`} />
          <span className="font-bold text-slate-800 text-sm">
            {data.name}
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-slate-600 text-sm">
            Balance: <span className={`font-semibold ${data.displayBalance >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
              ₹{Math.abs(data.displayBalance).toLocaleString()}
              {data.displayBalance < 0 && ' (Overdraft)'}
            </span>
          </p>
          <p className="text-slate-600 text-sm">
            Type: <span className="font-semibold text-slate-800 capitalize">{data.type}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// ✅ Polar angle axis label - MOVED OUTSIDE
const renderPolarAngleAxis = (props: any) => {
  const { x, y, payload } = props;
  
  return (
    <text 
      x={x} 
      y={y} 
      fill="#475569"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight="600"
      className="font-medium"
    >
      {payload.value}
    </text>
  );
};

export const AccountSpiderChart = ({ data }: SpiderChartProps) => {
  // ✅ Handle negative balances properly
  const processedData = data
    .filter(item => item.type !== null)
    .map(item => ({
      ...item,
      // Use absolute value for radar chart display, but keep original for tooltip
      balance: Math.abs(item.balance),
      displayBalance: item.balance, // Keep original for tooltip
      isNegative: item.balance < 0, // Track if original balance was negative
    }));

  // ✅ Calculate max value for scaling (use absolute values)
  const maxBalance = Math.max(...processedData.map(item => item.balance), 1000);

  // ✅ If no data or all zero balances, show message
  if (processedData.length === 0 || processedData.every(item => item.balance === 0)) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        No account data available for visualization
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart
        data={processedData}
        margin={{
          top: 30,
          right: 30,
          left: 30,
          bottom: 20,
        }}
      >
        {/* Beautiful polar grid - spider web effect */}
        <PolarGrid 
          gridType="polygon"
          stroke="#e2e8f0"
          strokeWidth={1}
          strokeOpacity={0.8}
          radialLines={true}
          polarRadius={[0, 25, 50, 75, 100]}
        />
        
        {/* Polar angle axis - account names */}
        <PolarAngleAxis 
          dataKey="name" 
          tick={renderPolarAngleAxis}
          tickLine={false}
        />
        
        {/* Polar radius axis - balance scale */}
        <PolarRadiusAxis 
          angle={30}
          domain={[0, maxBalance]}
          tickCount={6}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          tick={{ fill: '#64748b', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        
        {/* Beautiful radar area */}
        <Radar
          name="Account Balance"
          dataKey="balance"
          stroke="#4f46e5"
          fill="#4f46e5"
          fillOpacity={0.3}
          strokeWidth={2}
          dot={{
            r: 5,
            fill: "#4f46e5",
            stroke: "#ffffff",
            strokeWidth: 2,
            className: "shadow-md"
          }}
          activeDot={{
            r: 7,
            fill: "#4f46e5",
            stroke: "#ffffff",
            strokeWidth: 3,
            className: "shadow-lg"
          }}
          animationBegin={0}
          animationDuration={2000}
          animationEasing="ease-out"
        />
        
        {/* Beautiful tooltip */}
        <Tooltip content={<CustomTooltip />} />
        
        {/* Minimal legend */}
        <Legend 
          wrapperStyle={{
            paddingTop: '10px',
            fontSize: '12px',
            fontWeight: '500'
          }}
          iconType="circle"
          iconSize={8}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};