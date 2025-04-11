import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Portfolio } from "@prisma/client";

interface TradeFormProps {
  portfolioId: string;
  setPortfolio: any;
}

export function TradeForm({ portfolioId, setPortfolio }: TradeFormProps) {
  const [open, setOpen] = useState(false);
  const [ticker, setTicker] = useState("");
  const [entryPrice, setEntryPrice] = useState(0);
  const [exitPrice, setExitPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/trades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker,
          entryPrice: parseFloat(entryPrice.toString()),
          exitPrice: parseFloat(exitPrice.toString()),
          quantity: parseInt(quantity.toString()),
          date,
          portfolioId,
        }),
      });
      if (response.ok) {
        const newTrade = await response.json();
        setOpen(false);
        resetForm();
        setPortfolio((prev:any) => ({
          ...prev,
          trades: [...prev.trades, newTrade]
        }));
        router.refresh();
      } else {
        console.error("Failed to create trade");
      }
    } catch (error) {
      console.error("Error creating trade:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTicker("");
    setEntryPrice(0);
    setExitPrice(0);
    setQuantity(1);
    setDate(format(new Date(), "yyyy-MM-dd"));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Trade</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a New Trade</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ticker">Ticker Symbol</Label>
            <Input
              id="ticker"
              placeholder="e.g., AAPL"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price ($)</Label>
              <Input
                id="entryPrice"
                type="number"
                placeholder="0.00"
                value={entryPrice}
                onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exitPrice">Exit Price ($)</Label>
              <Input
                id="exitPrice"
                type="number"
                placeholder="0.00"
                value={exitPrice}
                onChange={(e) => setExitPrice(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Trade Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating..." : "Log Trade"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}