import { useMutation } from "@tanstack/react-query";
import { login, mockLogin } from "@/services/api";
import { loginSchema } from "@/services/schemas";
import { z } from "zod";
import { useRouter } from "next/navigation";

const useLoginMutation = () => {
  const router = useRouter();

  const { mutate: loginMutation, isPending: isPending } = useMutation({
    mutationFn: async (form: z.infer<typeof loginSchema>) => {
      const mockLoginResult = await mockLogin(form);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Mock login result: ", mockLoginResult);
      await login({ kennitala: mockLoginResult.toString() });
    },
    onSuccess: () => {
      console.log("Login success");
      router.push("/dashboard/clients");
    },
    onError: (error) => {
      console.error("Login error: ", error);
    },
  });

  return { loginMutation, isPending };
};

export { useLoginMutation };
