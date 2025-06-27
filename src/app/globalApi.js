import {getAuthorizationHeader, handleQueryError} from "../helpers/RtkQueryUtils";
import {dmApi} from "./dmApi";

export const globalApi = dmApi.injectEndpoints({
    endpoints: (build) => ({
        getRoles: build.query({
            query: () => ({
                url: `/roles`,
                method: "GET",
                headers: getAuthorizationHeader()
            }),
            async onQueryStarted(_, {queryFulfilled,}) {
                await handleQueryError(queryFulfilled)
            },
        }),
    }),
})

export const {
    useGetRolesQuery
} = globalApi;