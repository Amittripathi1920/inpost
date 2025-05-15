import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";

// Define the option type used by the combobox
export interface ComboboxOption {
  label: string;
  value: string;
}

interface ComboboxProps {
  id: string;
  value: string;
  onInputChange: (value: string) => void;
  items: ComboboxOption[];
  onSelect: (item: ComboboxOption) => void;
  placeholder: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export const Combobox = ({
  id,
  value,
  onInputChange,
  items,
  onSelect,
  placeholder,
  disabled,
  isLoading = false,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items based on the current input value
  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Input
            id={id}
            ref={inputRef}
            value={value}
            onChange={(e) => onInputChange(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className="pr-10"
          />
          {isLoading && (
            <div className="absolute right-2 top-2">
              <Spinner size="sm" />
            </div>
          )}
          <ChevronsUpDown className="absolute right-2 top-2 h-4 w-4 shrink-0 opacity-50" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full max-h-60 overflow-y-auto">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, idx) => (
            <DropdownMenuItem
              key={idx}
              className="cursor-pointer"
              onClick={() => {
                onSelect(item);
                setOpen(false);
              }}
            >
              {item.label}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No options found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
