import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";

interface TradingProviderProps {
  children: ReactNode;
}

interface Balance {
  asset: string;
  balance: string;
  withdrawAvailable: string;
}

interface Order {
  orderId: string;
  symbol: string;
  type: string;
  side: string;
  origQty: string;
  price?: string;
  status: string;
  time: number;
}

interface SymbolPrice {
  symbol: string;
  price: string;
  priceChangeDirection?: "up" | "down" | null;
}

interface TradingContextType {
  apiKey: string;
  apiSecret: string;
  isConnected: boolean;
  isLoading: boolean;
  balances: Balance[];
  openOrders: Order[];
  symbolPrices: SymbolPrice[];
  currentSymbol: string;
  setApiKey: (key: string) => void;
  setApiSecret: (secret: string) => void;
  connectToExchange: () => Promise<void>;
  disconnectFromExchange: () => void;
  placeMarketOrder: (symbol: string, side: string, quantity: number) => Promise<Order | null>;
  placeLimitOrder: (symbol: string, side: string, quantity: number, price: number) => Promise<Order | null>;
  placeStopLimitOrder: (symbol: string, side: string, quantity: number, price: number, stopPrice: number) => Promise<Order | null>;
  cancelOrder: (symbol: string, orderId: string) => Promise<boolean>;
  refreshBalances: () => Promise<void>;
  refreshOpenOrders: () => Promise<void>;
  getSymbolPrice: (symbol: string) => Promise<number | null>;
  setCurrentSymbol: (symbol: string) => void;
  getFavoriteSymbols: () => string[];
  addFavoriteSymbol: (symbol: string) => void;
  removeFavoriteSymbol: (symbol: string) => void;
}

const DEFAULT_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "ADAUSDT", "DOGEUSDT"];

// Create the trading context
const TradingContext = createContext<TradingContextType | undefined>(undefined);

// Mock data for demo purposes
const MOCK_BALANCES: Balance[] = [
  { asset: "USDT", balance: "10000.00", withdrawAvailable: "10000.00" },
  { asset: "BTC", balance: "0.5", withdrawAvailable: "0.5" },
  { asset: "ETH", balance: "10.0", withdrawAvailable: "10.0" }
];

const MOCK_ORDERS: Order[] = [
  { 
    orderId: "12345", 
    symbol: "BTCUSDT", 
    type: "LIMIT", 
    side: "BUY", 
    origQty: "0.1", 
    price: "25000", 
    status: "NEW",
    time: Date.now() - 3600000
  },
  { 
    orderId: "12346", 
    symbol: "ETHUSDT", 
    type: "STOP_MARKET", 
    side: "SELL", 
    origQty: "1.5", 
    price: "1800", 
    status: "NEW",
    time: Date.now() - 7200000
  }
];

// Initial prices for common trading pairs
const MOCK_PRICES: SymbolPrice[] = [
  { symbol: "BTCUSDT", price: "27350.45" },
  { symbol: "ETHUSDT", price: "1842.23" },
  { symbol: "BNBUSDT", price: "215.67" },
  { symbol: "ADAUSDT", price: "0.2456" },
  { symbol: "DOGEUSDT", price: "0.06234" }
];

export const TradingProvider = ({ children }: TradingProviderProps) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [apiSecret, setApiSecret] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [openOrders, setOpenOrders] = useState<Order[]>([]);
  const [symbolPrices, setSymbolPrices] = useState<SymbolPrice[]>(MOCK_PRICES);
  const [currentSymbol, setCurrentSymbol] = useState<string>("BTCUSDT");
  const [favoriteSymbols, setFavoriteSymbols] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoriteSymbols");
    return saved ? JSON.parse(saved) : DEFAULT_SYMBOLS;
  });

  // Save favorites to local storage when it changes
  useEffect(() => {
    localStorage.setItem("favoriteSymbols", JSON.stringify(favoriteSymbols));
  }, [favoriteSymbols]);

  // Mock price fluctuations for demo
  useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(() => {
      setSymbolPrices(prev => {
        return prev.map(symbolPrice => {
          const currentPrice = parseFloat(symbolPrice.price);
          const change = (Math.random() - 0.5) * currentPrice * 0.002; // Small random change
          const newPrice = (currentPrice + change).toFixed(
            symbolPrice.symbol.includes("BTC") ? 2 : 
            symbolPrice.symbol.includes("ETH") ? 2 : 
            symbolPrice.symbol.includes("DOGE") ? 5 : 2
          );
          
          return {
            ...symbolPrice,
            price: newPrice,
            priceChangeDirection: change > 0 ? "up" : "down"
          };
        });
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isConnected]);

  // Connect to exchange (mocked)
  const connectToExchange = async () => {
    setIsLoading(true);
    try {
      // Simulate API connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!apiKey || !apiSecret) {
        throw new Error("API key and secret are required");
      }
      
      // In a real app, you would validate credentials here
      setIsConnected(true);
      setBalances(MOCK_BALANCES);
      setOpenOrders(MOCK_ORDERS);
      toast.success("Connected to Binance Futures Testnet");
    } catch (error) {
      console.error("Connection error:", error);
      toast.error(`Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectFromExchange = () => {
    setIsConnected(false);
    setBalances([]);
    setOpenOrders([]);
    toast.info("Disconnected from exchange");
  };

  // Place a market order
  const placeMarketOrder = async (symbol: string, side: string, quantity: number) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newOrder: Order = {
        orderId: Math.floor(Math.random() * 1000000).toString(),
        symbol,
        type: "MARKET",
        side,
        origQty: quantity.toString(),
        status: "FILLED",
        time: Date.now()
      };
      
      // In a real app, you'd call the Binance API here
      
      // Update orders and simulate balance change
      setOpenOrders(prev => [...prev.filter(order => 
        !(order.symbol === symbol && order.side === side && order.type === "MARKET")
      ), newOrder]);
      
      toast.success(`Market order placed: ${side} ${quantity} ${symbol}`);
      await refreshBalances();
      return newOrder;
    } catch (error) {
      console.error("Market order error:", error);
      toast.error(`Order failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Place a limit order
  const placeLimitOrder = async (symbol: string, side: string, quantity: number, price: number) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newOrder: Order = {
        orderId: Math.floor(Math.random() * 1000000).toString(),
        symbol,
        type: "LIMIT",
        side,
        origQty: quantity.toString(),
        price: price.toString(),
        status: "NEW",
        time: Date.now()
      };
      
      // In a real app, you'd call the Binance API here
      
      // Update orders list
      setOpenOrders(prev => [...prev, newOrder]);
      
      toast.success(`Limit order placed: ${side} ${quantity} ${symbol} @ ${price}`);
      return newOrder;
    } catch (error) {
      console.error("Limit order error:", error);
      toast.error(`Order failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Place a stop-limit order
  const placeStopLimitOrder = async (symbol: string, side: string, quantity: number, price: number, stopPrice: number) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newOrder: Order = {
        orderId: Math.floor(Math.random() * 1000000).toString(),
        symbol,
        type: "STOP_MARKET",
        side,
        origQty: quantity.toString(),
        price: price.toString(), // This would be the limit price
        status: "NEW",
        time: Date.now()
      };
      
      // In a real app, you'd call the Binance API here
      
      // Update orders list
      setOpenOrders(prev => [...prev, newOrder]);
      
      toast.success(`Stop order placed: ${side} ${quantity} ${symbol} @ ${price}, stop @ ${stopPrice}`);
      return newOrder;
    } catch (error) {
      console.error("Stop-limit order error:", error);
      toast.error(`Order failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel an order
  const cancelOrder = async (symbol: string, orderId: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // In a real app, you'd call the Binance API here
      
      // Remove the cancelled order from state
      setOpenOrders(prev => prev.filter(order => order.orderId !== orderId));
      
      toast.success(`Order ${orderId} cancelled successfully`);
      return true;
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error(`Cancel failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh account balances
  const refreshBalances = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // In a real app, you'd call the Binance API here
      // For demo, just keep the mock balances with small variations
      setBalances(MOCK_BALANCES.map(balance => ({
        ...balance,
        balance: (parseFloat(balance.balance) * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2),
        withdrawAvailable: (parseFloat(balance.withdrawAvailable) * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)
      })));
      
    } catch (error) {
      console.error("Balance refresh error:", error);
      toast.error(`Couldn't refresh balances: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh open orders
  const refreshOpenOrders = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // In a real app, you'd call the Binance API here
      // For demo, we'll just use our mock orders
      
      toast.success("Orders refreshed");
    } catch (error) {
      console.error("Open orders refresh error:", error);
      toast.error(`Couldn't refresh orders: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get current price for a symbol
  const getSymbolPrice = async (symbol: string): Promise<number | null> => {
    try {
      // In a real app, you'd call the Binance API here
      const symbolPrice = symbolPrices.find(sp => sp.symbol === symbol);
      return symbolPrice ? parseFloat(symbolPrice.price) : null;
    } catch (error) {
      console.error("Get price error:", error);
      toast.error(`Couldn't get price for ${symbol}: ${error instanceof Error ? error.message : "Unknown error"}`);
      return null;
    }
  };

  // Favorites management
  const getFavoriteSymbols = () => favoriteSymbols;
  
  const addFavoriteSymbol = (symbol: string) => {
    if (!favoriteSymbols.includes(symbol)) {
      setFavoriteSymbols(prev => [...prev, symbol]);
      toast.success(`Added ${symbol} to favorites`);
    }
  };
  
  const removeFavoriteSymbol = (symbol: string) => {
    setFavoriteSymbols(prev => prev.filter(s => s !== symbol));
    toast.success(`Removed ${symbol} from favorites`);
  };

  return (
    <TradingContext.Provider value={{
      apiKey,
      apiSecret,
      isConnected,
      isLoading,
      balances,
      openOrders,
      symbolPrices,
      currentSymbol,
      setApiKey,
      setApiSecret,
      connectToExchange,
      disconnectFromExchange,
      placeMarketOrder,
      placeLimitOrder,
      placeStopLimitOrder,
      cancelOrder,
      refreshBalances,
      refreshOpenOrders,
      getSymbolPrice,
      setCurrentSymbol,
      getFavoriteSymbols,
      addFavoriteSymbol,
      removeFavoriteSymbol
    }}>
      {children}
    </TradingContext.Provider>
  );
};

// Custom hook for using the trading context
export const useTrading = () => {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error("useTrading must be used within a TradingProvider");
  }
  return context;
};
