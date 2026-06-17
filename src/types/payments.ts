
//type definition for status of request
export type RequestStatus = "processing" | "completed";


//type definition of response after a payment
export interface PaymentResponse {
    message: string
}

//type definition of the payment record payload
export interface PaymentRecord {
    fingerprint: string;
    status: RequestStatus;
    response?: PaymentResponse;
    statusCode?: number;
    promise?: Promise<PaymentResponse>;
    createdAt: number;

}