
import type { PaymentRecord } from "../types/payments.ts";

export const idempotencyStore = new Map<string, PaymentRecord>();