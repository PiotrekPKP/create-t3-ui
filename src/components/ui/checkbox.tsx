import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "../../utils/cn";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const CheckboxWithText: React.FC<{
  text: string;
  id: string;
  checked: CheckboxPrimitive.CheckedState;
  onCheckedChange: (checked: CheckboxPrimitive.CheckedState) => void;
}> = ({ text, id, checked, onCheckedChange }) => {
  return (
    <div className="items-top flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {text}
      </label>
    </div>
  );
};

export { Checkbox, CheckboxWithText };
