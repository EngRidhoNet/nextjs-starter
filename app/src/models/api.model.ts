/**
 * API Model
 * Matches NestJS StandardApiResponse wrapper from the backend
 */

/** Standard response wrapper from NestJS ApiResponseInterceptor */
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
}


