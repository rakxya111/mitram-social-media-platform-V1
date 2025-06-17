import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignupValidation } from "@/lib/validation";
import { Loader } from "lucide-react";
import * as z from "zod";
import axiosInstance from "@/lib/axios/axiosInstance";



const SignupForm = () => {

  const navigate = useNavigate();
  const isLoading = false;

  // 1. Define your form.

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      username: "",
      email:'',
      password: '',
      password_confirm: '',
    },
  });

  
  const onSubmit = async (values: z.infer<typeof SignupValidation>) => {
   try{
    const res = await axiosInstance.post("register/",values);
    console.log("Registered:", res.data);
    navigate("/sign-in");
   }catch (err: any) {
  if (err.response && err.response.data) {
    console.log("Signup error:", err.response.data);
  } else {
    console.log("Signup error:", err.message);
  }
}

  };

  return (

      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
            <img src="/assets/images/Ram.svg" alt="logo" height={200}/>

            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new Account</h2>
            <p className="text-light-3 small-medium md:base-regular ">To use Mitram, please do enter your details </p>
      
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-col gap-5 w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>    
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>    
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

         
          <Button type="submit" className="shad-button_primary mt-5">
            {isLoading ? (
              <div className="flex-center gap-2">
               <Loader/> Loading......
              </div>
            ): "Sign up"}
          </Button>
          <p className="text-small-regular text-center mt-2">
            Already have an account <Link to='/sign-in' className="text-primary-500 text-small-semibold ml-1 underline underline-offset-2">Log in</Link>
          </p>
        </form>
          </div>
      </Form>
 
  );
};

export default SignupForm;
