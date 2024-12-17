import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async action to fetch products from the API
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response = await fetch("http://localhost:3001/products"); // Replace with your API endpoint
  return response.json();
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

      // Apply Availability filter
      if (availability.length > 0) {
        filtered = filtered.filter((item) => {
          if (item.quantity === 0 && availability.includes("Out of Stock")) return true;
          if (item.quantity <= 10 && item.quantity > 0 && availability.includes("Limited Stock")) return true;
          if (item.quantity > 10 && availability.includes("In Stock")) return true;
          return false;
        });
      }

      // Apply Price Range filter
      filtered = filtered.filter((item) => item.price >= priceRange[0] && item.price <= priceRange[1]);

      // Apply Category filter
      if (category.length > 0) {
        filtered = filtered.filter((item) => category.includes(item.category));
      }

      // Apply Search filter
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
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.data = action.payload;
      state.filteredData = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchProducts.rejected, (state) => {
      state.loading = false;
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
