import { dmApi } from "../../app/dmApi";
import { getAuthorizationHeader, handleQueryError, handleQueryErrorAndSuccess } from "../../helpers/RtkQueryUtils";

const adminApi = dmApi.injectEndpoints({
    endpoints: (build) => ({
        addAdmin: build.mutation({
            query: ({ data }) => ({
                url: "admin/add-admin",
                method: "POST",
                body: data,
                headers: getAuthorizationHeader()
            }),
            invalidatesTags: ["getAdminListAPI"],
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(
                    queryFulfilled,
                    "Added",
                    "admin"
                );
            },
        }),
        updateAdmin: build.mutation({
            query: ({ data }) => ({
                url: "admin/update-admin-details",
                method: "PUT",
                body: data,
                headers: getAuthorizationHeader()
            }),
            invalidatesTags: ["getAdminListAPI"],
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(
                    queryFulfilled,
                    "Updated",
                    "admin"
                );
            },
        }),
        getAdminList: build.query({
            query: ({ page = 1, limit = 10, search = "" } = {}) => ({
                url: `admin/get-admins?page=${page}&limit=${limit}&search=${encodeURIComponent(
                    search
                )}`,
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            providesTags: ["getAdminListAPI"],
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },

        }),
        getAdminDetail: build.query({
            query: ({ id } = {}) => ({
                url: `admin/get-admin-details?id=${id}`,
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
             providesTags: ['getAdminListAPI']
        }),
        getAdminJobDetails: build.query({
            query: ({ id }) => ({
                url: `admin/get-job-details?jobId=${id}`,
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
              
                await handleQueryError(queryFulfilled);
            },
            providesTags: ['getAdminJobDetailsApi']
        }),
        getAllJobsByStatusAdmin: build.query({
            query: ({ page = 1, limit = 10, search = '', tabName = '' } = {}) => ({
                url: `admin/get-all-jobs-by-status?page=${page}&limit=${limit}&search=${search}&tabName=${tabName}`,
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
            providesTags: ['getAllJobsByStatusAdminApi']
        }),
        CancelJobsAdmin: build.mutation({
            query: ({ jobId }) => ({
                url: `admin/approve-job-cancellation`,
                method: "PUT",
                body: jobId,
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(queryFulfilled, "Approved", "Cancelled job");
            },
            invalidatesTags: ['getAdminJobDetailsApi', 'getAllJobsByStatusAdminApi']
        }),

      declineJobCancelReqAdmin: build.mutation({
            query: ({ jobId }) => ({
                url: `admin/decline-job-cancellation`,
                method: "PUT",
                body: jobId,
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(queryFulfilled, "Approved", " decline Cancelled job Request");
            },
            invalidatesTags: ['getAdminJobDetailsApi', 'getAllJobsByStatusAdminApi']
        }),
        CancelJobsByAdmin: build.mutation({
            query: ({ jobId, reason }) => ({
                url: `admin/job-cancellation`,
                method: "PUT",
                body: { jobId, reason },
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(queryFulfilled, "Cancelled", "Job");
            },
            invalidatesTags: ['getAdminJobDetailsApi', 'getAllJobsByStatusAdminApi']
        }),

        ApproveJobsByAdmin: build.mutation({
            query: ({ jobId }) => ({
                url: `admin/job-approve`,
                method: "PUT",
                body: { jobId },
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(queryFulfilled, "Approved", "Job");
            },
            invalidatesTags: ['getAdminJobDetailsApi', 'getAllJobsByStatusAdminApi']
        }),
          sendLinkAdmin: build.mutation({
            query: ({ jobId  , driverId}) => ({
                url: `admin/send-Link`,
                method: "POST",
                body: {jobId,driverId},
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(queryFulfilled, "Link", "sent");
            },
            invalidatesTags: ['getAdminJobDetailsApi', 'getAllJobsByStatusAdminApi']
        }),
        getRideDetails: build.query({
            query: ({id}) => ({
                url: `admin/fetch-ride-details?jobId=${id}`,
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
            invalidatesTags: ['getAdminJobDetailsApi', 'getAllJobsByStatusAdminApi']
        }),
    })
})
export const {
    useAddAdminMutation,
    useUpdateAdminMutation,
    useGetAdminListQuery,
    useGetAdminJobDetailsQuery,
    useGetAdminDetailQuery,
    useGetAllJobsByStatusAdminQuery,
    useCancelJobsAdminMutation,
    useCancelJobsByAdminMutation,
    useApproveJobsByAdminMutation,
    useDeclineJobCancelReqAdminMutation,
    useSendLinkAdminMutation,
    useGetRideDetailsQuery,
} = adminApi;