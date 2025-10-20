export interface ApiState<D extends Record<string, any> = any> {
  success: boolean;
  message: string;
  errors: Partial<Record<keyof D, any>>;
}