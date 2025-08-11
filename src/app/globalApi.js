import { getAuthorizationHeader, handleQueryError } from "../helpers/RtkQueryUtils";
import { dmApi } from "./dmApi";

export const globalApi = dmApi.injectEndpoints({
    endpoints: (build) => ({
        getRoles: build.query({
            query: () => ({
                url: `/roles`,
                method: "GET",
                headers: getAuthorizationHeader()
            }),
            async onQueryStarted(_, { queryFulfilled, }) {
                await handleQueryError(queryFulfilled)
            },
        }),
        getUpdateLocationLogs: build.query({
            query: ({ id, driverId }) => ({
                url: `driver/update-location?job_id=${id}&driver_id=${driverId}`,
                method: "GET",
                headers: getAuthorizationHeader()
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    const res = await queryFulfilled;
                } catch (err) {
                }
            }
        }),
    }),
})

export const {
    useGetRolesQuery,
    useGetUpdateLocationLogsQuery
} = globalApi;