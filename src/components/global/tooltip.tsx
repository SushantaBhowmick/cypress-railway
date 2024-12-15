import React from 'react'
import { Tooltip, TooltipProvider, TooltipTrigger,TooltipContent } from '../ui/tooltip';

interface TooltipComponentProps{
    children:React.ReactNode;
    message:string;
}

const TooltipComponent:React.FC<TooltipComponentProps> = ({
    children,
    message
}) => {
  return (
   <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>{children}</TooltipTrigger>
            <TooltipContent>{message}</TooltipContent>
        </Tooltip>
   </TooltipProvider>
  )
}

export default TooltipComponent
