export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export enum Role {
  admin = 'admin',
  brand = 'brand',
  user = 'user',
}

export enum Status {
  active = 'active',
  inactive = 'inactive',
}

export enum LiveStatus {
  confirmed = 'confirmed',
  upcoming = 'upcoming',
  live = 'live',
  cancelled = 'cancelled',
  invalid = 'invalid',
}

export enum CustomerStatus {
  ORDER = 'ORDER',
  CALLBACK = 'CALLBACK',
  CONSULT = 'CONSULT',
  NOT_INTERESTED = 'NOT_INTERESTED',
}
