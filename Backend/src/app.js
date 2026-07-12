require("dotenv").config({ quiet: true });
const express = require("express");
const session = require("express-session");
const apiRoutes = require("./routes");
const corsMiddleware = require("./middleware/cors");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "student-management-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax"
    }
  })
);

app.get("/", (req, res) => {
  res.json({
    data: {
      service: "student-management-api",
      status: "ok",
      apiBaseUrl: "/api",
      frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
      endpoints: ["/api/health", "/api/students", "/api/classes", "/api/subjects", "/api/accounts"]
    }
  });
});

app.use("/api", apiRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
