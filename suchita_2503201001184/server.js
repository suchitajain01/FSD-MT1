const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Initial in-memory data array
let students = [
  {
    id: 201,
    rollNumber: "CSE2401",
    name: "Aarav Sharma",
    branch: "CSE",
    semester: 3,
    email: "aarav@example.com"
  },
  {
    id: 202,
    rollNumber: "ECE2402",
    name: "Diya Verma",
    branch: "ECE",
    semester: 3,
    email: "diya@example.com"
  },
  {
    id: 203,
    rollNumber: "CSE2403",
    name: "Kabir Singh",
    branch: "CSE",
    semester: 3,
    email: "kabir@example.com"
  }
];

// Counter for generating unique numeric IDs
let nextId = 204;

// Helper function to validate student fields
function validateStudent(data) {
  const { rollNumber, name, branch, semester, email } = data;
  if (
    !rollNumber || typeof rollNumber !== 'string' ||
    !name || typeof name !== 'string' ||
    !branch || typeof branch !== 'string' ||
    semester === undefined || typeof semester !== 'number' ||
    !email || typeof email !== 'string'
  ) {
    return false;
  }
  return true;
}

// ==========================================
// 1. GET all records
// ==========================================
app.get('/api/students', (req, res) => {
  res.status(200).json(students);
});

// ==========================================
// 6. Filter records by branch (Case-Insensitive)
// MUST be placed BEFORE /api/students/:id
// ==========================================
app.get('/api/students/filter', (req, res) => {
  const { branch } = req.query;

  if (!branch) {
    return res.status(400).json({ message: "Branch query parameter is required." });
  }

  const filteredStudents = students.filter(
    (student) => student.branch.toLowerCase() === branch.toLowerCase()
  );

  res.status(200).json(filteredStudents);
});

// ==========================================
// 3. GET record by ID
// ==========================================
app.get('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ message: `Student with ID ${id} not found.` });
  }

  res.status(200).json(student);
});

// ==========================================
// 2. POST a new record
// ==========================================
app.post('/api/students', (req, res) => {
  if (!validateStudent(req.body)) {
    return res.status(400).json({
      message: "Invalid input. Ensure rollNumber, name, branch, email (strings) and semester (number) are provided."
    });
  }

  // Optional: Check for duplicate rollNumber
  const duplicate = students.find(
    (s) => s.rollNumber.toLowerCase() === req.body.rollNumber.toLowerCase()
  );
  if (duplicate) {
    return res.status(400).json({ message: "Roll number already exists." });
  }

  const newStudent = {
    id: nextId++,
    rollNumber: req.body.rollNumber,
    name: req.body.name,
    branch: req.body.branch,
    semester: req.body.semester,
    email: req.body.email
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// ==========================================
// 4. PUT / update a record
// ==========================================
app.put('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: `Student with ID ${id} not found.` });
  }

  if (!validateStudent(req.body)) {
    return res.status(400).json({
      message: "Invalid input. All fields (rollNumber, name, branch, semester, email) are required with valid types."
    });
  }

  // Update the record while keeping the original numeric ID
  students[index] = {
    id: id,
    rollNumber: req.body.rollNumber,
    name: req.body.name,
    branch: req.body.branch,
    semester: req.body.semester,
    email: req.body.email
  };

  res.status(200).json(students[index]);
});

// ==========================================
// 5. DELETE a record
// ==========================================
app.delete('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ message: `Student with ID ${id} not found.` });
  }

  const deletedStudent = students.splice(index, 1);
  res.status(200).json({
    message: `Student with ID ${id} deleted successfully.`,
    deletedRecord: deletedStudent[0]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});