import React, { useState, useEffect } from "react";
import { Table, Input, Row, Col, notification } from "antd";
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
import { deleteProduct } from "../../Admin/Api";
import ConfirmationModal from "../../Admin/ConfirmationModal";
import { FilterFilled } from "@ant-design/icons";
import ProductForm from "../../Admin/ProductForm";

const { Search } = Input;

const ProductLists = ({ onEdit }) => {
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const dispatch = useDispatch();
  const { data, filteredData, loading, filters } = useSelector(
    (state) => state.products
  );
  const Role = localStorage.getItem("Role");

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
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      fixed: "left",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, record) => (
        <Link to={`/product/${record.id}`}>{name}</Link>
      ),
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

  if (Role === "admin") {
    columns.push({
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <button className="button" onClick={() => onEdit(record)}>
            Edit
          </button>
          <button
            className="button delete-btn"
            onClick={() => confirmDelete(record.id)}
          >
            Delete
          </button>
        </div>
      ),
    });
  }

  const confirmDelete = (id) => {
    setSelectedProductId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProductId);
      notification.open({ message: "Product deleted successfully." });
      setShowModal(false);
      dispatch(fetchProducts());
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const refreshList = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div style={{ padding: "20px" }}>
            <Row
        gutter={[16, 16]}
        style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between" }}
      >
        <Col span={8}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Search
              placeholder="Search by Id, Name, or SKU"
              onChange={(e) => dispatch(setSearchText(e.target.value))}
              enterButton
              allowClear
              style={{ width: "100%" }}
            />
            <FilterFilled
              onClick={() => setIsFilterDrawerVisible(true)}
              style={{
                height: "30px",
                fontSize: "25px",
                color: "grey",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            />
          </div>
        </Col>
        <Col>
          <button
            className="button"
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
          >
            Add Product
          </button>
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
        onCategoryChange={(checkedValues) =>
          dispatch(setCategoryFilter(checkedValues))
        }
      />
      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this product?"
          onConfirm={handleDelete}
          onCancel={closeModal}
        />
      )}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ProductForm
              mode="add"
              onClose={() => setShowForm(false)}
              refreshList={refreshList}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductLists;
