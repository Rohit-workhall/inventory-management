  import React, { useState, useEffect } from "react";
  import { Table } from "antd";
  import AscendingSorter from "../ProductList/Sorter/AscendingSorter";
  import DescendingSorter from "../ProductList/Sorter/DescendingSorter";
  import "./ProductLists.css";

  const ProductTable = ({ columns, data, loading }) => {
    // Initialize state for sorted data
    const [sortedData, setSortedData] = useState([]);

    // Sort by product name in ascending order by default
    useEffect(() => {
      const defaultSortedData = [...data].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setSortedData(defaultSortedData);
    }, [data]);

    // Enhance columns with sorting icons
    const enhancedColumns = columns.map((col) => {
      if (["name", "quantity", "price"].includes(col.dataIndex)) {
        return {
          ...col,
          title: (
            <div>
              {col.title}
              <AscendingSorter
                data={sortedData}
                setData={setSortedData}
                columnKey={col.dataIndex}
              />
              <DescendingSorter
                data={sortedData}
                setData={setSortedData}
                columnKey={col.dataIndex}
              />
            </div>
          ),
        };
      }
      return col;
    });

    return (
      <Table
        columns={enhancedColumns}
        dataSource={sortedData}
        loading={loading}
        rowKey="sku"
        pagination={{ pageSize: 10 }}
      />
    );
  };

  export default ProductTable;
