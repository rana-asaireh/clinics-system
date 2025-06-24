import { ApprovalStatus } from "../enum/approval-status.enum";
import { AppointmentDetails } from "./appointmnt-details.model";

export interface Appointment {
    id?: string,
    date: Date,
    doctor_id: string,
    patient_id: string,
    approval_status: ApprovalStatus,
    appointment_details?: AppointmentDetails,
}
