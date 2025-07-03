import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks
export const fetchBikes = createAsyncThunk(
  'bikes/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get('/api/bikes/', {
        headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addBike = createAsyncThunk(
  'bikes/add',
  async (bikeData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post('/api/bikes/', bikeData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const bikeSlice = createSlice({
  name: 'bikes',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    currentBike: null,
  },
  reducers: {
    setCurrentBike: (state, action) => {
      state.currentBike = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Bikes
      .addCase(fetchBikes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBikes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBikes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to fetch bikes';
      })
      
      // Add Bike
      .addCase(addBike.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addBike.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addBike.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to add bike';
      });
  },
});

export const { setCurrentBike } = bikeSlice.actions;
export default bikeSlice.reducer;