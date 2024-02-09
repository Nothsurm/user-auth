import { apiSlice } from "./apiSlice.js";
import { USERS_URL } from "../constants.js";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data,
            })
        }),

        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data,
            })
        }),

        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST'
            })
        }),

        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data
            })
        }),

        deleteProfile: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/profile/${userId}`,
                method: 'DELETE'
            })
        }),
    })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useProfileMutation,
    useDeleteProfileMutation,
} = userApiSlice