import * as z from "zod";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SigninValidation } from "@/lib/validation";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { loginWithCredentials } = useUserContext();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SigninValidation>) => {
    setIsLoading(true);
    try {
      await loginWithCredentials(values.email, values.password);
      toast({ title: "Login successful!" });
      // No need to navigate manually, AuthContext handles it
    } catch (err: any) {
      console.error("Login failed:", err?.response?.data || err.message);
      toast({ title: "Login failed", description: err?.response?.data?.detail || "Invalid credentials" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/Ram.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details.
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Email</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
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
                <FormLabel className="shad-form_label">Password</FormLabel>
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
                <Loader className="animate-spin" /> Loading...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
          <p className="text-small-regular text-center mt-2">
            Don’t have an account?
            <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1 underline underline-offset-1">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
