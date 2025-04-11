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

export function PortfolioForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [initialValue, setInitialValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/portfolios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          initialValue: parseFloat(initialValue.toString()),
        }),
      });

      if (response.ok) {
        setOpen(false);
        setName("");
        setInitialValue(0);
        router.refresh();
      } else {
        console.error("Failed to create portfolio");
      }
    } catch (error) {
      console.error("Error creating portfolio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Portfolio</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Portfolio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Portfolio Name</Label>
            <Input
              id="name"
              placeholder="Enter portfolio name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="initialValue">Initial Value ($)</Label>
            <Input
              id="initialValue"
              type="number"
              placeholder="0.00"
              value={initialValue}
              onChange={(e) => setInitialValue(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating..." : "Create Portfolio"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}