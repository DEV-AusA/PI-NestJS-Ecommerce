export interface IUser {
    email: string;
    name: string;
    password: string;
    address: string;
    phone: number;
    created_at: string;
    country?: string;
    city?: string;
}