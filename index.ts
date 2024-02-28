const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("./config/dotenv.ts");
const adminRouter = require("./routes/admin.ts");
const userRouter = require("./routes/user.ts");

const PORT = process.env.PORT || 3000;
console.log("Port: ", process.env.PORT);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.listen(PORT, function () {
  console.log(`Server listening at port ${PORT}`);
});
