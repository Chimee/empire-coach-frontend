import { dmApi } from "../dmApi";
import { getAuthorizationHeader } from "../../helpers/RtkQueryUtils";
import { handleQueryErrorAndSuccess } from "../../helpers/RtkQueryUtils";
export const settingAPi = dmApi.injectEndpoints({
    endpoints: (build) => ({
        getVehicle: build.query({
            query: () => ({
                url: `get-vehicle-make-models`,
                method: "GET",
                headers: getAuthorizationHeader()
            }),
            providesTags:["getVehicleApi"]

        }),
        updateVehicle: build.mutation({
            query: ({ body }) => ({

                url: `/update-vehicle-make-model`,
                method: "Put",
                body: body,
                headers: getAuthorizationHeader()
            }),
            invalidatesTags:["getVehicleApi"],
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(
                    queryFulfilled,
                    "",
                    "Vehicle Updated"
                );
            },
        }),
        createVehicle: build.mutation({
            query: ({ body }) => ({

                url: `/create-vehicle-make-model`,
                method: "POST",
                body: body,
                headers: getAuthorizationHeader()
            }),
            invalidatesTags:["getVehicleApi"],
            async onQueryStarted(_, { queryFulfilled }) {
                await handleQueryErrorAndSuccess(
                    queryFulfilled,
                    "",
                    "Vehicle created"
                );
            },
        })
    })
})
export const { useGetVehicleQuery, useUpdateVehicleMutation, useCreateVehicleMutation } = settingAPi 