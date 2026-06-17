
import type { PaymentResponse } from "../types/payments.js";

export async function processPayment (amount: number, currency: string): Promise<PaymentResponse> {

    //simulate real payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return {
        message: `Charged ${amount} ${currency}`
    }
}