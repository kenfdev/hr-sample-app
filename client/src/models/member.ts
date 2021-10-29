export type Member = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  joinedAt: string;
  pr: string;
  department: { id: string; name: string };
  age?: number;
  salary?: number;
  editable?: boolean;
  isLoggedInUser?: boolean;
};
