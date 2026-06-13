import { z } from 'zod'

export const shippingSchema = z.object({
     fullName: z.string().min(3, 'Full name is required (minimum 3 characters)'),
     address: z.string().min(10, 'Full address is required (minimum 10 characters)'),
     city: z.string().min(2, 'City is required'),
     phone: z.string().regex(/^01[0125]\d{8}$/, 'Phone number must be a valid Egyptian number (example: 01012345678)'),
});

export const paymentSchema = z.object({
     paymentMethod: z.enum(['CARD', 'COD', 'VALU'], {
          message: 'Please select a supported payment method',
     }),
});


export const checkoutSchema = z.object({
     shipping: shippingSchema,
     payment: paymentSchema,
});


export type CheckoutFormData = z.infer<typeof checkoutSchema>;
