export interface Company {
  id: number;
  userId: number;
  email?: string;
  status?: string;
  createAt?: string;
  companyName: string;
  activityField: string;
  coverImage: string | null;
  avatar: string | null;
  taxIdentification: number;
  address: string;
  description: string | null;
}
