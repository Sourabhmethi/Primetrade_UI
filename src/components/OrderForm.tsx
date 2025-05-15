
import React, { useState, useEffect } from 'react';
import { useTrading } from '@/contexts/TradingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const OrderForm = () => {
  const { 
    currentSymbol, 
    symbolPrices, 
    placeMarketOrder, 
    placeLimitOrder, 
    placeStopLimitOrder,
    isLoading,
    balances
  } = useTrading();
  
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [sliderValue, setSliderValue] = useState(0);
  
  // Get current price for the selected symbol
  const currentPrice = parseFloat(
    symbolPrices.find(p => p.symbol === currentSymbol)?.price || '0'
  );
  
  // Get available USDT balance
  const usdtBalance = parseFloat(
    balances.find(b => b.asset === 'USDT')?.balance || '0'
  );
  
  // Update price when symbol or current price changes
  useEffect(() => {
    if (currentPrice > 0) {
      setPrice(currentPrice.toString());
      setStopPrice(
        side === 'buy' 
          ? (currentPrice * 1.05).toFixed(2) // 5% above for buy stop
          : (currentPrice * 0.95).toFixed(2) // 5% below for sell stop
      );
    }
  }, [currentSymbol, currentPrice, side]);
  
  // Format price based on symbol
  const formatPriceForSymbol = (value: number) => {
    if (currentSymbol.includes('BTC')) return value.toFixed(2);
    if (currentSymbol.includes('ETH')) return value.toFixed(2);
    if (currentSymbol.includes('DOGE')) return value.toFixed(5);
    return value.toFixed(2);
  };
  
  // Handle slider change for quantity percentage
  const handleSliderChange = (value: number[]) => {
    const percentage = value[0];
    setSliderValue(percentage);
    
    const baseAsset = currentSymbol.replace('USDT', '');
    
    // For market and limit orders, calculate based on USDT balance
    if (orderType !== 'stop') {
      if (side === 'buy') {
        const maxBuyQuantity = usdtBalance * (percentage / 100) / currentPrice;
        setQuantity(maxBuyQuantity.toFixed(6));
      } else {
        // For sell, would need to get asset balance (mocked for now)
        const assetBalance = parseFloat(
          balances.find(b => b.asset === baseAsset)?.balance || '1.0'
        );
        const maxSellQuantity = assetBalance * (percentage / 100);
        setQuantity(maxSellQuantity.toFixed(6));
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quantity || parseFloat(quantity) <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }
    
    try {
      if (orderType === 'market') {
        await placeMarketOrder(currentSymbol, side.toUpperCase(), parseFloat(quantity));
      } else if (orderType === 'limit') {
        if (!price || parseFloat(price) <= 0) {
          toast.error("Please enter a valid price");
          return;
        }
        
        await placeLimitOrder(
          currentSymbol, 
          side.toUpperCase(), 
          parseFloat(quantity), 
          parseFloat(price)
        );
      } else if (orderType === 'stop') {
        if (!price || parseFloat(price) <= 0 || !stopPrice || parseFloat(stopPrice) <= 0) {
          toast.error("Please enter valid price and stop price");
          return;
        }
        
        await placeStopLimitOrder(
          currentSymbol, 
          side.toUpperCase(), 
          parseFloat(quantity), 
          parseFloat(price),
          parseFloat(stopPrice)
        );
      }
      
      // Reset form
      setQuantity('');
      setSliderValue(0);
    } catch (error) {
      console.error("Order submission error:", error);
    }
  };
  
  return (
    <div className="bg-trading-panel border border-trading-border rounded-md p-4">
      <Tabs defaultValue="market" value={orderType} onValueChange={setOrderType} className="w-full">
        <TabsList className="w-full mb-4 bg-trading-bg-dark order-type-tabs">
          <TabsTrigger value="market" className="flex-1">Market</TabsTrigger>
          <TabsTrigger value="limit" className="flex-1">Limit</TabsTrigger>
          <TabsTrigger value="stop" className="flex-1">Stop</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit}>
          {/* Side selection (Buy/Sell) */}
          <div className="grid grid-cols-2 gap-2 mb-4 side-tabs">
            <Button
              type="button"
              data-tab="buy"
              data-state={side === 'buy' ? 'active' : 'inactive'}
              className={`w-full ${
                side === 'buy'
                  ? 'bg-trading-buy text-white'
                  : 'bg-muted text-muted-foreground hover:bg-trading-buy/20'
              }`}
              onClick={() => setSide('buy')}
            >
              Buy/Long
            </Button>
            <Button
              type="button"
              data-tab="sell"
              data-state={side === 'sell' ? 'active' : 'inactive'}
              className={`w-full ${
                side === 'sell'
                  ? 'bg-trading-sell text-white'
                  : 'bg-muted text-muted-foreground hover:bg-trading-sell/20'
              }`}
              onClick={() => setSide('sell')}
            >
              Sell/Short
            </Button>
          </div>
          
          <TabsContent value="market" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-trading-text-secondary">Quantity</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  step="0.000001"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0.0"
                  className="bg-trading-bg-dark border-trading-border text-trading-text-primary"
                />
                <div className="bg-trading-bg-dark border border-trading-border rounded px-3 py-2 text-sm text-trading-text-secondary whitespace-nowrap">
                  {currentSymbol.replace('USDT', '')}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-trading-text-secondary">Size</label>
                <span className="text-sm text-trading-text-secondary">{sliderValue}%</span>
              </div>
              <Slider
                defaultValue={[0]}
                value={[sliderValue]}
                onValueChange={handleSliderChange}
                max={100}
                step={5}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-trading-text-secondary">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="limit" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-trading-text-secondary">Price (USDT)</label>
              <Input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.0"
                className="bg-trading-bg-dark border-trading-border text-trading-text-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-trading-text-secondary">Quantity</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  step="0.000001"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0.0"
                  className="bg-trading-bg-dark border-trading-border text-trading-text-primary"
                />
                <div className="bg-trading-bg-dark border border-trading-border rounded px-3 py-2 text-sm text-trading-text-secondary whitespace-nowrap">
                  {currentSymbol.replace('USDT', '')}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-trading-text-secondary">Size</label>
                <span className="text-sm text-trading-text-secondary">{sliderValue}%</span>
              </div>
              <Slider
                defaultValue={[0]}
                value={[sliderValue]}
                onValueChange={handleSliderChange}
                max={100}
                step={5}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-trading-text-secondary">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stop" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-trading-text-secondary">Stop Price (USDT)</label>
              <Input
                type="number"
                step="0.01"
                value={stopPrice}
                onChange={(e) => setStopPrice(e.target.value)}
                placeholder="0.0"
                className="bg-trading-bg-dark border-trading-border text-trading-text-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-trading-text-secondary">Limit Price (USDT)</label>
              <Input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.0"
                className="bg-trading-bg-dark border-trading-border text-trading-text-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-trading-text-secondary">Quantity</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  step="0.000001"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0.0"
                  className="bg-trading-bg-dark border-trading-border text-trading-text-primary"
                />
                <div className="bg-trading-bg-dark border border-trading-border rounded px-3 py-2 text-sm text-trading-text-secondary whitespace-nowrap">
                  {currentSymbol.replace('USDT', '')}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-trading-text-secondary">Size</label>
                <span className="text-sm text-trading-text-secondary">{sliderValue}%</span>
              </div>
              <Slider
                defaultValue={[0]}
                value={[sliderValue]}
                onValueChange={handleSliderChange}
                max={100}
                step={5}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-trading-text-secondary">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </TabsContent>
          
          <div className="mt-6">
            <Button
              type="submit"
              className={`w-full ${
                side === 'buy'
                  ? 'bg-trading-buy hover:bg-trading-buy/90'
                  : 'bg-trading-sell hover:bg-trading-sell/90'
              } text-white`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Processing...
                </>
              ) : (
                `${side === 'buy' ? 'Buy/Long' : 'Sell/Short'} ${currentSymbol}`
              )}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
};
