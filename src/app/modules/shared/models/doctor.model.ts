import { UserType } from "../enum/users.enum";

export interface Doctor {
    id?: string,
    type?:UserType,
    name: string,
    email: string,
    password?: string,
    phone: string,
    specification: string,
    gender: string,
    clinic_id: string
}