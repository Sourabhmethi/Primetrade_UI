
import React from 'react';
import { useTrading } from '@/contexts/TradingContext';
import { TradingHeader } from './TradingHeader';
import { OrderForm } from './OrderForm';
import { OrdersList } from './OrdersList';
import { AccountBalance } from './AccountBalance';
import { MarketTicker } from './MarketTicker';
import { ApiKeyForm } from './ApiKeyForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const TradingDashboard = () => {
  const { isConnected } = useTrading();
  
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-trading-bg-dark p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            Binance Futures Trading Bot
          </h1>
          <p className="text-trading-text-secondary text-center">
            Connect to the Binance Futures Testnet to start trading
          </p>
        </div>
        <ApiKeyForm />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-trading-bg-dark flex flex-col">
      <TradingHeader />
      
      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column: Order form and account balance */}
        <div className="space-y-4">
          <OrderForm />
          <AccountBalance />
        </div>
        
        {/* Center and right columns: Market view and orders */}
        <div className="lg:col-span-2 space-y-4">
          <MarketTicker />
          
          <div className="bg-trading-panel border border-trading-border rounded-md">
            <Tabs defaultValue="open" className="w-full">
              <div className="border-b border-trading-border p-2">
                <TabsList className="bg-trading-bg-dark">
                  <TabsTrigger value="open">Open Orders</TabsTrigger>
                  <TabsTrigger value="history">Order History</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="open" className="mt-0">
                <OrdersList />
              </TabsContent>
              
              <TabsContent value="history" className="mt-0">
                <div className="p-4 text-center text-trading-text-secondary">
                  Order history will appear here
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <footer className="p-4 border-t border-trading-border bg-trading-panel">
        <div className="text-center text-trading-text-secondary text-sm">
          Binance Futures Trading Bot (Testnet) - This is a simulation environment
        </div>
      </footer>
    </div>
  );
};
