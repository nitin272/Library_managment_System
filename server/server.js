const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectMongoDB = require("./config/database");
const routes = require("./routes/Routes.js")

// const issuanceRoutes = require("./routes/issuanceRoutes"); // Uses SQL

const User = require("./routes/Auth")
const PORT = process.env.PORT || 5000;
const app = express();

// Middleware setup
app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:4500",
  "http://localhost:5000"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: "GET,PUT,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Connect to MongoDB
connectMongoDB();

app.use('/', routes);

// // Routes
// route.use("/members", memberRoutes); // Users stored in MongoDB
// route.use("/books", bookRoutes); // Books stored in SQL
// route.use("/issuance", issuanceRoutes); // Issuance records stored in SQL

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
