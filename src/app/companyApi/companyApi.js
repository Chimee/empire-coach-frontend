import { dmApi } from "../../app/dmApi";
import { getAuthorizationHeader, handleQueryError, handleQueryErrorAndSuccess } from "../../helpers/RtkQueryUtils";

const companyApi = dmApi.injectEndpoints({
    endpoints: (build) => ({
        addCompany: build.mutation({
            query: ({ data }) => ({
                url: "admin/create-company",
                method: "POST",
                body: data,
                headers: getAuthorizationHeader()
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(
                    queryFulfilled,
                    "Added",
                    "Company"
                );
            },
        }),
        updateCompany: build.mutation({
            query: ({ data }) => ({
                url: "admin/update-company-details",
              method: 'PUT',
                body: data,
                headers: getAuthorizationHeader()
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(
                    queryFulfilled,
                    "Updated",
                    "Company"
                );
            },
        }),
        getCompanyList: build.query({

            query: ({ page = 1, limit = 10, search = "" } = {}) => ({


                url: `admin/get-all-companies?page=${page}&limit=${limit}&search=${encodeURIComponent(
                    search
                )}`,
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
        }),
        getCompanyCustomersList: build.query({

            query: ({ page = 1, limit = 10, search = "", id } = {}) => ({


                url: `admin/get-company-customers?page=${page}&limit=${limit}&companyId=${id}`,
                method: "GET",
                headers: getAuthorizationHeader(),
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryError(queryFulfilled);
            },
        }),
        getCompanyDetail: build.query({
            query: ({ id } = {}) => ({
                url: `admin/get-company-details?comapnyId=${id}`,
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
    useAddCompanyMutation,
    useUpdateCompanyMutation,
    useGetCompanyListQuery,
    useGetCompanyCustomersListQuery,
    useGetCompanyDetailQuery,
} = companyApi;