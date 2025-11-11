import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, PieLabelRenderProps } from 'recharts';

interface PieChartProps {
  data: Array<{
    name: any;
    value: number;
  }>;
  type?: 'income' | 'expense';
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
    const total = payload[0].payload.total || 0;
    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';
    
    return (
      <div className="bg-white/95 p-4 rounded-xl shadow-2xl border border-slate-200/50 min-w-[180px]">
        <div className="flex items-center gap-3 mb-2">
          <div 
            className="w-4 h-4 rounded-full shadow-sm"
            style={{ backgroundColor: payload[0].color }}
          />
          <span className="font-bold text-slate-800 text-sm">
            {data.name}
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-slate-600 text-sm">
            Amount: <span className="font-semibold text-slate-800">
              ₹{data.value.toLocaleString()}
            </span>
          </p>
          <p className="text-slate-600 text-sm">
            Percentage: <span className="font-semibold text-slate-800">
              {percentage}%
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// ✅ Label function - MOVED OUTSIDE
const simpleLabel = (props: PieLabelRenderProps) => {
  const { percent } = props;
  return percent && percent > 0.05 ? (
    <text fontSize={12} fontWeight="bold" fill="white">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export const CategoryPieChart = ({ data, type = 'expense' }: PieChartProps) => {
  // ✅ Process data
  const processedData = data
    .filter(item => item.value > 0)
    .map(item => ({
      name: String(item.name || 'Other'),
      value: item.value,
    }));

  // ✅ Dynamic color generator
  const generateColors = (count: number, baseHue: number) => {
    const colors = [];
    const saturation = 70;
    const lightness = 50;
    
    for (let i = 0; i < count; i++) {
      const hue = (baseHue + (i * 360) / count) % 360;
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  };

  // ✅ Base hues
  const baseHue = type === 'income' ? 120 : 0;
  const COLORS = generateColors(processedData.length, baseHue);

  // ✅ FIXED: Use Recharts' built-in PieLabelRenderProps
  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
    
    // ✅ Proper null checks for all required values
    if (!cx || !cy || !midAngle || !innerRadius || !outerRadius || !percent || percent < 0.05) {
      return null;
    }
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Empty state handling
  if (processedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <p className="text-lg font-semibold">No {type} data</p>
        <p className="text-sm">Add {type} transactions to see the chart</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsPieChart>
        <Pie
          data={processedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={simpleLabel} 
          outerRadius={120}
          innerRadius={60}
          paddingAngle={2}
          dataKey="value"
          animationBegin={0}
          animationDuration={1500}
          animationEasing="ease-out"
        >
          {processedData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index]}
              stroke="#ffffff"
              strokeWidth={2}
              className="transition-all duration-300 hover:opacity-80"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};