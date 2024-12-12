const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add a new task
exports.addTask = async (req, res) => {
  try {
    const { title, description, rank, userId } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        rank,
        userId,
      },
    });

    res.status(201).json({ message: "Task added successfully", task });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Fetch all tasks for a specific user
exports.getUserTasks = async (req, res) => {
  try {
    const { userId } = req.params;

    const tasks = await prisma.task.findMany({
      where: {
        userId: parseInt(userId),
      },
      orderBy: {
        rank: 'asc', // Order tasks by rank (optional)
      },
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
