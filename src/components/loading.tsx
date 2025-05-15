import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-5/6">
      <Loader2 size="64px" className="text-foreground animate-spin" />
      <div className="flex flex-row">
        <p className="text-foreground">Sæki gögn</p>
        <p className="text-foreground animate-pulse">...</p>
      </div>
    </div>
  );
};

export default Loading;
