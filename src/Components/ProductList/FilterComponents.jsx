import React from "react";
import { Select, Input, Checkbox, Slider } from "antd";

const { Option } = Select;

export const QuantityFilter = ({ onQuantityTypeChange, onQuantityChange }) => (
  <>
    <h3>Quantity</h3>
    <Select
      style={{ width: "100%", marginBottom: "10px" }}
      onChange={onQuantityTypeChange}
      defaultValue="greater"
    >
      <Option value="greater">Greater than</Option>
      <Option value="less">Less than</Option>
    </Select>
    <Input
      type="number"
      placeholder="Enter Quantity"
      onChange={(e) => onQuantityChange(Number(e.target.value))}
      style={{ width: "100%" }}
    />
  </>
);

export const AvailabilityFilter = ({ availabilityOptions, onAvailabilityChange }) => (
  <>
    <h3>Availability</h3>
    <Checkbox.Group
      options={availabilityOptions}
      onChange={onAvailabilityChange}
      style={{ display: "block", marginBottom: "10px" }}
    />
  </>
);

export const PriceRangeFilter = ({ onPriceChange }) => (
  <>
    <h3>Price Range</h3>
    <Slider
      range
      min={0}
      max={1000}
      defaultValue={[0, 1000]}
      onChange={onPriceChange}
      tooltip={{ formatter: (value) => `$${value}` }}
      style={{ marginBottom: "10px" }}
    />
  </>
);

export const CategoryFilter = ({ categories, onCategoryChange }) => (
  <>
    <h3>Category</h3>
    <Checkbox.Group
      options={categories}
      onChange={onCategoryChange}
      style={{ display: "block" }}
    />
  </>
);

