import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://127.0.0.1:8000",
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
        responseHandler: async (response) => {
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("application/json")) {
                return response.json(); // Parse JSON if it's JSON
            } else {
                const text = await response.text(); // Otherwise, parse as text
                throw { status: "NON_JSON_RESPONSE", data: text }; // Custom error
            }
        },
    }),
    refetchOnFocus: true,
    tagTypes: ["Disease"],
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (credentials) => ({
                url: "/api/v1/register",
                method: "POST",
                body: credentials,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: "/api/v1/login",
                method: "POST",
                body: credentials,
                headers: {
                    "Content-Type": "application/json",
                },
            }),
        }),

        changePassword: builder.mutation({
            query: ({ password, current_password }) => ({
                url: `/api/change-password`,
                method: "POST",
                body: { password, current_password },
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            transformResponse: (response) => {
                return (
                    response || { message: "Password changed successfully!" }
                );
            },
        }),
        getSymptoms: builder.query({
            query: () => ({
                url: "/api/v1/symptoms",
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }),
        }),
        predictDisease: builder.query({
            query: ({ symptoms }) => ({
                url: "/api/v1/predict",
                method: "POST",
                body: { symptoms },
            }),
        }),
        getLoggedInUser: builder.query({
            query: () => ({
                url: "/api/v1/user",
                method: "GET",
            }),
        }),
    }),
});
export const {
    useRegisterMutation,
    useLoginMutation,
    useChangePasswordMutation,
    useGetSymptomsQuery,
    useLazyPredictDiseaseQuery,
    useGetLoggedInUserQuery,
} = apiSlice;
