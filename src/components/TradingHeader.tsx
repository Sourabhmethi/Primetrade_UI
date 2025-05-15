
import React from 'react';
import { useTrading } from '@/contexts/TradingContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, LogOut } from 'lucide-react';

export const TradingHeader = () => {
  const { 
    currentSymbol, 
    setCurrentSymbol, 
    disconnectFromExchange, 
    symbolPrices,
    getFavoriteSymbols
  } = useTrading();
  
  const favoriteSymbols = getFavoriteSymbols();
  
  const currentPrice = symbolPrices.find(p => p.symbol === currentSymbol)?.price || '0';
  const priceChangeDirection = symbolPrices.find(p => p.symbol === currentSymbol)?.priceChangeDirection;
  
  return (
    <header className="flex justify-between items-center p-4 bg-trading-panel border-b border-trading-border">
      <div className="flex items-center space-x-4">
        <Select value={currentSymbol} onValueChange={setCurrentSymbol}>
          <SelectTrigger className="w-40 bg-trading-bg-dark border-trading-border">
            <SelectValue placeholder="Select Symbol" />
          </SelectTrigger>
          <SelectContent className="bg-trading-panel border-trading-border">
            {favoriteSymbols.map(symbol => (
              <SelectItem key={symbol} value={symbol} className="text-trading-text-primary hover:bg-trading-bg-dark">
                {symbol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-col">
          <div 
            className={`text-xl font-bold ${
              priceChangeDirection === 'up' 
                ? 'text-trading-buy' 
                : priceChangeDirection === 'down' 
                  ? 'text-trading-sell' 
                  : 'text-trading-text-primary'
            } transition-colors`}
          >
            {parseFloat(currentPrice).toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 8 
            })}
          </div>
          <span className="text-xs text-trading-text-secondary">USDT</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline"
          size="sm"
          className="border-trading-border text-trading-text-secondary hover:text-trading-text-primary"
          onClick={() => {
            // Refresh functionality would go here
          }}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
        <Button 
          variant="destructive"
          size="sm"
          onClick={disconnectFromExchange}
        >
          <LogOut className="h-4 w-4 mr-1" />
          Disconnect
        </Button>
      </div>
    </header>
  );
};
