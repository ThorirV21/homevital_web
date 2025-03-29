import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, mockLogin } from "@/services/api";
import { loginSchema } from "@/services/schemas";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { UserDTO } from "@/types/workerTypes";
const useLoginMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: loginMutation, isPending: isPending } = useMutation({
    mutationFn: async (form: z.infer<typeof loginSchema>) => {
      const mockLoginResult = await mockLogin(form);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return await login({ kennitala: mockLoginResult.toString() });
    },
    onSuccess: (data: UserDTO) => {
      // Store the user data in React Query's cache
      queryClient.setQueryData(["user"], data as UserDTO);
      router.push("/dashboard/clients");
    },
  });

  return { loginMutation, isPending };
};

export { useLoginMutation };
