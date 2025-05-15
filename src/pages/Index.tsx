
import { TradingProvider } from '@/contexts/TradingContext';
import { TradingDashboard } from '@/components/TradingDashboard';

const Index = () => {
  return (
    <TradingProvider>
      <TradingDashboard />
    </TradingProvider>
  );
};

export default Index;
