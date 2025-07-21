import { useState } from 'react';
import { Fuel, Plus, Gauge, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAppContext } from '@/contexts/AppContext';
import { MetricCard } from '@/components/MetricCard';
import { toast } from '@/hooks/use-toast';

export default function FuelPage() {
  const { state, dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    value: '',
    currentKm: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const value = parseFloat(formData.value);
    const currentKm = parseFloat(formData.currentKm);
    
    if (isNaN(value) || value <= 0) {
      toast({
        title: "Erro",
        description: "Valor deve ser um número positivo",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(currentKm) || currentKm <= 0) {
      toast({
        title: "Erro", 
        description: "KM atual deve ser um número positivo",
        variant: "destructive"
      });
      return;
    }

    dispatch({
      type: 'ADD_FUEL_RECORD',
      payload: {
        value,
        currentKm,
        date: formData.date
      }
    });

    toast({
      title: "Sucesso! ⛽",
      description: "Abastecimento registrado"
    });

    setFormData({ value: '', currentKm: '', date: formData.date });
  };

  const avgKmPerLiter = state.fuelRecords
    .filter(r => r.kmPerLiter)
    .reduce((sum, r) => sum + (r.kmPerLiter || 0), 0) / 
    Math.max(1, state.fuelRecords.filter(r => r.kmPerLiter).length);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Controle de Combustível</h2>
        <p className="text-muted-foreground">Monitore seus gastos e eficiência</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Gasto Total"
          value={`R$ ${state.totalFuelCost.toFixed(2)}`}
          icon={DollarSign}
          variant="warning"
        />
        <MetricCard
          title="Eficiência"
          value={`${avgKmPerLiter.toFixed(1)} km/L`}
          icon={Gauge}
          variant="primary"
        />
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="space-y-2">
            <Label htmlFor="value">Valor Abastecido (R$)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              min="0"
              placeholder="50.00"
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentKm">KM Atual da Moto</Label>
            <Input
              id="currentKm"
              type="number"
              min="0"
              placeholder="15000"
              value={formData.currentKm}
              onChange={(e) => setFormData(prev => ({ ...prev, currentKm: e.target.value }))}
              required
            />
          </div>

          <Button type="submit" variant="warning" size="lg" className="w-full">
            <Plus className="mr-2 h-5 w-5" />
            Registrar Abastecimento
          </Button>
        </form>
      </Card>
    </div>
  );
}