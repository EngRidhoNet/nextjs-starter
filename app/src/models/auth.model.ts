/**
 * Authentication Model
 * Matches the Winsta AI backend API (NestJS)
 * Base path: /api/v1/auth
 */

// --- Request DTOs (match backend) ---

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  workspaceName?: string;
  companyName?: string;
  avatarUrl?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// --- Response types (wrapped in StandardApiResponse) ---

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  emailConfirmationRequired: boolean;
}

export interface AuthUser {
  id: string;
  email?: string;
  fullName: string;
  avatarUrl: string | null;
  isActive: boolean;
}

export interface AuthWorkspace {
  id: string;
  name: string;
  companyName: string | null;
  membershipId: string;
  role: string;
}

export interface AuthResponse {
  user: AuthUser;
  workspace: AuthWorkspace;
  tokens: AuthTokens;
}

export interface MeResponse {
  user: AuthUser;
  workspaces: AuthWorkspace[];
}

export interface RefreshResponse {
  tokens: AuthTokens;
  user: AuthUser;
}

export interface LogoutResponse {
  loggedOut: true;
}


export interface VerifyRequest {
  user_id: string;
  channel: 'email' | 'sms' | 'whatsapp';
  otp: string;
}

export interface OtpRequest {
  user_id: string;
  channel: 'email' | 'sms' | 'whatsapp';
}

export interface OtpResponse {
  message: string;
  user_id: string;
  channel: string;
  expires_in?: number;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

