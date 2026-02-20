import { Pipe, PipeTransform } from '@angular/core';
import { Course, CourseService } from 'src/app/services/course.service';

@Pipe({
  name: 'courseTitle',
  standalone: true
})
export class CourseTitlePipe implements PipeTransform {

  constructor(private courseService: CourseService) {}

  transform(courseId: number): string {
    const course: Course | undefined = this.courseService.getCourseById(courseId);
    return course ? course.title : 'Unknown Course';
  }

}
