import { UserType } from "../enum/users.enum";

export interface User {
    id?:string,
    type: UserType,
    name: string,
    email: string,
    password?: string
}