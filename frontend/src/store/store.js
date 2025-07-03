import React from 'react'
import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bikeReducer from './slices/bikeSlice';

 const store = configureStore({
    reducer: {
        auth: authReducer,
        bikes: bikeReducer,
    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware({
            serializableCheck:false, //for non-serializable values like MongoDb objectID
        }),
})

export default store