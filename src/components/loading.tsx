import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen animate-spin">
      <Loader2 size="64px" />
    </div>
  );
};

export default Loading;
