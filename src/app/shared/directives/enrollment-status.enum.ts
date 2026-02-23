export enum EnrollmentStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface StudentModule {
  moduleId: number;
  name: string;
  materialUrl: string;
  status: EnrollmentStatus;
}