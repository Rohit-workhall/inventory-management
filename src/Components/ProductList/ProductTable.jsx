import React from "react";
import { Table } from "antd";

const ProductTable = ({ columns, data, loading }) => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="sku"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default ProductTable;
