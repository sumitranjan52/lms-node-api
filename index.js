const cors = require("cors");
const express = require("express");
const app = express();

const lmsApp = require("./routes/app");

/* Middlewares */
app.use(cors({ origin: "*" })); // CORS
app.use(express.json({ inflate: true, limit: "10mb" })); // JSON
app.use(express.urlencoded({ extended: true })); // url encoded key=val&key1=val1
app.use(express.static("public")); // static path

/* routes or endpoints */
app.use("/api", lmsApp);

app.get("/", (req, res) => {
  res.send(`Welcome to C-Cube`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(PORT));
