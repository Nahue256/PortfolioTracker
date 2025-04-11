import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface Trade {
  id: string;
  ticker: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  date: string;
}

interface TradesTableProps {
  trades: Trade[];
  handleDeleteTrade: (tradeId: string) => Promise<void>;
}

export function TradesTable({ trades, handleDeleteTrade }: TradesTableProps) {
  const router = useRouter();

  if (!trades.length) {
    return (
      <div className="text-center py-8">
        No trades found. Add a trade to get started!
      </div>
    );
  }  

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Entry Price</TableHead>
            <TableHead>Exit Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-right">P&L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => {
            const pnl = calculatePnL(trade);
            return (
              <TableRow key={trade.id}>
                <TableCell className="font-medium">{trade.ticker}</TableCell>
                <TableCell>
                  {format(new Date(trade.date), "MM/dd/yyyy")}
                </TableCell>
                <TableCell>${trade.entryPrice.toFixed(2)}</TableCell>
                <TableCell>${trade.exitPrice.toFixed(2)}</TableCell>
                <TableCell>{trade.quantity}</TableCell>
                <TableCell
                  className={`text-right ${
                    pnl >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ${pnl.toFixed(2)}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleDeleteTrade(trade.id)}
                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function calculatePnL(trade: Trade): number {
  return (trade.exitPrice - trade.entryPrice) * trade.quantity;
}
