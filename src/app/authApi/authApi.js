import { dmApi } from "../../app/dmApi";
import { handleQueryErrorAndSuccess } from "../../helpers/RtkQueryUtils";

const authApi = dmApi.injectEndpoints({
    endpoints: (build) => ({
        resetPassword: build.mutation({
            query: ({ data }) => ({
                url: "set-password",
                method: "PUT",
                body: data,
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(
                    queryFulfilled,
                    "",
                    "Your password has been successfully updated"
                );
            },
        }),
    })
})
export const {
    useResetPasswordMutation,
} = authApi;