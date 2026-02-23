export interface StudentCourse {
  courseId: number;
  title: string;
  description: string;
  instructorName: string;
  price: number;
  createdAt: string;
}


export interface StudentDashBoardCourse {
  courseId: number;
  courseTitle: string;
  enrolledAt: string;
  totalModules: number;
  completedModules: number;
  progressPercentage: number;
}