const express = require('express');
const prisma = require("./lib/prisma");

const app = express();
const PORT = process.env.PORT || 3000;

const questionsRouter = require("./routes/questions");
const authRouter = require("./routes/auth");

// Middleware to parse JSON bodies (will be useful in later steps)
app.use(express.json());

app.use("/api/questions", questionsRouter);
app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.json({msg:"Not found"});
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});