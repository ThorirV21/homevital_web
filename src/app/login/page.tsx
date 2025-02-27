"use client";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { login, mockLogin } from "@/services/api";

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

const formSchema = z.object({
  kennitala: z.string().length(10, "Sláðu inn gilda kennitölu"),
});

const Login = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kennitala: "",
    },
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const mockRet = await mockLogin(values);
    const ret = await login({ kennitala: mockRet.kennitala });
    console.log(ret);

    if (ret) {
      window.location.href = "/dashboard/clients";
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/homeVital.svg"
          alt="Logo"
          priority
          width={400}
          height={400}
          className="pb-40"
        />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white p-10 rounded-xl"
          >
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
            <Button
              type="submit"
              className="bg-foreground font-bold py-2 px-20 rounded-lg"
            >
              Innskrá
            </Button>
          </form>
        </Form>

        {/* <button className="bg-[#3A7283] text-white font-bold py-2 px-20 rounded">
          <a href="/dashboard/clients">Innskráning</a>
        </button> */}
      </div>
    </div>
  );
};

export default Login;
export { formSchema };
