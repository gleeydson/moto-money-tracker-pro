import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface Company {
  id: string;
  name: string;
  valuePerDelivery: number;
  totalDeliveries: number;
  color: string;
}

export interface Delivery {
  id: string;
  companyId: string;
  companyName: string;
  deliveries: number;
  valuePerDelivery: number;
  totalValue: number;
  date: string;
}

export interface FuelRecord {
  id: string;
  value: number;
  currentKm: number;
  date: string;
  kmPerLiter?: number;
  costPerKm?: number;
}

export interface AppState {
  companies: Company[];
  deliveries: Delivery[];
  fuelRecords: FuelRecord[];
  totalEarnings: number;
  totalFuelCost: number;
  netProfit: number;
}

// Initial state
const initialState: AppState = {
  companies: [
    {
      id: '1',
      name: 'iFood',
      valuePerDelivery: 8.50,
      totalDeliveries: 0,
      color: '#EA1D2C'
    },
    {
      id: '2', 
      name: 'Uber Eats',
      valuePerDelivery: 9.00,
      totalDeliveries: 0,
      color: '#00A86B'
    },
    {
      id: '3',
      name: 'Rappi',
      valuePerDelivery: 7.80,
      totalDeliveries: 0,
      color: '#FF6600'
    }
  ],
  deliveries: [],
  fuelRecords: [],
  totalEarnings: 0,
  totalFuelCost: 0,
  netProfit: 0
};

// Action types
type AppAction =
  | { type: 'ADD_COMPANY'; payload: Omit<Company, 'id' | 'totalDeliveries'> }
  | { type: 'UPDATE_COMPANY'; payload: Company }
  | { type: 'DELETE_COMPANY'; payload: string }
  | { type: 'ADD_DELIVERY'; payload: Omit<Delivery, 'id'> }
  | { type: 'DELETE_DELIVERY'; payload: string }
  | { type: 'ADD_FUEL_RECORD'; payload: Omit<FuelRecord, 'id'> }
  | { type: 'DELETE_FUEL_RECORD'; payload: string }
  | { type: 'UPDATE_TOTALS' };

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_COMPANY': {
      const newCompany: Company = {
        ...action.payload,
        id: Date.now().toString(),
        totalDeliveries: 0
      };
      return {
        ...state,
        companies: [...state.companies, newCompany]
      };
    }
    
    case 'UPDATE_COMPANY': {
      return {
        ...state,
        companies: state.companies.map(company =>
          company.id === action.payload.id ? action.payload : company
        )
      };
    }
    
    case 'DELETE_COMPANY': {
      return {
        ...state,
        companies: state.companies.filter(company => company.id !== action.payload),
        deliveries: state.deliveries.filter(delivery => delivery.companyId !== action.payload)
      };
    }
    
    case 'ADD_DELIVERY': {
      const newDelivery: Delivery = {
        ...action.payload,
        id: Date.now().toString()
      };
      
      // Update company total deliveries
      const updatedCompanies = state.companies.map(company =>
        company.id === action.payload.companyId
          ? { ...company, totalDeliveries: company.totalDeliveries + action.payload.deliveries }
          : company
      );
      
      const updatedState = {
        ...state,
        companies: updatedCompanies,
        deliveries: [...state.deliveries, newDelivery]
      };
      
      return calculateTotals(updatedState);
    }
    
    case 'DELETE_DELIVERY': {
      const deliveryToDelete = state.deliveries.find(d => d.id === action.payload);
      if (!deliveryToDelete) return state;
      
      // Update company total deliveries
      const updatedCompanies = state.companies.map(company =>
        company.id === deliveryToDelete.companyId
          ? { ...company, totalDeliveries: Math.max(0, company.totalDeliveries - deliveryToDelete.deliveries) }
          : company
      );
      
      const updatedState = {
        ...state,
        companies: updatedCompanies,
        deliveries: state.deliveries.filter(delivery => delivery.id !== action.payload)
      };
      
      return calculateTotals(updatedState);
    }
    
    case 'ADD_FUEL_RECORD': {
      const newRecord: FuelRecord = {
        ...action.payload,
        id: Date.now().toString()
      };
      
      // Calculate efficiency if we have a previous record
      const previousRecord = state.fuelRecords
        .filter(record => record.currentKm < newRecord.currentKm)
        .sort((a, b) => b.currentKm - a.currentKm)[0];
      
      if (previousRecord) {
        const kmTraveled = newRecord.currentKm - previousRecord.currentKm;
        const fuelUsed = newRecord.value / 5.5; // Assuming R$ 5.5 per liter
        newRecord.kmPerLiter = kmTraveled / fuelUsed;
        newRecord.costPerKm = newRecord.value / kmTraveled;
      }
      
      const updatedState = {
        ...state,
        fuelRecords: [...state.fuelRecords, newRecord]
      };
      
      return calculateTotals(updatedState);
    }
    
    case 'DELETE_FUEL_RECORD': {
      const updatedState = {
        ...state,
        fuelRecords: state.fuelRecords.filter(record => record.id !== action.payload)
      };
      
      return calculateTotals(updatedState);
    }
    
    case 'UPDATE_TOTALS': {
      return calculateTotals(state);
    }
    
    default:
      return state;
  }
}

// Calculate totals helper
function calculateTotals(state: AppState): AppState {
  const totalEarnings = state.deliveries.reduce((sum, delivery) => sum + delivery.totalValue, 0);
  const totalFuelCost = state.fuelRecords.reduce((sum, record) => sum + record.value, 0);
  const netProfit = totalEarnings - totalFuelCost;
  
  return {
    ...state,
    totalEarnings,
    totalFuelCost,
    netProfit
  };
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}