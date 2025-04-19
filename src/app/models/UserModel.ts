export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  email: string;
  isUserAdmin: boolean;
}
