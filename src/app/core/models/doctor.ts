import { SafeResourceUrl } from "@angular/platform-browser";

export interface Doctor {
    id?: string,
    name: string,
    email: string,
    phone: number,
    specification: string,
    clinicId: string
}