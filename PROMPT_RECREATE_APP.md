# Prompt para Recriar App MotoControl - Controle Financeiro para Motoboys

## Descrição Geral
Crie um aplicativo web completo de controle financeiro para motoboys de delivery, otimizado para mobile, usando React + TypeScript + Tailwind CSS + Vite. O app deve ter interface limpa, moderna e intuitiva para facilitar o uso durante o trabalho.

## Stack Tecnológica Obrigatória
- React 18 + TypeScript
- Vite como bundler
- Tailwind CSS para styling
- React Router DOM para navegação
- Context API para gerenciamento de estado
- Lucide React para ícones
- Shadcn/ui como base dos componentes

## Estrutura de Páginas
1. **Dashboard (/)** - Página inicial com resumo
2. **Empresas (/companies)** - Gestão de empresas parceiras
3. **Registro (/add-delivery)** - Cadastro rápido de entregas
4. **Combustível (/fuel)** - Controle de abastecimentos
5. **Relatórios (/reports)** - Análises financeiras

## Design System Específico

### Cores (HSL obrigatório)
```css
/* Primary - Azul energético */
--primary: 214 84% 56%;
--primary-foreground: 0 0% 98%;
--primary-light: 214 84% 70%;

/* Success - Verde lucro */
--success: 142 76% 36%;
--success-foreground: 0 0% 98%;

/* Warning - Laranja ação */
--warning: 25 95% 53%;
--warning-foreground: 0 0% 98%;

/* Gradientes */
--gradient-primary: linear-gradient(135deg, hsl(214 84% 56%), hsl(214 84% 70%));
--gradient-hero: linear-gradient(135deg, hsl(214 84% 56%), hsl(142 76% 36%));
--gradient-success: linear-gradient(135deg, hsl(142 76% 36%), hsl(142 76% 50%));
```

### Layout
- Design mobile-first responsivo
- Header fixo com gradiente hero
- Navegação bottom com 5 itens
- Máxima largura de 400px centralizada
- Espaçamento consistente (padding 4-6)

## Funcionalidades Detalhadas

### 1. Context de Estado Global
```typescript
interface Company {
  id: string;
  name: string;
  valuePerDelivery: number;
  totalDeliveries: number;
  color: string;
}

interface Delivery {
  id: string;
  companyId: string;
  companyName: string;
  deliveries: number;
  valuePerDelivery: number;
  totalValue: number;
  date: string;
}

interface FuelRecord {
  id: string;
  value: number;
  currentKm: number;
  date: string;
  kmPerLiter?: number;
  costPerKm?: number;
}
```

### 2. Dashboard
- **Métricas em cards visuais:**
  - Ganhos do dia (com gradiente success)
  - Entregas do dia
  - Lucro líquido (ganhos - combustível)
  - Eficiência km/l média
- **Ações rápidas:** botões para "Registrar Entrega" e "Abastecer"
- **Lista de entregas recentes** com empresa, valor e horário

### 3. Gestão de Empresas
- **Empresas pré-cadastradas:** iFood (vermelho), Uber Eats (verde), Rappi (laranja)
- **Formulário para nova empresa:** nome, valor por entrega, cor personalizável
- **Lista de empresas** com estatísticas (total de entregas, valor médio)
- **Edição/exclusão** de empresas existentes

### 4. Registro de Entregas
- **Seleção visual de empresa** (cards coloridos)
- **Input número de entregas** com incremento/decremento
- **Exibição valor total** calculado automaticamente
- **Botão confirmar** com feedback visual
- **Histórico do dia** com possibilidade de exclusão

### 5. Controle de Combustível
- **Formulário abastecimento:** valor gasto, km atual
- **Cálculos automáticos:**
  - km/litro (baseado no abastecimento anterior)
  - Custo por km rodado
  - Eficiência da moto
- **Histórico de abastecimentos** com métricas
- **Estatísticas:** gasto total mensal, média km/l

### 6. Relatórios
- **Cards com métricas principais:**
  - Total ganhos por empresa
  - Gasto total combustível
  - Lucro líquido estimado
  - Entregas por dia da semana
- **Resumo mensal** com comparativo
- **Lista detalhada** por empresa com percentuais

## Componentes Específicos

### MetricCard
```typescript
interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  variant?: 'default' | 'success' | 'warning';
  icon?: LucideIcon;
}
```

### Layout
- Header com título "MotoControl" e subtítulo
- Navegação bottom com ícones: Home, Building2, Plus, Fuel, BarChart3
- Container centralizado max-width-md

### Formulários
- Inputs com labels claros
- Botões com estados de loading
- Validação em tempo real
- Toast notifications para feedback

## Funcionalidades de Cálculo

### Entregas
- Total por empresa = número de entregas × valor por entrega
- Ganhos do dia = soma de todas as entregas do dia
- Estatísticas por empresa (total, média, percentual)

### Combustível
- km/litro = (km atual - km anterior) / (valor ÷ preço por litro estimado R$ 5,50)
- Custo por km = valor do abastecimento / km rodados
- Eficiência média baseada nos últimos abastecimentos

### Relatórios
- Lucro líquido = ganhos totais - gastos combustível
- Análise mensal com comparativos
- Breakdown por empresa e dia da semana

## Persistência
- Usar localStorage para salvar dados
- Carregar estado inicial do localStorage
- Salvar automaticamente todas as alterações

## UX/UI Específica
- **Mobile-first:** interface otimizada para uso com uma mão
- **Cores vibrantes:** cada empresa com cor distintiva
- **Feedback visual:** loading states, toast notifications
- **Navegação rápida:** bottom navigation sempre visível
- **Ações rápidas:** botões de acesso direto no dashboard

## Requisitos de Implementação
1. Estado global com Context + useReducer
2. Roteamento com React Router DOM
3. Componentes funcionais com hooks
4. TypeScript strict habilitado
5. Tailwind com design system customizado
6. Responsividade mobile-first
7. Persistência em localStorage
8. Validação de formulários
9. Toast notifications para feedback
10. Layout com header fixo e bottom navigation

Implemente cada página com seus respectivos formulários, listas e funcionalidades. O app deve ser totalmente funcional para um motoboy controlar seus ganhos diários, empresas parceiras, gastos com combustível e gerar relatórios de lucro.