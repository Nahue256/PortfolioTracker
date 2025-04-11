import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Portfolio {
  id: string;
  name: string;
}

interface PortfolioSelectorProps {
  onSelect: (portfolioId: string) => void;
}

export function PortfolioSelector({ onSelect }: PortfolioSelectorProps) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch("/api/portfolios");
        if (response.ok) {
          const data = await response.json();
          setPortfolios(data);
          
          // Auto-select the first portfolio if available
          if (data.length > 0 && !selectedId) {
            setSelectedId(data[0].id);
            onSelect(data[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, [onSelect, selectedId]);

  const handleSelect = (value: string) => {
    setSelectedId(value);
    onSelect(value);
  };

  if (isLoading) {
    return <div>Loading portfolios...</div>;
  }

  if (!portfolios.length) {
    return <div>No portfolios found. Create one to get started!</div>;
  }

  return (
    <Select value={selectedId} onValueChange={handleSelect}>
      <SelectTrigger className="w-full md:w-[300px]">
        <SelectValue placeholder="Select a portfolio" />
      </SelectTrigger>
      <SelectContent>
        {portfolios.map((portfolio) => (
          <SelectItem key={portfolio.id} value={portfolio.id}>
            {portfolio.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}