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
