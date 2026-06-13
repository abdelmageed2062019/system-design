import { z } from 'zod'

export const shippingSchema = z.object({
     fullName: z.string().min(3, 'الاسم الكامل مطلوب (3 أحرف على الأقل)'),
     address: z.string().min(10, 'العنوان بالتفصيل مطلوب (10 أحرف على الأقل)'),
     city: z.string().min(2, 'المدينة مطلوبة'),
     phone: z.string().regex(/^01[0125]\d{8}$/, 'رقم الهاتف يجب أن يكون رقم مصري صحيح (مثال: 01012345678)'),
});

export const paymentSchema = z.object({
     paymentMethod: z.enum(['CARD', 'COD', 'VALU'], {
          message: 'يرجى اختيار وسيلة دفع مدعومة',
     }),
});


export const checkoutSchema = z.object({
     shipping: shippingSchema,
     payment: paymentSchema,
});


export type CheckoutFormData = z.infer<typeof checkoutSchema>;
