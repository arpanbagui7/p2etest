import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import eventRouter from "./routes/event.routes";
import ErrorHandler from "./utils/errorHandler";

const app = express();
const port = process.env.PORT || 6050;

//Middlewares
app.use(cors());
app.use(bodyParser.json());

//Routes
app.use("/api/event", eventRouter);

//Common error handler
app.use(ErrorHandler);

//Start server
app.listen(port, () => {
  console.log(`Server is up and running on ${port} 🚀`);
});
