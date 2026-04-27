const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const authenticate = require("../middleware/auth");
const isOwner = require("../middleware/isOwner");

// Apply authentication to ALL routes in this router
router.use(authenticate);


// GET /questions
// List all questions
router.get("/", async (req, res) => {
  const { keyword } = req.query;

  const where = keyword 
    ? { question: { contains: keyword } } 
    : {};

  const questionsList = await prisma.question.findMany({ 
    where,
    orderBy: { id: "asc" }
  });

  res.json(questionsList);

});

// GET /questions/:id
// Show a specific question
router.get("/:qId", async (req, res) => {
  const qId = Number(req.params.qId);

  const question = await prisma.question.findUnique({
    where: { id: qId }
  });

  if (!question) {
    return res.status(404).json({ message: "question not found" });
  }

  res.json(question);
});

// POST /questions
// Create a new question
router.post("/", async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({
      message: "question and answer are required"
    });
  }

  const newQuestion = await prisma.question.create({
    data: { question, answer, userId: req.user.userId}
  });

  res.status(201).json(newQuestion);
});

// PUT /questions/:qId
// Edit a question
router.put("/:qId", isOwner, async (req, res) => {
  const qId = Number(req.params.qId);
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({
      message: "question and answer are required"
    });
  }

  const questionObject = await prisma.question.findUnique({
    where: { id: qId }
  });

  if (!questionObject) {
    return res.status(404).json({ message: "Question not found" });
  }

  const updatedQuestion = await prisma.question.update({
    where: { id: qId },
    data: { question, answer }
  });

  res.json(updatedQuestion);
});

// DELETE /questions/:qId
// Delete a question
router.delete("/:qId", isOwner, async (req, res) => {
  const qId = Number(req.params.qId);

  const questionObject = await prisma.question.findUnique({
    where: { id: qId }
  });

  if (!questionObject) {
    return res.status(404).json({ message: "Question not found" });
  }

  const deletedQuestion = await prisma.question.delete({
    where: { id: qId }
  });

  res.json({
    message: "Question deleted successfully",
    question: deletedQuestion
  });
});


module.exports = router;
