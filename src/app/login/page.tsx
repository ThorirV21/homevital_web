"use client";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { loginSchema } from "@/services/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLoginMutation } from "@/hooks/useLogin";
import LoginLoader from "@/components/loginLoader";

const Login = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      kennitala: "",
    },
  });

  const { loginMutation, isPending } = useLoginMutation();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    loginMutation(values);
  };

  return (
    <div className="flex h-screen justify-center">
      <div className="flex flex-col items-center justify-evenly">
        <Image
          src="/homeVital.svg"
          alt="Logo"
          priority
          width={400}
          height={400}
          // className="pb-40"
        />
        <div className="flex flex-col items-center justify-center bg-background p-10 rounded-xl">
          {isPending ? (
            <LoginLoader />
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="kennitala"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kennitala</FormLabel>
                      <FormControl>
                        <Input placeholder="999999-9999" {...field} />
                      </FormControl>
                      <FormDescription>Sláðu inn kennitölu</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center pt-10">
                  <Button
                    type="submit"
                    className="bg-foreground font-bold py-2 px-20 rounded-lg"
                  >
                    Innskrá
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
