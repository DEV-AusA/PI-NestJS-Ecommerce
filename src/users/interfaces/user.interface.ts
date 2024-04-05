export interface IUser {
    id:number;
    email: string;
    name: string;
    password: string;
    address: string;
    phone: number;
    createdAt: string;
    country?: string;
    city?: string;
}