require("dotenv").config()
const mongodb = require("../config/database");
const appRouter = require("../routes/app");
require("../utils/cron");
const cors = require("cors");
const app = require("express")();
// Enable CORS for all origins
app.use(cors());

app.use("/api", appRouter);

const connectMongo = async () => {
  try {
    await mongodb();
    console.log("Database connected");
    app.listen(process.env.PORT,process.env.SERVER_ADDRESS, () => {
      console.log(`Server started at http://${process.env.SERVER_ADDRESS}:${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};
connectMongo();

module.exports = app
