
import React from 'react';
import { useTrading } from '@/contexts/TradingContext';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

export const MarketTicker = () => {
  const { 
    symbolPrices, 
    setCurrentSymbol, 
    currentSymbol,
    getFavoriteSymbols,
    addFavoriteSymbol,
    removeFavoriteSymbol
  } = useTrading();
  
  const favoriteSymbols = getFavoriteSymbols();
  
  const handleSymbolClick = (symbol: string) => {
    setCurrentSymbol(symbol);
  };
  
  const toggleFavorite = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favoriteSymbols.includes(symbol)) {
      removeFavoriteSymbol(symbol);
    } else {
      addFavoriteSymbol(symbol);
    }
  };
  
  // Show only favorite symbols or a default set
  const displayedSymbols = symbolPrices.filter(sp => 
    favoriteSymbols.includes(sp.symbol)
  );
  
  if (displayedSymbols.length === 0) {
    return (
      <div className="p-4 text-center text-trading-text-secondary">
        No favorite symbols. Add some by clicking the star icon.
      </div>
    );
  }
  
  return (
    <div className="bg-trading-panel border border-trading-border rounded-md">
      <div className="border-b border-trading-border p-3">
        <h3 className="font-medium text-trading-text-primary">Market Overview</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2">
        {displayedSymbols.map((symbol) => (
          <div 
            key={symbol.symbol} 
            className={`
              flex items-center justify-between p-3 rounded cursor-pointer
              ${currentSymbol === symbol.symbol ? 'bg-blue-900/30' : 'hover:bg-trading-bg-dark/30'}
            `}
            onClick={() => handleSymbolClick(symbol.symbol)}
          >
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 mr-2"
                onClick={(e) => toggleFavorite(symbol.symbol, e)}
              >
                <Star className={`h-4 w-4 ${
                  favoriteSymbols.includes(symbol.symbol) 
                    ? 'text-yellow-500 fill-yellow-500' 
                    : 'text-trading-text-secondary'
                }`} />
              </Button>
              <span className="font-medium">{symbol.symbol}</span>
            </div>
            <div 
              className={`text-right font-semibold ${
                symbol.priceChangeDirection === 'up' 
                  ? 'text-trading-buy' 
                  : symbol.priceChangeDirection === 'down' 
                    ? 'text-trading-sell' 
                    : 'text-trading-text-primary'
              }`}
            >
              {parseFloat(symbol.price).toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 8 
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
