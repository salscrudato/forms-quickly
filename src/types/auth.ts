import type { User } from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthError {
  code: string;
  message: string;
}
