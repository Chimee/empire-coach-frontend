import { dmApi } from "../../app/dmApi";
import {
    getAuthorizationHeader,
    handleQueryError,
    handleQueryErrorAndSuccess,
} from "../../helpers/RtkQueryUtils";

const driverApi = dmApi.injectEndpoints({
    endpoints: (build) => ({
        addDriver: build.mutation({
            query: (formData) => ({
                url: "admin/create-driver",
                method: "POST",
                body: formData,
                headers: getAuthorizationHeader(),
            }),
            invalidatesTags: ["getDriverListAPI"],
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(
                    queryFulfilled,
                    "Added",
                    "Driver"
                );
            },
        }),
        updateDriver: build.mutation({
            query: (formData) => ({
                url: "admin/update-driver-details",
                method: "PUT",
                body: formData,
                headers: getAuthorizationHeader(), 
            }),
            invalidatesTags: ["getDriverListAPI"],
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(
                    queryFulfilled,
                    "Added",
                    "Driver"
                );
            },
        }),

        getDriverDetail: build.query({
            query: ({ id } = {}) => ({
                url: `admin/get-driver-details?driverId=${id}`,
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },

        }),
        getDriversList: build.query({
            query: ({ page = 1, limit = 10, search = "" } = {}) => ({
                url: `admin/get-all-drivers?page=${page}&limit=${limit}&search=${encodeURIComponent(
                    search
                )}`,
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            providesTags: ["getDriverListAPI"],
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
        }),
        assignDriver: build.mutation({
            query: ({ jobId, driverId }) => ({
                url: "admin/assign-driver",
                method: "POST",
                body: { jobId, driverId },
                headers: getAuthorizationHeader(),
            }),
            invalidatesTags: ["getAdminJobDetailsApi"],
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(
                    queryFulfilled,
                    "Added",
                    "Driver"
                );
            },
        }),
        getJobPickupDetails: build.query({
            query: ({ id }) => ({
                url: `driver/job-details-driver?jobId=${id}`,
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
            providesTags: ['getJobPickupDetailsApi']
        }),
        startRide: build.mutation({
            query: ({ jobId, driverId }) => ({
                url: `driver/riding-details`,
                method: "POST",
                body: { jobId, driverId },
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
            providesTags: ['startRideApi']
        }),
        updateRideDetails: build.mutation({
            query: (formData) => ({
                url: `driver/update-riding-details`,
                method: "PUT",
                body: formData,
                headers: {
                    ...getAuthorizationHeader(),
                },
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
            providesTags: ["updateRideDetailsApi"],
        }),

       updateTripDocuments: build.mutation({
       query: (formData) => {
    
        return {
            url: `driver/upload-trip-document`,
            method: "POST",
            body: formData,
            headers: {
                ...getAuthorizationHeader(),
            },
        };
    },
    async onQueryStarted(_, { queryFulfilled }) {
        await handleQueryError(queryFulfilled);
    },
    invalidatesTags: ["updateTripDocumentsApi"], // usually "invalidatesTags" hota hai update me
}),
        getAllTripDocuments: build.query({
            query: ({ id, driverId }) => ({
                url: `driver/fetch-trip-documents?job_id=${id}&driver_id=${driverId}`,
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
            providesTags: ['getJobPickupDetailsApi']
        }),
    }),


});

export const {
    useAddDriverMutation,
    useUpdateDriverMutation,
    useGetDriverDetailQuery,
    useGetDriversListQuery,
    useAssignDriverMutation,
    useGetJobPickupDetailsQuery,
    useStartRideMutation,
    useUpdateRideDetailsMutation,
    useUpdateTripDocumentsMutation,
    useGetAllTripDocumentsQuery
} = driverApi;
