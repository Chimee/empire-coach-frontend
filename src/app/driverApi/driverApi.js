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
                headers: getAuthorizationHeader(), // Do NOT set 'Content-Type' here
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
                headers: getAuthorizationHeader(), // Do NOT set 'Content-Type' here
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
             providesTags:["getDriverListAPI"],
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
        }),
    }),
});

export const {
    useAddDriverMutation,
    useUpdateDriverMutation,
    useGetDriverDetailQuery,
    useGetDriversListQuery,
} = driverApi;
