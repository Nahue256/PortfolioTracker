"use client";

import { useState, useEffect } from "react";
import { PortfolioForm } from "@/components/portfolio-form";
import { TradeForm } from "@/components/trade-form";
import { TradesTable } from "@/components/trades-table";
import { PnLChart } from "@/components/pnl-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioSelector } from "@/components/portfolio-selector";
import { useRouter } from "next/navigation";

interface Trade {
  id: string;
  ticker: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  date: string;
}

interface Portfolio {
  id: string;
  name: string;
  initialValue: number;
  trades: Trade[];
}

export default function Home() {
  const router = useRouter();
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>("");
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedPortfolioId) return;

    const fetchPortfolioDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/portfolios/${selectedPortfolioId}`);
        if (response.ok) {
          const data = await response.json();
          setPortfolio(data);
        }
      } catch (error) {
        console.error("Error fetching portfolio details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioDetails();
  }, [selectedPortfolioId]);

  const calculatePortfolioMetrics = () => {
    if (!portfolio) return { totalValue: 0, totalPnL: 0 };

    const totalPnL = portfolio.trades.reduce((sum, trade) => {
      return sum + (trade.exitPrice - trade.entryPrice) * trade.quantity;
    }, 0);

    const totalValue = portfolio.initialValue + totalPnL;

    return { totalValue, totalPnL };
  };

  const handleDeleteTrade = async (tradeId: string): Promise<void> => {
    try {
      const response = await fetch("/api/trades/" + tradeId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        window.alert('Trade Deleted Successfully')
        
        if (portfolio) {
          setPortfolio({
            ...portfolio,
            trades: portfolio.trades.filter(trade => trade.id !== tradeId)
          });
        }
        router.refresh();
      } else {
        console.error("Failed to delete trade");
      }
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  }

  const { totalValue, totalPnL } = calculatePortfolioMetrics();

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Financial Portfolio Tracker</h1>
          <PortfolioForm />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <PortfolioSelector onSelect={setSelectedPortfolioId} />
            </CardContent>
          </Card>

          {selectedPortfolioId && portfolio ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Initial Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">${portfolio.initialValue.toFixed(2)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total P&L</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-2xl font-bold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${totalPnL.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Current Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>P&L Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <PnLChart trades={portfolio.trades} initialValue={portfolio.initialValue} />
                </CardContent>
              </Card>

              <Tabs defaultValue="trades">
                <TabsList>
                  <TabsTrigger value="trades">Trades</TabsTrigger>
                </TabsList>
                <TabsContent value="trades">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Trade History</CardTitle>
                      <TradeForm portfolioId={selectedPortfolioId} setPortfolio={setPortfolio}/>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="py-8 text-center">Loading trades...</div>
                      ) : (
                        <TradesTable trades={portfolio.trades} handleDeleteTrade={handleDeleteTrade} />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                {isLoading ? (
                  <p>Loading portfolio data...</p>
                ) : (
                  <p>
                    {selectedPortfolioId
                      ? "Portfolio not found. Please select another portfolio."
                      : "Select or create a portfolio to get started."}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}