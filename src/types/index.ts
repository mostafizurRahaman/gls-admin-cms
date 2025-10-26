export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  profileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
export * from "./category";
export * from "./service";
export * from "./testimonial";
