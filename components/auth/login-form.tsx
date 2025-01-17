"use client";

import { CardWrapper } from "./Card-wrapper";
import { z } from "zod";
import { LoginSchema } from "@/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
 
} from "@/components/ui/form"; 
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import {useSearchParams} from "next/navigation";
export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error")==="OAuthAccountNotLinked"
  ?"Email already in use "
  :"";
  const [error,setError]= useState<string|undefined>("");
  const[success,setSuccess]=useState<string|undefined>("");
  const [isPending,startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values:z.infer<typeof LoginSchema>)=>{
      setError("");
      setSuccess("");
     
    startTransition(()=>{
      login(values).then((data)=>{

      setError(data?.error);
  
       setSuccess(data?.success); 
    });
  });
  }

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled = {isPending}
                      placeholder="Enter your email id "
                      type="email"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder=" Enter password "
                      type="password"
                    />
                  </FormControl>
                
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> 
       <FormError message =  {error || urlError}/>
        <FormSuccess message = {success}/>
        
         <Button
         disabled={isPending}
            type="submit"
              variant="custom"
              className=" w-full  "
            >
              Login
            </Button>
         
        </form>
      </Form>
    </CardWrapper>
  );
};
