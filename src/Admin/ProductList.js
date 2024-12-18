import React, { useEffect, useState } from "react";
import { Button, Col, Input, Row, Table, notification } from "antd";
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
} from "../store/productsSlice";
import { deleteProduct } from "./Api";
import FilterDrawer from "../Components/ProductList/FilterDrawer";
import ConfirmationModal from "./ConfirmationModal";

const { Search } = Input;

const ProductList = ({ onEdit, onAdd }) => {
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const dispatch = useDispatch();
  const { data, filteredData, loading, filters } = useSelector(
    (state) => state.products
  );

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Apply filters whenever `filters` or `data` changes
  useEffect(() => {
    dispatch(applyFilters());
  }, [filters, data, dispatch]);

  const availabilityOptions = ["Out of Stock", "Limited Stock", "In Stock"];
  const categories = [...new Set(data.map((item) => item.category))];

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "SKU", dataIndex: "sku", key: "sku" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Price ($)", dataIndex: "price", key: "price" },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
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
    },
  ];

  const confirmDelete = (id) => {
    setSelectedProductId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProductId);
      console.log("Product deleted successfully.");
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

  return (
    <div className="admin-container">
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
        rowKey="id"
        pagination={{ pageSize: 10 }}
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
      {/* Delete Confirmation Modal */}
      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this product?"
          onConfirm={handleDelete}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default ProductList;
