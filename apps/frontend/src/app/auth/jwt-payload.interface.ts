export interface JwtPayload {
    userId: string;
    username: string;
    iat?: number; // Issued at
    exp?: number; // Expiration time
    sub?: number; // Subject
  }