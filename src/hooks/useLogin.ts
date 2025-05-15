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

      await login({ kennitala: mockLoginResult.toString() });
    },
    onSuccess: () => {
      router.push("/dashboard/clients");
    },
  });

  return { loginMutation, isPending };
};

export { useLoginMutation };
