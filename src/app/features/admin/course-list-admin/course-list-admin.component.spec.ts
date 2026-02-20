import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseListAdminComponent } from './course-list-admin.component';

describe('CourseListAdminComponent', () => {
  let component: CourseListAdminComponent;
  let fixture: ComponentFixture<CourseListAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CourseListAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
