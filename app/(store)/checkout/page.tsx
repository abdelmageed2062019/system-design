// app/(store)/checkout/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogiMartStore } from '@/features/cart/store/useLogiMartStore';
import { checkoutSchema, CheckoutFormData } from '@/features/checkout/schemas/checkoutSchema';
import { ShippingStep } from '@/features/checkout/components/ShippingStep';
import { PaymentStep } from '@/features/checkout/components/PaymentStep';
import { ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const [step, setStep] = useState<number>(1);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  const cartItems = useLogiMartStore((state) => state.cartItems);
  const clearCart = useLogiMartStore((state) => state.clearCart);

  const totalCost = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
    defaultValues: {
      shipping: { fullName: '', address: '', city: '', phone: '' },
      payment: { paymentMethod: 'CARD' },
    },
  });

  // Validate the active step before moving forward.
  const handleNextStep = async () => {
    const fieldToValidate = step === 1 ? 'shipping' : 'payment';
    const isStepValid = await methods.trigger(fieldToValidate);

    if (isStepValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Simulate the final payment request while keeping form state intact.
  const onFinalSubmit = async () => {
    setPaymentError(null);

    try {
      // Simulate a payment gateway network request.
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Randomize success and failure to test cart retention behavior.
          if (Math.random() > 0.4) {
            resolve(true);
          } else {
            reject(new Error('Insufficient card balance. Please choose another payment method.'));
          }
        }, 1500);
      });

      // Only clear the cart after a successful payment.
      clearCart();
      setOrderSuccess(true);
    } catch (error: unknown) {
      // Keep the cart and form data untouched when payment fails.
      setPaymentError(
        error instanceof Error ? error.message : 'The payment transaction failed.',
      );
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <h1 className="text-lg font-bold text-slate-900">Checkout</h1>
            <Link
              href="/checkout/docs"
              className="text-xs font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2"
            >
              Docs
            </Link>
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center space-y-4 border border-slate-100">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck size={36} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your order has been confirmed.</h2>
          <p className="text-sm text-slate-500">Payment was processed securely and your shipment is now being prepared for fulfillment.</p>
          <a href="/products" className="block w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">
            Return to Store
          </a>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">Checkout</h1>
          <Link
            href="/checkout/docs"
            className="text-xs font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2"
          >
            Docs
          </Link>
        </div>
      </header>
      <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Main form area */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          {/* Step progress */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <span className={`text-sm font-bold ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>1. Shipping</span>
            <div className="h-0.5 w-16 bg-slate-100 flex-1 mx-4" />
            <span className={`text-sm font-bold ${step === 2 ? 'text-blue-600' : 'text-slate-400'}`}>2. Payment</span>
          </div>

          {paymentError && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-xs font-semibold mb-4 border border-rose-100">
              {paymentError}
            </div>
          )}

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onFinalSubmit)} className="space-y-6">
              {step === 1 ? <ShippingStep /> : <PaymentStep />}

              <div className="flex justify-between pt-4 border-t border-slate-50">
                {step > 1 && (
                  <button type="button" onClick={handlePrevStep} className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50">
                    Back
                  </button>
                )}

                {step < 2 ? (
                  <button type="button" onClick={handleNextStep} className="mr-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700">
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={methods.formState.isSubmitting || cartItems.length === 0}
                    className="mr-auto px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 disabled:opacity-50"
                  >
                    {methods.formState.isSubmitting ? 'Processing secure payment...' : `Confirm and Pay $${totalCost}`}
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>

        {/* Invoice summary */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 h-fit space-y-4">
          <h3 className="font-bold text-slate-900 border-b pb-2 text-sm">Invoice Summary</h3>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {cartItems.map(item => (
              <div key={item.productId} className="flex justify-between text-xs text-slate-600 font-medium">
                <span className="line-clamp-1 w-2/3">{item.product.title}</span>
                <span className="font-mono">${item.product.price} × {item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Grand Total:</span>
            <span className="font-mono text-base text-blue-600">${totalCost}</span>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
}
