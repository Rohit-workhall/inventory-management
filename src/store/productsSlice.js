// src\store\productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addProduct as addProductAPI } from "../Admin/Api"; 
  
export const addProduct = createAsyncThunk("products/addProduct", async (productData) => {
  const response = await addProductAPI(productData);
  return response;
});

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
    try {
      const response = await fetch("http://localhost:3001/products"); 
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;    }
  });


const productsSlice = createSlice({
    name: "products",
    initialState: {
      data: [], 
      filteredData: [],
      loading: true,
      filters: {
        quantity: null,
        quantityType: "greater",
        availability: [],
        priceRange: [0, 1000],
        category: [],
        searchText: "",
      },
    },
    reducers: {
    setQuantityFilter(state, action) {
      state.filters.quantity = action.payload;
    },
    setQuantityFilterType(state, action) {
      state.filters.quantityType = action.payload;
    },
    setAvailabilityFilter(state, action) {
      state.filters.availability = action.payload;
    },
    setPriceRange(state, action) {
      state.filters.priceRange = action.payload;
    },
    setCategoryFilter(state, action) {
      state.filters.category = action.payload;
    },
    setSearchText(state, action) {
      state.filters.searchText = action.payload;
    },
    applyFilters(state) {
      const { quantity, quantityType, availability, priceRange, category, searchText } = state.filters;
      let filtered = state.data;

      // Apply Quantity filter
      if (quantity !== null) {
        if (quantityType === "greater") {
          filtered = filtered.filter((item) => item.quantity > quantity);
        } else {
          filtered = filtered.filter((item) => item.quantity < quantity);
        }
      }

      if (availability.length > 0) {
        filtered = filtered.filter((item) => {
          if (item.quantity === 0 && availability.includes("Out of Stock")) return true;
          if (item.quantity <= 10 && item.quantity > 0 && availability.includes("Limited Stock")) return true;
          if (item.quantity > 10 && availability.includes("In Stock")) return true;
          return false;
        });
      }

      filtered = filtered.filter((item) => item.price >= priceRange[0] && item.price <= priceRange[1]);
    
      if (category.length > 0) {
        filtered = filtered.filter((item) => category.includes(item.category));
      }

      if (searchText) {
        filtered = filtered.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchText.toLowerCase()) ||
            item.id.toString().includes(searchText)
        );
      }

      state.filteredData = filtered;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true; 
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false; 
        state.data = action.payload; 
        state.filteredData = action.payload; 
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false; 
        console.error("Failed to fetch products:", action.error.message);
      });
  },
});


export const {
  setQuantityFilter,
  setQuantityFilterType,
  setAvailabilityFilter,
  setPriceRange,
  setCategoryFilter,
  setSearchText,
  applyFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
