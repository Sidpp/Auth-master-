"use client";

import { CardWrapper } from "./Card-wrapper";
import { z } from "zod";
import {  RegisterSchema } from "@/schema";
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
import { Register } from "@/actions/register";
import { useState, useTransition } from "react";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

export const RegisterForm = () => {
  const [error,setError]= useState<string|undefined>("");
  const[success,setSuccess]=useState<string|undefined>("");
  const [isPending,startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name:"",
    },
  });

  const onSubmit = (values:z.infer<typeof RegisterSchema>)=>{
      setError("");
      setSuccess("");
     
    startTransition(()=>{
      Register(values).then((data)=>{

      setError(data.error);

      setSuccess(data.success);
    });
  });
  }

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account? "
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
          <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder=" jhon doe"
                     
                    />
                  </FormControl>
                
                  <FormMessage />
                </FormItem>
                
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
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
       <FormError message =  {error}/>
        <FormSuccess message = {success}/>
        
         <Button
         disabled={isPending}
            type="submit"
              variant="custom"
              className=" w-full  "
            >
              Submit
            </Button>
         
        </form>
      </Form>
    </CardWrapper>
  );
};
