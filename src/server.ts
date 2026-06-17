import express from "express";
import paymentRoutes from "./routes/payment";

const app = express();

app.use(express.json());
const PORT = 3000;

app.use(paymentRoutes);

app.listen(PORT, () => {
    return console.log(`app is running on port ${PORT}`);

})

app.get('/', (req, res) => {
    res.send("api running")
})
