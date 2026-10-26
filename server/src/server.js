import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import surveyRoutes from "./routes/survey.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Server is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/surveys", surveyRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});