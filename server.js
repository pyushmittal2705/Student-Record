const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Dummy data array
let students = [
  { rollNumber: '0914', name: 'Naman Rohilla' },
  { rollNumber: '0905', name: 'Sandeep Kumar' },
];

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// GET all students - render an HTML page
app.get('/students', (req, res) => {
  const studentList = students.map(student => `<li>${student.name} - Roll Number: ${student.rollNumber}</li>`).join('');

  const html = `
    <h1>Student List</h1>
    <ul>
      ${studentList}
    </ul>
  `;

  res.send(html);
});

// GET a student by Roll Number
app.get('/students/:rollNumber', (req, res) => {
  const rollNumber = req.params.rollNumber;
  const student = students.find(s => s.rollNumber === rollNumber);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.json(student);
});

// POST a new student
app.post('/students', (req, res) => {
  const { name, rollNumber } = req.body;

  if (!name || !rollNumber) {
    return res.status(400).json({ error: 'Name and Roll Number are required' });
  }

  const existingStudent = students.find(s => s.rollNumber === rollNumber);

  if (existingStudent) {
    return res.status(409).json({ error: 'Student with the provided roll number already exists' });
  }

  const newStudent = {
    name,
    rollNumber,
  };

  students.push(newStudent);

  res.status(201).json(newStudent);
});

// PUT (update) a student by Roll Number
app.put('/students/:rollNumber', (req, res) => {
  const rollNumber = req.params.rollNumber;
  const { name } = req.body;

  const student = students.find(s => s.rollNumber === rollNumber);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  student.name = name || student.name;

  res.json(student);
});

// DELETE a student by Roll Number
app.delete('/students/:rollNumber', (req, res) => {
    const rollNumber = req.params.rollNumber;
    const initialLength = students.length;
    students = students.filter(s => s.rollNumber !== rollNumber);
  
    if (students.length === initialLength) {
      return res.status(404).json({ error: 'Student not found' });
    }
  
    res.json({ message: 'Student deleted successfully' });
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});