import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ButtonProps = {
  handleRestart: () => void;
};

export default function RestartButton({ handleRestart }: ButtonProps) {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={handleRestart}>
              Restart (ESC)
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Press Esc to reset</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
