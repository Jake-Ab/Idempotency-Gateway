import express from "express"
import { generateFingerprint } from "../utils/fingerprint";
import { processPayment } from "../services/paymentService";
import { idempotencyStore } from "../store/idempotencyStore";


const router = express.Router();

router.post("/process-payment", async (req, res) => {

    // main payment processing business logic
    console.log("payment processe started");

    // read idemptency key from request hearder
    const key = req.header("Idempotency-key");
    // validate key
    if (!key) {
        return res.status(400).json({
            error: "idempotency key header required!"
        })
    }


    // create a payload fingerprint by hashing the request body
    const fingerprint = generateFingerprint(req.body);

    // check whether idempotency key already exists in store 
    const existing = idempotencyStore.get(key);
    if (existing){
        //handle existing key (satisfying user story 3: different request, same key)
        if (existing.fingerprint !== fingerprint){
            return res.status(409).json({
                error: "Idempotency key already used for different request bosy!"
            });
        }

        //handle when request has already been processed (user story 2: duplicate attempt)
        if (existing.status === "completed"){
            res.setHeader("X-Cache-Hit", "true");
            return res.status(existing.statusCode!).json(existing.response);
        }

        //handle in-flight request. when request B arrives while request A is stikk processing (bonus user story )
        if (existing.status === "processing"){
            const response = await existing.promise;
            res.setHeader("X-Cache-Hit", "true");
            return res.status(200).json(response);
        }
    }


    //process new request (happy path)
    const {amount, currency } = req.body;
    //create a payment promise
    const paymentPromise = processPayment(amount, currency);

    //store the promise in the store immediately to prevent race condition
    idempotencyStore.set(key, {
        fingerprint,
        status: "processing",
        promise: paymentPromise,
        createdAt: Date.now()
    });

    //wait for the payment to finish processing
    const response = await paymentPromise;
    //update the store immediately
    idempotencyStore.set(key, {
        fingerprint,
        status: "completed",
        response,
        statusCode: 200,
        createdAt: Date.now()
    });

    //return the processed response
    return res.status(200).json(response);

})

export default router;