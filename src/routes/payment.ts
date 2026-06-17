import express from "express"


const router = express.Router();

router.post("/process-payment", async (req, res) => {
    console.log("payment processed!");

    return res.status(200).json({
        message: "payment processed!"
    })
})

export default router;