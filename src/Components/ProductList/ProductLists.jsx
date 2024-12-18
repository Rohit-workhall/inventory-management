import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  setQuantityFilter,
  setQuantityFilterType,
  setAvailabilityFilter,
  setPriceRange,
  setCategoryFilter,
  setSearchText,
  applyFilters,
} from "../../store/productsSlice";
import { Input, Row, Col, Button } from "antd";
import ProductTable from "./ProductTable";
import FilterDrawer from "./FilterDrawer";
import { Link } from "react-router-dom";  // Import Link from react-router-dom

const { Search } = Input;

const ProductLists = () => {
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const dispatch = useDispatch();
  const { data, filteredData, loading, filters } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(applyFilters());
  }, [filters, data, dispatch]);

  const availabilityOptions = ["Out of Stock", "Limited Stock", "In Stock"];
  const categories = [...new Set(data.map((item) => item.category))];

  const columns = [
    { title: "Id", dataIndex: "id", key: "id" },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Link to={`/product/${record.id}`}>{name}</Link>  // Wrap name with Link
      ),
    },
    { title: "SKU", dataIndex: "sku", key: "sku" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Availability",
      key: "availability",
      render: (_, record) => {
        if (record.quantity === 0) return "Out of Stock";
        if (record.quantity <= 10) return "Limited Stock";
        return "In Stock";
      },
    },
    {
      title: "Price ($)",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    { title: "Category", dataIndex: "category", key: "category" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Product List</h1>
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <Search
            placeholder="Search by Id, Name, or SKU"
            onChange={(e) => dispatch(setSearchText(e.target.value))}
            enterButton
            allowClear
          />
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={() => setIsFilterDrawerVisible(true)}>
            Filter
          </Button>
        </Col>
      </Row>

      <ProductTable columns={columns} data={filteredData} loading={loading} />

      <FilterDrawer
        isVisible={isFilterDrawerVisible}
        onClose={() => setIsFilterDrawerVisible(false)}
        availabilityOptions={availabilityOptions}
        categories={categories}
        onQuantityTypeChange={(value) => dispatch(setQuantityFilterType(value))}
        onQuantityChange={(value) => dispatch(setQuantityFilter(value))}
        onAvailabilityChange={(checkedValues) => dispatch(setAvailabilityFilter(checkedValues))}
        onPriceChange={(value) => dispatch(setPriceRange(value))}
        onCategoryChange={(checkedValues) => dispatch(setCategoryFilter(checkedValues))}
      />
    </div>
  );
};

export default ProductLists;
