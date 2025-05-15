
import React from 'react';
import { useTrading } from '@/contexts/TradingContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export const OrdersList = () => {
  const { openOrders, cancelOrder } = useTrading();
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };
  
  if (openOrders.length === 0) {
    return (
      <div className="p-4 text-center text-trading-text-secondary">
        No open orders
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full">
        <thead>
          <tr className="border-b border-trading-border text-xs text-trading-text-secondary">
            <th className="p-3 text-left">Symbol</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Side</th>
            <th className="p-3 text-right">Quantity</th>
            <th className="p-3 text-right">Price</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Time</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {openOrders.map((order) => (
            <tr 
              key={order.orderId} 
              className="border-b border-trading-border hover:bg-trading-bg-dark/30"
            >
              <td className="p-3 text-left font-medium">{order.symbol}</td>
              <td className="p-3 text-left">{order.type}</td>
              <td className="p-3 text-left">
                <span className={`px-2 py-1 rounded text-xs ${
                  order.side === 'BUY' 
                    ? 'bg-trading-buy/20 text-trading-buy' 
                    : 'bg-trading-sell/20 text-trading-sell'
                }`}>
                  {order.side}
                </span>
              </td>
              <td className="p-3 text-right">{order.origQty}</td>
              <td className="p-3 text-right">{order.price || 'MARKET'}</td>
              <td className="p-3 text-left">{order.status}</td>
              <td className="p-3 text-left text-xs">{formatDate(order.time)}</td>
              <td className="p-3 text-center">
                {order.status === 'NEW' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-trading-text-secondary hover:text-trading-sell"
                    onClick={() => cancelOrder(order.symbol, order.orderId)}
                    title="Cancel order"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
