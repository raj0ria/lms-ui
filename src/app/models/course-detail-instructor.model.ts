import { Enrollment, Module } from "../services/course.service";

export interface InstructorInfo {
  id: number;
  name: string;
  email: string;
}

export interface CourseDetail {
  id: number;
  title: string;
  description: string;
  capacity: number;
  published: boolean;
  instructor: InstructorInfo;
  modules: Module[];
  enrollments: Enrollment[];
  createdAt: string;
  updatedAt: string;
}