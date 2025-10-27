// types/auth.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface SignUpResponse {
  message: string;
  user?: User;
}

export interface SignInResponse {
  token: string;
  user: User;
  message?: string;
}

export interface VerifyOTPResponse {
  message: string;
}