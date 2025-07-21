import { BarChart3, Download, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { MetricCard } from '@/components/MetricCard';

export default function Reports() {
  const { state } = useAppContext();

  const earningsByCompany = state.companies.map(company => ({
    name: company.name,
    earnings: state.deliveries
      .filter(d => d.companyId === company.id)
      .reduce((sum, d) => sum + d.totalValue, 0),
    deliveries: company.totalDeliveries,
    color: company.color
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Relatórios</h2>
        <p className="text-muted-foreground">Análise dos seus ganhos</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <MetricCard
          title="Lucro Líquido"
          value={`R$ ${state.netProfit.toFixed(2)}`}
          subtitle={`${state.totalEarnings.toFixed(2)} - ${state.totalFuelCost.toFixed(2)} combustível`}
          icon={TrendingUp}
          variant="success"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Ganhos por Empresa</h3>
        {earningsByCompany.map((company) => (
          <Card key={company.name} className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: company.color }}
                />
                <div>
                  <h4 className="font-semibold">{company.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {company.deliveries} entregas
                  </p>
                </div>
              </div>
              <p className="font-bold text-success">
                R$ {company.earnings.toFixed(2)}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}