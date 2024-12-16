// App.js
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import "antd/dist/reset.css"; // Import Ant Design CSS
import "./ProductLists.css";

const ProductLists = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/products"); // Replace with your API endpoint
        const json = await response.json();
        setData(json);
        console.log(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Define columns for the Ant Design Table
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Product List</h1>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="sku"
        pagination={{ pageSize: 10 }} // Customize page size
        className="product-table"
      />
    </div>
  );
};

export default ProductLists;
