import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const dmApi = createApi({
    reducerPath: "dmApi",
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4000/api/v1',
    }),
    tagTypes: ["supplier",
        "getAdminListAPI",
        'getDriverListAPI',
        'getDeliveryAddressesAPI',
        'getJobDetailsApi',
        'getAllJobsByStatusAdminApi',
        "getAllJobsByStatusApi",
        "getAdminJobDetailsApi",
        "getVehicleApi"
    ],
    endpoints: () => ({}),
})