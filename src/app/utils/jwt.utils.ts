// Interface representing the payload of a JWT token
export interface JwtPayload {
  exp?: number; // Expiration time (in seconds since the Unix epoch)
  iat?: number; // Issued at time (in seconds since the Unix epoch)
  [key: string]: unknown; // Additional claims in the JWT payload
}

// Utility functions for decoding and handling JWT tokens
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

// Utility function to check if a JWT token is expired
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

// Utility function to get the expiration time of a JWT token as a Date object
export function getTokenExpirationTime(token: string): Date | null {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) {
    return null;
  }

  return new Date(payload.exp * 1000);
}