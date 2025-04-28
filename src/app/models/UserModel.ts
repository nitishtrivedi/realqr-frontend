import { Enquiry } from './EnquiryModel';

export interface User {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  email: string;
  isUserAdmin: boolean;
  enquiries: Enquiry[];
}
