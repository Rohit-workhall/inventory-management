import React from "react";
import { Drawer } from "antd";
import {
  QuantityFilter,
  AvailabilityFilter,
  PriceRangeFilter,
  CategoryFilter,
} from "./FilterComponents";

const FilterDrawer = ({
  isVisible,
  onClose,
  availabilityOptions,
  categories,
  onQuantityTypeChange,
  onQuantityChange,
  onAvailabilityChange,
  onPriceChange,
  onCategoryChange,
}) => {
  return (
    <Drawer title="Filters" placement="right" onClose={onClose} open={isVisible} width={350}>
      <QuantityFilter
        onQuantityTypeChange={onQuantityTypeChange}
        onQuantityChange={onQuantityChange}
      />
      <AvailabilityFilter
        availabilityOptions={availabilityOptions}
        onAvailabilityChange={onAvailabilityChange}
      />
      <PriceRangeFilter onPriceChange={onPriceChange} />
      <CategoryFilter categories={categories} onCategoryChange={onCategoryChange} />
    </Drawer>
  );
};

export default FilterDrawer;
