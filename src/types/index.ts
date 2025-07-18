export type { AuthContextType, LoginFormData, AuthError } from './auth';
export type {
  FormMetadata,
  FormCategory,
  LineOfBusiness,
  FormSearchFilters,
  FormUpload,
  FormStats
} from './forms';

export interface BaseComponentProps {
  children?: React.ReactNode;
  className?: string;
}
