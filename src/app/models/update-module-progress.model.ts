import { EnrollmentStatus } from "../shared/directives/enrollment-status.enum";

export interface UpdateModuleProgressRequest {
  status: EnrollmentStatus;
}