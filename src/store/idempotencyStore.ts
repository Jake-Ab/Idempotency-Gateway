
import type { PaymentRecord } from "../types/payments.ts";

export const idempotencyStore = new Map<string, PaymentRecord>();


//developer choice implementation | TTL cleanup
//set TTL at 24 hours
const TTL = 24 * 60 * 60 * 1000;

//for every 60 seconds, check which key is older than 24 hours and delete it.
setInterval(() => {
    const now = Date.now();

    for ( const [key, value] of idempotencyStore){
        if (now - value.createdAt > TTL){
            idempotencyStore.delete(key);
        }
    }
}, 60 * 1000)