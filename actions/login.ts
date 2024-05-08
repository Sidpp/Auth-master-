"use server";
import {AuthError} from "next-auth";
import { z } from "zod";
import {LoginSchema} from "@/schema";
import { signIn} from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/rotues";

import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail} from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values:z.infer<typeof LoginSchema>)=>{
    
   const validate = LoginSchema.safeParse(values);

   if(!validate.success){ 
    return { error:"Invalid fields"};
   }

const {email,password} = validate.data;
const existingUser = await getUserByEmail(email);

if(!existingUser || existingUser.email || !existingUser.password){
  return {error:"Email does not exist!"}
}

if(!existingUser.emailVerified){

  const verificationToken = await generateVerificationToken(
     existingUser.email,
  );
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
  )
  return {success: "Confirmation email sent!"}
}
 try {
    await signIn("credentials",{
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  }catch(error){
  if(error instanceof AuthError){
   switch (error.type){
   case "CredentialsSignin":
   return {error: "Invalid credentails!"}
   default:
   return {error:"Something went wrong"}
   }
  }
  throw error;
  } 
};