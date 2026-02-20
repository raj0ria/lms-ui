export interface CreateCourseRequest {
  name: string;
  desc: string;
  address: string;
  email?: string;
  items: { itemId: number; quantity: number }[];
}