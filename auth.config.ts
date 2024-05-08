import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import { LoginSchema} from "@/schema"
import { getUserByEmail } from "./data/user";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
export default {
  providers: [
    Google({
      clientId:process.env.GOOGLE_CLIENT_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId:process.env.GITHUB_CLIENT_ID,
      clientSecret:process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials){
        const validate = LoginSchema.safeParse(credentials);
        if(validate.success){
          const {email,password}=validate.data;
          const user = await getUserByEmail(email);
          if(!user || !user.password) return null;
          const passwordMatch = await bcrypt.compare(
            password,
            user.password,
          );
          if(passwordMatch) return user;
        }
        return null; 
      }
    })
  ],
} satisfies NextAuthConfig