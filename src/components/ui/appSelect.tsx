import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export interface Option {
  label: string;
  value: string;
}

interface AppSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: readonly Option[] | Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const AppSelect: React.FC<AppSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className,
  disabled,
}) => {
  return (
    <Select value={value || ""} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
