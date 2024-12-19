import React, { useState, useEffect } from "react";
import { Table, Input, Row, Col, Button } from "antd";
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
import { Link } from "react-router-dom";
import FilterDrawer from "./FilterDrawer";

const { Search } = Input;

const ProductLists = () => {
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [pageSize, setPageSize] = useState(10); // Track page size
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
    {
      title: "SI.No",
      key: "siNo",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1, // Calculate serial number correctly
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, record) => <Link to={`/product/${record.id}`}>{name}</Link>,
    },
    { title: "SKU", dataIndex: "sku", key: "sku" },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
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
      sorter: (a, b) => a.price - b.price,
      render: (price) => `$${price.toFixed(2)}`,
    },
    { title: "Category", dataIndex: "category", key: "category" },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Product List</h1>
      <Row gutter={[16, 16]} align="middle" style={{ marginBottom: "20px" }}>
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

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="sku"
        pagination={{
          current: currentPage,
          pageSize,
          total: filteredData.length,
        }}
        onChange={handleTableChange}
      />

      <FilterDrawer
        isVisible={isFilterDrawerVisible}
        onClose={() => setIsFilterDrawerVisible(false)}
        availabilityOptions={availabilityOptions}
        categories={categories}
        onQuantityTypeChange={(value) => dispatch(setQuantityFilterType(value))}
        onQuantityChange={(value) => dispatch(setQuantityFilter(value))}
        onAvailabilityChange={(checkedValues) =>
          dispatch(setAvailabilityFilter(checkedValues))
        }
        onPriceChange={(value) => dispatch(setPriceRange(value))}
        onCategoryChange={(checkedValues) => dispatch(setCategoryFilter(checkedValues))}
      />
    </div>
  );
};

export default ProductLists;
