
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrading } from '@/contexts/TradingContext';
import { Loader2 } from 'lucide-react';

export const ApiKeyForm = () => {
  const { apiKey, apiSecret, setApiKey, setApiSecret, connectToExchange, isLoading } = useTrading();
  const [showSecret, setShowSecret] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await connectToExchange();
  };
  
  return (
    <Card className="w-full max-w-md mx-auto bg-trading-panel border-trading-border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-trading-text-primary">Connect to Binance Futures</CardTitle>
        <CardDescription className="text-trading-text-secondary">
          Enter your Binance Futures Testnet API credentials
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm text-trading-text-secondary">API Key</label>
            <Input
              id="apiKey"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="bg-trading-bg-dark border-trading-border text-trading-text-primary"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="apiSecret" className="text-sm text-trading-text-secondary">API Secret</label>
              <button
                type="button"
                className="text-xs text-trading-text-secondary hover:text-trading-text-primary"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? 'Hide' : 'Show'}
              </button>
            </div>
            <Input
              id="apiSecret"
              type={showSecret ? "text" : "password"}
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="Enter your API secret"
              className="bg-trading-bg-dark border-trading-border text-trading-text-primary"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading || !apiKey || !apiSecret}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect to Exchange'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
