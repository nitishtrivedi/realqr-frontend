import { Enquiry } from './EnquiryModel';

export interface EnquiryQuestionnaire {
  id: number;
  enquiryId: number;
  enquiry?: Enquiry;
  enquiryStatus: string;
  agentName: string;
  hasConfirmedBudget: boolean;
  refinedBudgetRange: string;
  reconfirmModeOfPayment: string;
  loanProcessingConsent: boolean;
  loanProcessingVendor: string;
  followUpActions: string;
  comments: string;
}
