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
            invalidatesTags:["getAdminListAPI"],
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
            invalidatesTags:["getAdminListAPI"],
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
             providesTags:["getAdminListAPI"],
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
        }),
    })
})
export const {
    useAddAdminMutation,
    useUpdateAdminMutation,
    useGetAdminListQuery,
    useGetAdminDetailQuery,
} = adminApi;