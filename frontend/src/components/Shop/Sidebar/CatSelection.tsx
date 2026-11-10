import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CatSelectionProps {
  categories: string[];
  value?: string;
  onChange?: (value: string) => void;
}

const CatSelection: React.FC<CatSelectionProps> = ({
  categories,
  value,
  onChange,
}) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="w-[180px] bg-white text-black">
        <SelectValue placeholder="Select Category" />
      </SelectTrigger>

      <SelectContent>
        {categories.map((category) => (
          <SelectItem
            key={category}
            value={category}
          >
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CatSelection;