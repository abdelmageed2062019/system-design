"use client";

import { ShoppingCart, ShieldCheck, CreditCard, Layers } from "lucide-react";

const codeStyles = "overflow-x-auto rounded-xl border border-slate-200 bg-[#0f172a] p-5 text-sm leading-relaxed text-slate-50";

function CodeBlock({ children }: { children: string }) {
  return (
    <div className={codeStyles}>
      <pre className="font-mono">{children}</pre>
    </div>
  );
}

function Section({
  id,
  title,
  description,
  code,
  codeFirst,
}: {
  id: string;
  title: string;
  description: string;
  code: string;
  codeFirst?: boolean;
}) {
  const content = (
    <>
      {codeFirst ? (
        <>
          <CodeBlock>{code}</CodeBlock>
          <div className="flex flex-col justify-start">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-start">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
          </div>
          <CodeBlock>{code}</CodeBlock>
        </>
      )}
    </>
  );

  return (
    <section id={id} className="scroll-mt-20">
      <div className="grid gap-8 lg:grid-cols-2">{content}</div>
    </section>
  );
}

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-green-600 text-xs font-bold text-white">
              C
            </div>
            <span className="text-sm font-semibold text-slate-900">Multi-step checkout</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
            <a href="#multi-step" className="hover:text-slate-900">Multi-step</a>
            <a href="#validation" className="hover:text-slate-900">Validation</a>
            <a href="#error-recovery" className="hover:text-slate-900">Error Recovery</a>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-16">
          <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-green-600">
            <ShoppingCart className="size-4" />
            Checkout pattern
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
            Multi-step checkout with validation
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
            How the checkout page implements a two-step shipping/payment flow with
            react-hook-form, Zod validation, simulated payment with error handling,
            and cart state retention on failure.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <Layers className="size-5 text-blue-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Multi-step form</div>
              <div className="mt-0.5 text-xs text-slate-500">Shipping → Payment flow</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <ShieldCheck className="size-5 text-green-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Zod validation</div>
              <div className="mt-0.5 text-xs text-slate-500">Typed schemas with error messages</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <CreditCard className="size-5 text-rose-500" />
              <div className="mt-2 text-sm font-semibold text-slate-900">Simulated payment</div>
              <div className="mt-0.5 text-xs text-slate-500">60% success, retains cart on failure</div>
            </div>
          </div>
        </header>

        <div className="space-y-20">
          <Section
            id="multi-step"
            title="Two-step form with independent validation"
            description="The checkout uses a step counter (useState(1)) to show ShippingStep or PaymentStep. Each step validates its own fields using methods.trigger('shipping') or methods.trigger('payment'). The user can navigate back without re-validating. Only on the final step does the form handleSubmit run the full schema."
            code={`const [step, setStep] = useState(1);

const methods = useForm<CheckoutFormData>({
  resolver: zodResolver(checkoutSchema),
  mode: 'onChange',
  defaultValues: {
    shipping: {
      fullName: '', address: '',
      city: '', phone: '',
    },
    payment: {
      paymentMethod: 'CARD',
    },
  },
});

// Validate only the visible step before advancing
const handleNextStep = async () => {
  const fieldToValidate =
    step === 1 ? 'shipping' : 'payment';
  const isStepValid =
    await methods.trigger(fieldToValidate);

  if (isStepValid) {
    setStep((prev) => prev + 1);
  }
};

return (
  <FormProvider {...methods}>
    <form onSubmit={methods.handleSubmit(onFinalSubmit)}>
      {step === 1 ? <ShippingStep /> : <PaymentStep />}

      <div className="flex justify-between">
        {step > 1 && (
          <button onClick={handlePrevStep}>Back</button>
        )}

        {step < 2 ? (
          <button onClick={handleNextStep}>Next</button>
        ) : (
          <button type="submit">Confirm and Pay</button>
        )}
      </div>
    </form>
  </FormProvider>
);`}
            codeFirst={true}
          />

          <Section
            id="validation"
            title="Zod schemas with per-field errors"
            description="Each step has its own sub-schema. The shipping schema validates fullName (min 3), address (min 10), city (min 2), and phone (Egyptian number regex). The payment schema validates paymentMethod as a enum (CARD, COD, VALU). Errors are displayed inline below each field using formState.errors from react-hook-form context."
            code={`// features/checkout/schemas/checkoutSchema.ts
import { z } from 'zod';

export const shippingSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name is required (min 3 characters)'),
  address: z
    .string()
    .min(10, 'Full address is required (min 10 characters)'),
  city: z
    .string()
    .min(2, 'City is required'),
  phone: z
    .string()
    .regex(
      /^01[0125]\\d{8}$/,
      'Must be a valid Egyptian number',
    ),
});

export const paymentSchema = z.object({
  paymentMethod: z
    .enum(['CARD', 'COD', 'VALU'], {
      message: 'Select a supported payment method',
    }),
});

export const checkoutSchema = z.object({
  shipping: shippingSchema,
  payment: paymentSchema,
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// In the component, errors render like:
{errors.shipping?.fullName && (
  <p className="text-rose-500 text-xs mt-1">
    {String(errors.shipping.fullName.message)}
  </p>
)}`}
            codeFirst={false}
          />

          <Section
            id="error-recovery"
            title="Cart retention on simulated payment failure"
            description="The onFinalSubmit simulates a payment gateway with a 1.5s delay and 60% success rate. On failure, the error message is displayed but the cart and form data remain untouched — the user can retry or change payment method. Only on success does clearCart() run. The invoice sidebar shows the cart summary with live total calculation."
            code={`const onFinalSubmit = async () => {
  setPaymentError(null);

  try {
    // Simulate gateway request
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.4
          ? resolve(true)
          : reject(
              new Error('Insufficient card balance.'));
        // ^ 40% failure rate
      }, 1500);
    });

    // Only clear on success
    clearCart();
    setOrderSuccess(true);
  } catch (error) {
    // Cart and form data preserved
    setPaymentError(
      error instanceof Error
        ? error.message
        : 'Payment failed.',
    );
  }
};

// Invoice sidebar with live total
<aside className="bg-white p-5 rounded-2xl ...">
  <h3>Invoice Summary</h3>
  {cartItems.map(item => (
    <div key={item.productId}
      className="flex justify-between text-xs">
      <span>{item.product.title}</span>
      <span>\${item.product.price} x {item.quantity}</span>
    </div>
  ))}
  <div className="flex justify-between font-bold">
    <span>Grand Total:</span>
    <span>\${totalCost}</span>
  </div>
</aside>`}
            codeFirst={true}
          />
        </div>

        <footer className="mt-20 border-t border-slate-200 pt-8 text-center text-xs text-slate-400">
          Built with react-hook-form, Zod 4, and Zustand 5 cart persistence.
        </footer>
      </div>
    </main>
  );
}
