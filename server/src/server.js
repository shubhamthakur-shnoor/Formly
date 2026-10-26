import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import surveyRoutes from "./routes/survey.js";
import questionRoutes from "./routes/question.js";
import publicSurveyRoutes from "./routes/publicSurvey.js";
import responseRoutes from "./routes/response.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Server is running");
});

app.use("/api/public/surveys", responseRoutes);
app.use("/api/public/surveys", publicSurveyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api", questionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});