import {Appointment} from "../appointment";

export interface AppointmentResponse {
    items: Appointment[];
    pageIndex: number;
    totalPages: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}
