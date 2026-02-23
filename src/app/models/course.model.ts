export interface CreateCourseRequest {
  name: string;
  desc: string;
  address: string;
  email?: string;
  items: { itemId: number; quantity: number }[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  published: boolean;
  capacity: number;
  instructorName: string;
  createdAt: string; // or Date if you convert it
}

