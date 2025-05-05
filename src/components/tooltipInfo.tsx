import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TooltipInfo = ({
  children,
  info,
  className,
}: {
  children: React.ReactNode;
  info: string;
  className?: string;
}) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className={className}>{info}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipInfo;
