import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger_output.json" assert { type: "json" };
import patientRoutes from "./routes/patient.route.js";
import userRoutes from "./routes/user.route.js";
import doctorRoutes from "./routes/doctor.route.js";
import opdRoutes from "./routes/opd.route.js";
import ipdRoutes from "./routes/ipd.route.js";
import authRoutes from "./routes/auth.route.js";




dotenv.config();
connectDB();

const allowedOrigins = ['http://localhost:3000'];

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/patients", patientRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/opd", opdRoutes);
app.use("/api/ipd", ipdRoutes);
app.use("/api/auth", authRoutes);




const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
