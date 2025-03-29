import { Loader2 } from "lucide-react";

const LoginLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center w-40 text-center">
      <p>Innskráning með rafrænum skilríkjum</p>
      <p className="text-sm pt-2">Fylgdu leiðbeningum í símanum</p>
      <div className="flex items-center justify-center pt-10">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    </div>
  );
};

export default LoginLoader;
