import { ReactNode } from 'react';
import { Home, Building2, Plus, BarChart3, Fuel } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navItems = [
    { to: '/', icon: Home, label: 'Início' },
    { to: '/companies', icon: Building2, label: 'Empresas' },
    { to: '/add-delivery', icon: Plus, label: 'Registro' },
    { to: '/fuel', icon: Fuel, label: 'Combustível' },
    { to: '/reports', icon: BarChart3, label: 'Relatórios' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground px-4 py-4 shadow-elevated">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold text-center">MotoControl</h1>
          <p className="text-sm text-center opacity-90">Controle Financeiro para Motoboys</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-card border-t border-border">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around py-2">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )
                }
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}