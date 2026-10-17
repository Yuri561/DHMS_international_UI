import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { CategoryTypes } from './BrandTypes';




const CatSelection: React.FC = () => {
  return (
    <div>
      <Select>
        <SelectTrigger className="w-[180px] bg-white text-black">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          {CategoryTypes.map((category) => (
            <SelectItem key={category.toString()} value={category.toString()}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CatSelection;