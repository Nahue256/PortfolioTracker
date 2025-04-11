import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

interface Trade {
  id: string;
  ticker: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  date: string;
}

interface PnLChartProps {
  trades: Trade[];
  initialValue?: number;
}

export function PnLChart({ trades, initialValue = 0 }: PnLChartProps) {
  const chartData = useMemo(() => {
    if (!trades.length) return [];

    // Sort trades by date
    const sortedTrades = [...trades].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate cumulative P&L
    let cumulativePnL = initialValue;
    return sortedTrades.map((trade) => {
      const tradePnL = (trade.exitPrice - trade.entryPrice) * trade.quantity;
      cumulativePnL += tradePnL;
      
      return {
        date: trade.date,
        pnl: cumulativePnL,
      };
    });
  }, [trades, initialValue]);

  if (!chartData.length) {
    return (
      <div className="text-center py-12">
        Add trades to see your P&L chart
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(timestamp) => format(new Date(timestamp), "MM/dd")}
          />
          <YAxis
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, "P&L"]}
            labelFormatter={(label) => format(new Date(label), "MM/dd/yyyy")}
          />
          <Line
            type="monotone"
            dataKey="pnl"
            stroke="#10b981"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}