import { EnquiryQuestionnaire } from './EnquiryQuestionnaireModel';
import { User } from './UserModel';

export interface Enquiry {
  id: number;

  // Essential Information
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  methodOfContact: string; // Phone or Email

  // Property Information
  budgetRange: string;
  preferredAreas: string;
  propertyType: string;
  modeOfPayment: string; // Loan, self-funding, etc.
  purchaseTimeFrame: string;
  purchaseType: string; // Flat, bungalow, etc.
  otherQuestions: string;
  consentToCall: boolean;
  userId: number;
  user: User;
  enquiryQuestionnaire: EnquiryQuestionnaire;
}
