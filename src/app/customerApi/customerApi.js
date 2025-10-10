import { dmApi } from "../../app/dmApi";
import { getAuthorizationHeader, handleQueryError, handleQueryErrorAndSuccess } from "../../helpers/RtkQueryUtils";

const customerApi = dmApi.injectEndpoints({
    endpoints: (build) => ({
        addCustomer: build.mutation({
            query: ({ data }) => ({
                url: "admin/create-customer",
                method: "POST",
                body: data,
                headers: getAuthorizationHeader()
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(
                    queryFulfilled,
                    "Added",
                    "Customer"
                );
            },
            invalidatesTags: ["customerData","getCompanyCustomersListAPI"]
        }),
        updateCustomer: build.mutation({
            query: ({ data }) => ({
                url: "admin/update-customer-details",
                method: "PUT",
                body: data,
                headers: getAuthorizationHeader()
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(
                    queryFulfilled,
                    "Updated",
                    "Customer"
                );
            },
          invalidatesTags: ["customerData","getCompanyCustomersListAPI"]
        }),

        getCustomerDetail: build.query({
            query: ({ id } = {}) => ({
                url: `admin/get-customer-details?customerId=${id}`,
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
                providesTags: ['getCompanyCustomersListAPI']
        }),
        getCustomerProfile: build.query({
            query: () => ({
                url: "customer/get-customer-profile-details",
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
            invalidatesTags: ["companyDetails"]

        }),
        createJob: build.mutation({
            query: ({ data }) => ({
                url: "customer/create-job",
                method: "POST",
                body: data,
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(
                    queryFulfilled,
                    "Created",
                    "Job"
                );
            },

        }),
        saveDeliveryAddress: build.mutation({
            query: ({ data }) => ({
                url: "customer/save-delivery-address",
                method: "POST",
                body: data,
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(
                    queryFulfilled,
                    "Saved",
                    "Delivery Address"
                );
            },
            invalidatesTags: ["getDeliveryAddressesAPI"]
        }),
        updateDeliveryAddress: build.mutation({
            query: ({ data }) => ({
                url: "customer/update-delivery-address",
                method: "PUT",
                body: data,
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(
                    queryFulfilled,
                    "Update",
                    "Delivery Address"
                );
            },
            invalidatesTags: ["getDeliveryAddressesAPI","getAdminJobDetailsApi"]
        }),
        deleteDeliveryAddress: build.mutation({
            query: ({ addressId }) => ({
                url: `customer/delete-delivery-address?addressId=${addressId}`,
                method: "DELETE",
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(
                    queryFulfilled,
                    "Deleted",
                    "Delivery Address"
                );
            },
            invalidatesTags: ["getDeliveryAddressesAPI"]
        }),
        getDeliveryAddresses: build.query({
            query: ({ page = 1, limit = 10 } = {}) => ({
                url: `customer/get-delivery-address?page=${page}&limit=${limit}`,
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
            providesTags: ["getDeliveryAddressesAPI"],
        }),
        getAllJobsByStatus: build.query({
            query: ({ page = 1, limit = 10, search = '', tabName = '' } = {}) => ({
                url: `customer/get-all-jobs-by-status?page=${page}&limit=${limit}&search=${search}&tabName=${tabName}`,
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
            providesTags: ['getAllJobsByStatusApi']
        }),
        getJobDetails: build.query({
            query: ({ id }) => {

                return {
                    url: `customer/get-job-details?jobId=${id}`,
                    method: "GET",
                    headers: getAuthorizationHeader(),
                }
            },
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
            providesTags: ['getJobDetailsApi']
        }),

        cancelRescheduleJob: build.mutation({
            query: ({ jobId, reason, type }) => ({
                url: `customer/job-action`,
                method: "POST",
                body: { jobId, reason, type },
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
            invalidatesTags: ['getJobDetailsApi'],
        }),

        RescheduleJobDate: build.mutation({
            query: ({ jobId, pickup_date, pickup_time, dropoff_date, dropoff_time, time_relaxation, reason }) => {
                return {
                    url: `customer/update-job-schedule`,
                    method: "PUT",
                    body: {
                        jobId,
                        pickup_date,
                        pickup_time,
                        dropoff_date,
                        time_relaxation,
                        reason,
                        ...(dropoff_time ? { dropoff_time } : {}),
                    },
                    headers: getAuthorizationHeader(),
                };
            },
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },

            invalidatesTags: ['getJobDetailsApi'],
        }),


        FillingPoNumber: build.mutation({
            query: ({ jobId, po_number }) => {

                return {
                    url: `customer/fill-po-number`,
                    method: "PUT",
                    body: { jobId, po_number },
                    headers: getAuthorizationHeader(),
                };
            },
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
            invalidatesTags: ['getAllJobsByStatusApi'],
        }),

        getAllCompletedJobs: build.query({
            query: ({ page = 1, limit = 10, search = '', } = {}) => ({
                url: `customer/completed-jobs?page=${page}&limit=${limit}&search=${search}`,
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
        }),
    })
})
export const {
    useAddCustomerMutation,
    useUpdateCustomerMutation,
    useGetCustomerDetailQuery,
    useGetCustomerProfileQuery,
    useCreateJobMutation,
    useSaveDeliveryAddressMutation,
    useUpdateDeliveryAddressMutation,
    useGetDeliveryAddressesQuery,
    useGetAllJobsByStatusQuery,
    useGetJobDetailsQuery,
    useDeleteDeliveryAddressMutation,
    useCancelRescheduleJobMutation,
    useRescheduleJobDateMutation,
    useFillingPoNumberMutation,
    useGetAllCompletedJobsQuery,
} = customerApi;