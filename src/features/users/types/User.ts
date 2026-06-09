export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  lastLogin: string;
};

export type UserRole = 'Admin' | 'Manager' | 'User';

export type UserStatus = 'Active' | 'Inactive';

export type AiSummary = {
  overview: string;
  stats: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    adminUsers: number;
    managerUsers: number;
    standardUsers: number;
  };
  riskLevel: 'Low' | 'Medium' | 'High';
  risks: string[];
  recommendations: string[];
};
