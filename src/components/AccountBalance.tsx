
import React from 'react';
import { useTrading } from '@/contexts/TradingContext';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export const AccountBalance = () => {
  const { balances, refreshBalances, isLoading } = useTrading();
  
  // Filter out zero balances
  const nonZeroBalances = balances.filter(balance => 
    parseFloat(balance.balance) > 0
  );
  
  return (
    <div className="bg-trading-panel border border-trading-border rounded-md">
      <div className="border-b border-trading-border p-3 flex items-center justify-between">
        <h3 className="font-medium text-trading-text-primary">Account Balance</h3>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0"
          disabled={isLoading}
          onClick={refreshBalances}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-trading-text-secondary">
              <th className="p-3 text-left">Asset</th>
              <th className="p-3 text-right">Balance</th>
              <th className="p-3 text-right">Available</th>
            </tr>
          </thead>
          <tbody>
            {nonZeroBalances.length > 0 ? (
              nonZeroBalances.map((balance) => (
                <tr 
                  key={balance.asset} 
                  className="border-b border-trading-border hover:bg-trading-bg-dark/30"
                >
                  <td className="p-3 text-left font-medium">{balance.asset}</td>
                  <td className="p-3 text-right">
                    {parseFloat(balance.balance).toLocaleString('en-US', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 8
                    })}
                  </td>
                  <td className="p-3 text-right">
                    {parseFloat(balance.withdrawAvailable).toLocaleString('en-US', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 8
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center p-4 text-trading-text-secondary">
                  No balances found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
