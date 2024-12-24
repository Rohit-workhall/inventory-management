  import React, { useState, useEffect } from "react";
  import { Table } from "antd";
  import AscendingSorter from "../ProductList/Sorter/AscendingSorter";
  import DescendingSorter from "../ProductList/Sorter/DescendingSorter";

  const ProductTable = ({ columns, data, loading }) => {
    const [sortedData, setSortedData] = useState([]);

    useEffect(() => {
      const defaultSortedData = [...data].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setSortedData(defaultSortedData);
    }, [data]);

    
    const enhancedColumns = columns.map((col) => {
      if (["name", "quantity", "price"].includes(col.dataIndex)) {
        return {
          ...col,
          width: 150, // Minimum width for responsive behavior
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
      return { ...col, width: 100 }; // Default column width
    });
    

    return (
      <Table
      columns={enhancedColumns}
      dataSource={sortedData}
      loading={loading}
      rowKey="sku"
      pagination={{ pageSize: 10 }}
      scroll={{ x: 800 }}
      />
    );
  };

  export default ProductTable;
