# Checkout Feature

## Purpose

Owns the assessment of shipping and payment data during checkout.

## What Was Achieved

- Added a multi-step checkout flow for `/checkout`.
- Built separate UI steps for shipping and payment.
- Added Zod validation and typed `react-hook-form` integration.
- Preserved cart and form state during simulated payment failures.
- Converted the feature to English and aligned it with LTR layout.

## Current Structure

- `components/ShippingStep.tsx`: shipping form step.
- `components/PaymentStep.tsx`: payment selection step.
- `schemas/checkoutSchema.ts`: shared validation schema and form types.

## Notes

- The current payment flow is mocked for demonstration.
- The feature is ready for payment gateway integration and backend order APIs.
