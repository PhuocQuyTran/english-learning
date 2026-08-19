import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type ComboboxOption = {
  label: string;
  value: string;
};

type ComboboxProps = {
  options: ComboboxOption[];
  defaultOptions?: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  placeholderClassName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleSearch: any;
  isLoading?: boolean;
  name?: string;
};

const InputCombobox = ({
  options,
  defaultOptions,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No result.",
  disabled,
  className,
  placeholderClassName,
  handleSearch,
  isLoading,
  ...props
}: ComboboxProps) => {
  console.log("isLoading", isLoading);
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const selected =
    options.find((opt) => opt.value === value) ||
    defaultOptions?.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          aria-expanded={open}
          className={cn(
            "w-full min-w-0 overflow-hidden flex items-center [&_svg]:size-4 px-3 text-[#D1D5DB]! justify-between cursor-auto bg-white! text-base md:text-sm pl-3",
            className,
            selected ? "font-normal text-foreground!" : placeholderClassName,
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50",
          )}
          {...props}
        >
          <div className="flex-1 min-w-0 w-0 overflow-hidden">
            <span className="truncate block w-full text-black text-left">
              {selected ? selected.label : placeholder}
            </span>
          </div>
          {selected ? (
            <span
              role="button"
              tabIndex={0}
              className="ml-1 flex items-center justify-center cursor-pointer"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange?.("");
              }}
            >
              <X className="shrink-0 text-black" />
            </span>
          ) : (
            <ChevronDown className="text-black shrink-0" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 border-border w-(--radix-popover-trigger-width)"
        align="start"
      >
        <Command className="border-border">
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={(value) => {
              setSearchTerm(value);
              handleSearch(value);
            }}
            value={searchTerm}
          />

          <CommandEmpty>{emptyText}</CommandEmpty>

          <CommandGroup className="max-h-50 overflow-y-auto border-border">
            {options.map((opt) => (
              <CommandItem
                key={opt.value}
                value={opt.value ?? ""}
                keywords={[opt.label ?? ""]}
                onSelect={() => {
                  onChange?.(opt.value);
                  setOpen(false);
                }}
                className="font-medium"
              >
                {opt.label}
                <Check
                  className={cn(
                    "ml-auto",
                    value === opt.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default InputCombobox;
