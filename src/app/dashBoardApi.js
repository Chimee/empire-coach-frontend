import { dmApi } from "./dmApi";
import {
    getAuthorizationHeader,
    handleQueryError,
} from "../helpers/RtkQueryUtils";


export const dashboardApi = dmApi.injectEndpoints({
    endpoints: (build) => ({
        getJobOverview: build.query({
            query: () => ({
                url: "/jobs-overview",
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
        }),
    }),
});

// Export the hook
export const {
    useGetJobOverviewQuery,
} = dashboardApi;
