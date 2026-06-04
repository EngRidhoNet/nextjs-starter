/**
 * Application Configuration
 * Reads from environment variables with sensible defaults.
 */

export const config = {
  /** Backend API base URL (NestJS server) */
  apiBaseUrl: process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3000',
  /** API prefix (matches backend global prefix) */
  apiPrefix: process.env['NEXT_PUBLIC_API_PREFIX'] ?? '/api/v1',
} as const;

/** Full API base URL with prefix */
export function getApiBaseUrl(): string {
  return `${config.apiBaseUrl}${config.apiPrefix}`;
}
