import InputCombobox from "./inputCombobox";

import { cn } from "@/lib/utils";
import { vocabularyEndpoints } from "@/services/endpoints";
import { useState } from "react";
import { api } from "@/api/axios";
export type Option = {
  value: string;
  label: string;
  count?: number;
  children?: Option[];
};
interface HseCaseSearchProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
  inputClassName?: string;
  placeholderClassName?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
}
export const convertToOptions = (data: any[]) => {
  return data.map((item) => ({
    value: item.word || item.id,
    label: item.word || item.name || item.full_name || item.title,
    count:
      item.user_count !== undefined ? item.user_count : item.recipient_count,
  }));
};

export function SearchSelect({
  value,
  onChange,
  options,
  className,
  inputClassName,
  placeholderClassName,
  placeholder,
  searchPlaceholder,
  label,
}: HseCaseSearchProps) {
  const [selectOptions, setSelectOptions] = useState<Option[]>(options);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (keyword: string) => {
    if (!keyword?.trim()) {
      setSelectOptions(options);
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.get(vocabularyEndpoints.list, {
        params: { page: 1, limit: 10, keyword: keyword?.trim() },
      });
      setSelectOptions(convertToOptions(res.data.data));
    } catch (error) {
      console.log("Search employee error", error);
      setSelectOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)}>
      <span className="text-base text-muted-foreground">{label}</span>
      <InputCombobox
        value={value === "ALL" ? "" : value}
        onChange={(val) => onChange(val || "ALL")}
        options={selectOptions}
        defaultOptions={options}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        className={cn("w-full border-border", inputClassName)}
        placeholderClassName={placeholderClassName}
        handleSearch={handleSearch}
        isLoading={isLoading}
      />
    </div>
  );
}
