export interface Course {
  courseId: number;
  title: string;
  description: string;
  instructorName: string;
  capacity: number;
  enrolledCount: number;
  createdAt: string;
}

export interface PageResponse<T> {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: T[];
}