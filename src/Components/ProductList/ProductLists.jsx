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
import {
  Table,
  Input,
  Select,
  Row,
  Col,
  Button,
  Drawer,
  Checkbox,
  Slider,
} from "antd";
import "antd/dist/reset.css";
import "./ProductLists.css";

const { Search } = Input;
const { Option } = Select;

const ProductLists = () => {
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const dispatch = useDispatch();
  const { data, filteredData, loading, filters } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(applyFilters());
  }, [filters, data, dispatch]);

  const availabilityOptions = ["Out of Stock", "Limited Stock", "In Stock"];

  const columns = [
    { title: "Id", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
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

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="sku"
        pagination={{ pageSize: 10 }}
      />

      <Drawer
        title="Filters"
        placement="right"
        onClose={() => setIsFilterDrawerVisible(false)}
        open={isFilterDrawerVisible}
        width={350}
      >
        <div>
          <h3>Quantity</h3>
          <Select
            style={{ width: "100%", marginBottom: "10px" }}
            onChange={(value) => dispatch(setQuantityFilterType(value))}
            defaultValue="greater"
          >
            <Option value="greater">Greater than</Option>
            <Option value="less">Less than</Option>
          </Select>
          <Input
            type="number"
            placeholder="Enter Quantity"
            onChange={(e) =>
              dispatch(setQuantityFilter(Number(e.target.value)))
            }
            style={{ width: "100%" }}
          />

          <h3>Availability</h3>
          <Checkbox.Group
            options={availabilityOptions}
            onChange={(checkedValues) =>
              dispatch(setAvailabilityFilter(checkedValues))
            }
            style={{ display: "block", marginBottom: "10px" }}
          />

          <h3>Price Range</h3>
          <Slider
            range
            min={0}
            max={1000}
            defaultValue={[0, 1000]}
            onChange={(value) => dispatch(setPriceRange(value))}
            tooltip={{ formatter: (value) => `$${value}` }}
            style={{ marginBottom: "10px" }}
          />

          <h3>Category</h3>
          <Checkbox.Group
            options={[...new Set(data.map((item) => item.category))]}
            onChange={(checkedValues) =>
              dispatch(setCategoryFilter(checkedValues))
            }
            style={{ display: "block" }}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default ProductLists;
