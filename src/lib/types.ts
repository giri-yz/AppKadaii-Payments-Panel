export interface Payment {
  id: string;
  projectId: string;
  type: 'income' | 'expense';
  amount: number;
  name: string; // Payer or Payee
  date: string; // ISO 8601 format
  method: string; // e.g., 'Bank Transfer', 'Cash'
  status: 'Pending' | 'Completed';
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  totalAmount?: number; // The goal amount
  payments: Payment[];
}
