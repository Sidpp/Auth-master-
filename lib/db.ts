import {PrismaClient} from "@prisma/client"
declare global {
    var prisma:PrismaClient | undefined;
}
//but in development mode we do this due to nextjs hot reload
export const db = globalThis.prisma || new PrismaClient();
if(process.env.NODE_ENV!=="production")globalThis.prisma = db;
//in production mode he need only this 
//export const db =new PrismaClient(); 