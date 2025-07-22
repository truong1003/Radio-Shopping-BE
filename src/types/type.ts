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
