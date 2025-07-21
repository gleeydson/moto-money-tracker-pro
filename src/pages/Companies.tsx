import { useState } from 'react';
import { Building2, Plus, Edit2, Trash2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAppContext } from '@/contexts/AppContext';
import { MetricCard } from '@/components/MetricCard';
import { toast } from '@/hooks/use-toast';

export default function Companies() {
  const { state, dispatch } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    valuePerDelivery: '',
    color: '#3B82F6'
  });

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.valuePerDelivery) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const valuePerDelivery = parseFloat(formData.valuePerDelivery);
    if (isNaN(valuePerDelivery) || valuePerDelivery <= 0) {
      toast({
        title: "Erro", 
        description: "Valor por entrega deve ser um número positivo",
        variant: "destructive"
      });
      return;
    }

    if (editingCompany) {
      const company = state.companies.find(c => c.id === editingCompany);
      if (company) {
        dispatch({
          type: 'UPDATE_COMPANY',
          payload: {
            ...company,
            name: formData.name,
            valuePerDelivery,
            color: formData.color
          }
        });
        toast({
          title: "Sucesso!",
          description: "Empresa atualizada com sucesso"
        });
      }
    } else {
      dispatch({
        type: 'ADD_COMPANY',
        payload: {
          name: formData.name,
          valuePerDelivery,
          color: formData.color
        }
      });
      toast({
        title: "Sucesso!",
        description: "Empresa adicionada com sucesso"
      });
    }

    setFormData({ name: '', valuePerDelivery: '', color: '#3B82F6' });
    setEditingCompany(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (company: any) => {
    setFormData({
      name: company.name,
      valuePerDelivery: company.valuePerDelivery.toString(),
      color: company.color
    });
    setEditingCompany(company.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (companyId: string) => {
    dispatch({
      type: 'DELETE_COMPANY',
      payload: companyId
    });
    toast({
      title: "Empresa removida",
      description: "Empresa e seus registros foram removidos"
    });
  };

  const resetForm = () => {
    setFormData({ name: '', valuePerDelivery: '', color: '#3B82F6' });
    setEditingCompany(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Empresas Parceiras</h2>
        <p className="text-muted-foreground">Gerencie suas empresas e valores por entrega</p>
      </div>

      {/* Summary */}
      <MetricCard
        title="Total de Empresas"
        value={state.companies.length.toString()}
        subtitle="empresas cadastradas"
        icon={Building2}
        variant="primary"
      />

      {/* Add Company Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="lg" className="w-full" onClick={resetForm}>
            <Plus className="mr-2 h-5 w-5" />
            Adicionar Empresa
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCompany ? 'Editar Empresa' : 'Nova Empresa'}
            </DialogTitle>
            <DialogDescription>
              {editingCompany 
                ? 'Atualize as informações da empresa'
                : 'Adicione uma nova empresa parceira'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa</Label>
              <Input
                id="name"
                placeholder="Ex: iFood, Uber Eats..."
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="value">Valor por Entrega (R$)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0"
                placeholder="8.50"
                value={formData.valuePerDelivery}
                onChange={(e) => setFormData(prev => ({ ...prev, valuePerDelivery: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Cor de Identificação</Label>
              <div className="flex gap-2 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      formData.color === color 
                        ? 'border-foreground scale-110' 
                        : 'border-border hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="default" className="flex-1">
                {editingCompany ? 'Atualizar' : 'Adicionar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Companies List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Suas Empresas</h3>
        
        {state.companies.length === 0 ? (
          <Card className="p-6 text-center space-y-4">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Nenhuma empresa cadastrada</h3>
              <p className="text-muted-foreground text-sm">
                Adicione suas empresas parceiras para começar a controlar seus ganhos
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {state.companies.map((company) => (
              <Card key={company.id} className="p-4 hover:shadow-elevated transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: company.color }}
                    />
                    <div>
                      <h4 className="font-semibold text-foreground">{company.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        R$ {company.valuePerDelivery.toFixed(2)} por entrega
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-2">
                      <p className="text-sm font-medium text-foreground">
                        {company.totalDeliveries}
                      </p>
                      <p className="text-xs text-muted-foreground">entregas</p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(company)}
                      className="h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(company.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {company.totalDeliveries > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total ganho:</span>
                      <span className="font-medium text-success">
                        R$ {(company.totalDeliveries * company.valuePerDelivery).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}