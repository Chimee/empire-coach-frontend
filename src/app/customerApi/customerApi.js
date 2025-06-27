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
        }),
    })
})
export const {
    useAddCustomerMutation,
    useUpdateCustomerMutation,
    useGetCustomerDetailQuery,
} = customerApi;