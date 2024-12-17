import React, { useEffect, useState } from "react";
import { Table, Input, Select, Row, Col, Button, Drawer, Checkbox, Slider } from "antd";
import "antd/dist/reset.css"; // Import Ant Design CSS
import "./ProductLists.css";

const { Search } = Input;
const { Option } = Select;

const ProductLists = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);


  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);


  const [quantityFilter, setQuantityFilter] = useState(null);
  const [quantityFilterType, setQuantityFilterType] = useState("greater");
  const [availabilityFilter, setAvailabilityFilter] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/products"); // Replace with your API endpoint
        const json = await response.json();
        setData(json);
        setFilteredData(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = data;

 
    if (quantityFilter !== null) {
      if (quantityFilterType === "greater") {
        filtered = filtered.filter((item) => item.quantity > quantityFilter);
      } else {
        filtered = filtered.filter((item) => item.quantity < quantityFilter);
      }
    }


    if (availabilityFilter.length > 0) {
      filtered = filtered.filter((item) => {
        if (item.quantity === 0 && availabilityFilter.includes("Out of Stock")) return true;
        if (item.quantity <= 10 && item.quantity > 0 && availabilityFilter.includes("Limited Stock")) return true;
        if (item.quantity > 10 && availabilityFilter.includes("In Stock")) return true;
        return false;
      });
    }

    filtered = filtered.filter((item) => item.price >= priceRange[0] && item.price <= priceRange[1]);


    if (categoryFilter.length > 0) {
      filtered = filtered.filter((item) => categoryFilter.includes(item.category));
    }


    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchText.toLowerCase()) ||
          item.id.toString().includes(searchText)
      );
    }

    setFilteredData(filtered);
  }, [quantityFilter, quantityFilterType, availabilityFilter, priceRange, categoryFilter, searchText, data]);

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
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
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
  ];

  const availabilityOptions = ["Out of Stock", "Limited Stock", "In Stock"];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Product List</h1>

      {/* Search and Filters */}
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <Search
            placeholder="Search by Id, Name, or SKU"
            onChange={(e) => setSearchText(e.target.value)}
            enterButton
            allowClear
          />
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={() => setIsFilterDrawerVisible(true)} className="filter">
            Filter
          </Button>
        </Col>
      </Row>

      {/* Product Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="sku"
        pagination={{ pageSize: 10 }} // Customize page size
        className="product-table"
      />

      {/* Filter Drawer */}
      <Drawer
  title="Filters"
  placement="right"
  onClose={() => setIsFilterDrawerVisible(false)}
  open={isFilterDrawerVisible} // Change 'visible' to 'open'
  width={350}
>
  <div>
    <h3>Quantity</h3>
    <Select
      style={{ width: "100%", marginBottom: "10px" }}
      onChange={(value) => setQuantityFilterType(value)}
      defaultValue="greater"
    >
      <Option value="greater">Greater than</Option>
      <Option value="less">Less than</Option>
    </Select>
    <Input
      type="number"
      placeholder="Enter Quantity"
      onChange={(e) => setQuantityFilter(Number(e.target.value))}
      style={{ width: "100%" }}
    />

    <h3>Availability</h3>
    <Checkbox.Group
      options={availabilityOptions}
      onChange={(checkedValues) => setAvailabilityFilter(checkedValues)}
      style={{ display: "block", marginBottom: "10px" }}
    />

    <h3>Price Range</h3>
    <Slider
      range
      min={0}
      max={1000}
      defaultValue={[0, 1000]}
      onChange={(value) => setPriceRange(value)}
      tooltip={{ formatter: (value) => `$${value}` }}
      style={{ marginBottom: "10px" }}
    />

    <h3>Category</h3>
    <Checkbox.Group
      options={[...new Set(data.map((item) => item.category))]}
      onChange={(checkedValues) => setCategoryFilter(checkedValues)}
      style={{ display: "block" }}
    />
  </div>
</Drawer>
    </div>
  );
};

export default ProductLists;
