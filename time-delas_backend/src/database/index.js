const mongoose = require("mongoose");

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;
console.log("DB VARIABLES", DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME);

mongoose.connect(
  `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=${DB_NAME}&w=1`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("error", () => console.log("Connection error: "));
mongoose.connection.once("open", () =>
  console.log("DB Connected! ENV: ", process.env.NODE_ENV)
);

module.exports = mongoose;
