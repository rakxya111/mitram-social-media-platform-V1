import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignupValidation } from "@/lib/validation";
import { Loader } from "lucide-react";

const SigninForm = () => {
  const isLoading = false;

  // 1. Define your form.

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof SignupValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/Ram.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Sign In</h2>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-col gap-5 w-full"
        >
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
          <Button type="submit" className="shad-button_primary mt-5">
            {isLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading.....
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
          <p className="text-small-regular text-center mt-2">
            Don’t have an account
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1 underline underline-offset-1"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
