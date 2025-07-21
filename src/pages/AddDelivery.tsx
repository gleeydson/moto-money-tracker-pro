import { useState } from 'react';
import { Package, DollarSign, Calendar, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { MetricCard } from '@/components/MetricCard';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export default function AddDelivery() {
  const { state, dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    companyId: '',
    deliveries: '',
    date: new Date().toISOString().split('T')[0]
  });

  const selectedCompany = state.companies.find(c => c.id === formData.companyId);
  const totalValue = selectedCompany && formData.deliveries 
    ? selectedCompany.valuePerDelivery * parseInt(formData.deliveries)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyId || !formData.deliveries || !formData.date) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const deliveries = parseInt(formData.deliveries);
    if (isNaN(deliveries) || deliveries <= 0) {
      toast({
        title: "Erro",
        description: "Número de entregas deve ser um número positivo",
        variant: "destructive"
      });
      return;
    }

    const company = state.companies.find(c => c.id === formData.companyId);
    if (!company) {
      toast({
        title: "Erro",
        description: "Empresa não encontrada",
        variant: "destructive"
      });
      return;
    }

    dispatch({
      type: 'ADD_DELIVERY',
      payload: {
        companyId: formData.companyId,
        companyName: company.name,
        deliveries,
        valuePerDelivery: company.valuePerDelivery,
        totalValue: company.valuePerDelivery * deliveries,
        date: formData.date
      }
    });

    toast({
      title: "Sucesso! 🎉",
      description: `${deliveries} entregas registradas para ${company.name}`
    });

    // Reset form but keep date and company
    setFormData(prev => ({
      ...prev,
      deliveries: ''
    }));
  };

  // Get today's deliveries
  const todayDeliveries = state.deliveries.filter(d => d.date === formData.date);
  const todayEarnings = todayDeliveries.reduce((sum, d) => sum + d.totalValue, 0);
  const todayDeliveryCount = todayDeliveries.reduce((sum, d) => sum + d.deliveries, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Registrar Entregas</h2>
        <p className="text-muted-foreground">Adicione suas entregas do dia</p>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Ganhos Hoje"
          value={`R$ ${todayEarnings.toFixed(2)}`}
          icon={DollarSign}
          variant="success"
        />
        <MetricCard
          title="Entregas Hoje"
          value={todayDeliveryCount.toString()}
          icon={Package}
          variant="primary"
        />
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          {/* Company Selection */}
          <div className="space-y-2">
            <Label>Empresa</Label>
            {state.companies.length === 0 ? (
              <div className="p-4 bg-muted rounded-lg text-center space-y-2">
                <Building2 className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma empresa cadastrada
                </p>
                <Link to="/companies">
                  <Button variant="outline" size="sm">
                    Cadastrar Empresas
                  </Button>
                </Link>
              </div>
            ) : (
              <Select 
                value={formData.companyId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, companyId: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {state.companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: company.color }}
                        />
                        <span>{company.name}</span>
                        <span className="text-muted-foreground text-sm">
                          (R$ {company.valuePerDelivery.toFixed(2)})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Selected Company Info */}
          {selectedCompany && (
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedCompany.color }}
                />
                <h4 className="font-semibold text-foreground">{selectedCompany.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Valor por entrega: R$ {selectedCompany.valuePerDelivery.toFixed(2)}
              </p>
            </div>
          )}

          {/* Number of Deliveries */}
          <div className="space-y-2">
            <Label htmlFor="deliveries">Número de Entregas</Label>
            <Input
              id="deliveries"
              type="number"
              min="1"
              placeholder="Ex: 15"
              value={formData.deliveries}
              onChange={(e) => setFormData(prev => ({ ...prev, deliveries: e.target.value }))}
              required
              className="text-lg text-center"
            />
          </div>

          {/* Total Value Preview */}
          {totalValue > 0 && (
            <div className="p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-lg border border-success/20">
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Total a receber:</p>
                <p className="text-3xl font-bold text-success">
                  R$ {totalValue.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formData.deliveries} × R$ {selectedCompany?.valuePerDelivery.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            variant="default" 
            size="lg" 
            className="w-full"
            disabled={state.companies.length === 0}
          >
            <Package className="mr-2 h-5 w-5" />
            Registrar Entregas
          </Button>
        </form>
      </Card>

      {/* Recent Deliveries */}
      {todayDeliveries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Entregas de Hoje</h3>
          <div className="space-y-2">
            {todayDeliveries.map((delivery) => (
              <Card key={delivery.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: state.companies.find(c => c.id === delivery.companyId)?.color 
                      }}
                    />
                    <div>
                      <p className="font-medium text-foreground">{delivery.companyName}</p>
                      <p className="text-sm text-muted-foreground">
                        {delivery.deliveries} entregas
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-success">
                    R$ {delivery.totalValue.toFixed(2)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
