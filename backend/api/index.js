const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("../database/db");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const authRoute = require("../routes/authRoute");
const fileITRRoute = require("../routes/fileITRRoute");
const capitalGainRoute = require("../routes/capitalGainRoute");
const taxSavingRoute = require("../routes/taxSavingRoute");
const calculateIncomeRoute = require("../routes/calculateIncomeRoute");
const verificationApiRoute = require("../routes/verificationApiRoute");
const adminRoute = require("../routes/adminRoute");
const walletRoute = require("../routes/walletRoutes");
const itrRoute = require("../routes/itrRoutes");
const port = 4000;

dotenv.config();
app.use(
  cors({
    origin: process.env.frontend_url, // Replace with your frontend origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    headers: ["Content-Type", "Authorization"],
  })
);
connectDB();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/fillDetail", fileITRRoute);
app.use("/api/v1/capitalGain", capitalGainRoute);
app.use("/api/v1/taxSaving", taxSavingRoute);
app.use("/api/v1/calculateIncome", calculateIncomeRoute);
app.use("/api/v1/verificationApi", verificationApiRoute);
app.use("/api/v1/adminApi", adminRoute);
app.use("/api/v1/wallet", walletRoute);
app.use("/api/v1/itr", itrRoute);
app.get("/", (req, res) => {
  res.send("black burn backend running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
