export interface ApiState<
  RequestData extends Record<string, any> = any,
  ResponseData extends Record<string, any> = any
> {
  success: boolean;
  message: string;
  data?: ResponseData | null;
  errors: Partial<Record<keyof RequestData, any>>;
}
