import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TooltipInfo = ({
  children,
  info,
}: {
  children: React.ReactNode;
  info: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>{info}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipInfo;
