import NextAuth,{type DefaultSession} from "next-auth"
import {UserRole} from "@prisma/client";

 type ExtendedUser = DefaultSession["user"] & {
    role: UserRole
};

declare module "next-auth"{
interface Session{
    id:string;
    user:ExtendedUser;
}
}