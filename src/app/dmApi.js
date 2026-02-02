import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const dmApi = createApi({
    reducerPath: "dmApi",
    
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1/',
        
    }),
    tagTypes: ["supplier", 
        "getAdminListAPI",       
        'getDriverListAPI',
        'getDeliveryAddressesAPI',
        'getJobDetailsApi',
        'getAllJobsByStatusAdminApi',
        "getAllJobsByStatusApi",
        "getAdminJobDetailsApi",
        "getVehicleApi",
        "getCustomerDetailAPI",
        "GetCompanyListAPI",
        "CompanyDetail",
        "companyData",
        "getAdminListAPI",
        "CompanyList",
        "customerData",
        "companyDetails",
        "getCompanyCustomersListAPI"  
    ],
    endpoints: () => ({}),
})