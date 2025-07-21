import { DollarSign, Package, Fuel, TrendingUp, Building2, Calendar } from 'lucide-react';
import { MetricCard } from '@/components/MetricCard';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { state } = useAppContext();
  
  // Calculate today's deliveries
  const today = new Date().toISOString().split('T')[0];
  const todayDeliveries = state.deliveries.filter(d => d.date === today);
  const todayEarnings = todayDeliveries.reduce((sum, d) => sum + d.totalValue, 0);
  const todayDeliveryCount = todayDeliveries.reduce((sum, d) => sum + d.deliveries, 0);
  
  // Calculate this month's data
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthDeliveries = state.deliveries.filter(d => d.date.startsWith(currentMonth));
  const monthEarnings = monthDeliveries.reduce((sum, d) => sum + d.totalValue, 0);
  
  // Calculate average per delivery
  const totalDeliveries = state.deliveries.reduce((sum, d) => sum + d.deliveries, 0);
  const avgPerDelivery = totalDeliveries > 0 ? state.totalEarnings / totalDeliveries : 0;
  
  // Recent activity
  const recentDeliveries = state.deliveries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Olá, Motoqueiro! 🏍️</h2>
        <p className="text-muted-foreground">Aqui está um resumo do seu dia</p>
      </div>

      {/* Today's Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Hoje</h3>
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            title="Ganhos"
            value={`R$ ${todayEarnings.toFixed(2)}`}
            subtitle={`${todayDeliveryCount} entregas`}
            icon={DollarSign}
            variant="success"
          />
          <MetricCard
            title="Entregas"
            value={todayDeliveryCount.toString()}
            subtitle="realizadas"
            icon={Package}
            variant="primary"
          />
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Este Mês</h3>
        <div className="grid grid-cols-1 gap-4">
          <MetricCard
            title="Ganhos Totais"
            value={`R$ ${state.totalEarnings.toFixed(2)}`}
            subtitle={`${totalDeliveries} entregas realizadas`}
            icon={DollarSign}
            variant="success"
          />
          <MetricCard
            title="Lucro Líquido"
            value={`R$ ${state.netProfit.toFixed(2)}`}
            subtitle={`Após R$ ${state.totalFuelCost.toFixed(2)} em combustível`}
            icon={TrendingUp}
            variant={state.netProfit >= 0 ? 'success' : 'warning'}
          />
          <MetricCard
            title="Média por Entrega"
            value={`R$ ${avgPerDelivery.toFixed(2)}`}
            subtitle="valor médio"
            icon={TrendingUp}
            variant="primary"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Ações Rápidas</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/add-delivery">
            <Button variant="default" size="lg" className="w-full">
              <Package className="mr-2 h-5 w-5" />
              Registrar Entrega
            </Button>
          </Link>
          <Link to="/fuel">
            <Button variant="warning" size="lg" className="w-full">
              <Fuel className="mr-2 h-5 w-5" />
              Add Combustível
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/companies">
            <Button variant="outline" size="lg" className="w-full">
              <Building2 className="mr-2 h-5 w-5" />
              Empresas
            </Button>
          </Link>
          <Link to="/reports">
            <Button variant="outline" size="lg" className="w-full">
              <Calendar className="mr-2 h-5 w-5" />
              Relatórios
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      {recentDeliveries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Atividade Recente</h3>
          <div className="space-y-2">
            {recentDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="bg-card p-3 rounded-lg border border-border shadow-card"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-foreground">{delivery.companyName}</p>
                    <p className="text-sm text-muted-foreground">
                      {delivery.deliveries} entregas • {new Date(delivery.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">R$ {delivery.totalValue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started */}
      {state.deliveries.length === 0 && (
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border border-primary/20 text-center space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Começar a usar</h3>
          <p className="text-muted-foreground">
            Registre sua primeira entrega ou configure suas empresas parceiras para começar a controlar seus ganhos!
          </p>
          <div className="space-y-2">
            <Link to="/add-delivery">
              <Button variant="default" className="w-full">
                Registrar Primeira Entrega
              </Button>
            </Link>
            <Link to="/companies">
              <Button variant="outline" className="w-full">
                Configurar Empresas
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}