import { CreatePaymentRequest, TagTypes, PaymentType, PaymentResponse } from "@/types/payment.dt";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const paymentTagMap: Record<PaymentType, TagTypes> = {
  shop: 'Product',
  booking: 'Booking',
  experience: 'Experience',
  membership: 'Membership',
  order: 'Order',
};

export const paymentsApi = createApi({
  reducerPath: 'paymentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}payments/`,
    prepareHeaders: (headers, { getState }) => {
      return headers;
    },
  }),
  tagTypes: ['Payment', 'Product', 'Booking', 'Experience', 'Membership', 'Order'],
  endpoints: (builder) => ({

    // Create product payment (matches ProductPaymentMixin)
    createProductPayment: builder.mutation<PaymentResponse, CreatePaymentRequest>({
      query: (paymentData) => ({
        url: 'create_product_payment/',
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: (result, error, arg) => {
        const tag = paymentTagMap[arg.payment_type];
        return [{ type: tag as TagTypes }];
      }
    }),

    // Create cart payment (matches CartPaymentMixin)
    createCartPayment: builder.mutation<PaymentResponse, {}>({
      query: () => ({
        url: 'create_cart_payment/',
        method: 'POST',
        body: {},
      }),
      invalidatesTags: ['Product', 'Order']
    }),

    // Check payment status (matches your backend)
    checkPaymentStatus: builder.query<PaymentResponse, string>({
      query: (paymentId) => `${paymentId}/status/`,
      async onQueryStarted(paymentId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.status === 'completed' && data.payment_type in paymentTagMap) {
            const tag = paymentTagMap[data.payment_type];
            dispatch(paymentsApi.util.invalidateTags([{ type: tag }]));
          }
        } catch (error) {
          console.error('Payment status check failed:', error);
        }
      }
    }),

    // Get payment history (matches your list() method)
    getPaymentHistory: builder.query<PaymentResponse[], { 
      payment_type?: PaymentType; 
      status?: string 
    }>({
      query: ({ payment_type, status } = {}) => {
        const params = new URLSearchParams();
        if (payment_type) params.append('type', payment_type); 
        if (status) params.append('status', status);
        return `?${params.toString()}`; 
      },
      providesTags: ['Payment']
    }),

    // Retry payment (matches CartPaymentMixin)
    retryPayment: builder.mutation<PaymentResponse, string>({
      query: (paymentId) => ({
        url: `${paymentId}/retry/`,
        method: 'POST',
      }),
      invalidatesTags: ['Payment']
    })

  })
});

export const { 
  useCreateProductPaymentMutation,
  useCreateCartPaymentMutation,
  useCheckPaymentStatusQuery, 
  useGetPaymentHistoryQuery,
  useRetryPaymentMutation
} = paymentsApi;