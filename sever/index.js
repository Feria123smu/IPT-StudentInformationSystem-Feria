const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const mangoose = require("mongoose");
const User = require("./model/usermodel");
const Student = require("./model/studentmodel");
const { error } = require("console");
 
const app = express();
const port = 1337;

app.use(cors());
app.use(express.json());

mangoose
  .connect("mongodb://localhost:27017/SIS-db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection Error", err));
 
app.post("/add-user-db", async (req, res) => {
       const { name, email, password } = req.body;

   try {
   
     const newUser = new User({ name, email, password });
     await newUser.save();
     res.status(201).json({ message: "User added successfully to database!" });
   } catch (error) {
     console.error("Error adding user to database", error);
     res.status(500).json({ message: "Error adding user to database" });
   }
 }); 


// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

 
// view users from db
 app.get("/users-db", async (req, res) => {
   try {
     const users = await User.find();
     res.status(200).json(users);
   } catch (error) {
     console.error("Error fetching users from database", error);
     res.status(500).json({ error: "Error fetching users from database" });
   }
 });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});
 
app.get('/user/:name', (req, res) => {
  const name = req.params.name;
  res.send(`Welcome, ${name}!`);
});
 
app.post("/add-user", async (req, res) => {
  const newUser = req.body;

  try {
    // Save to MongoDB
    const user = new User(newUser);
    await user.save();

    // Save to data.json
    const data = fs.readFileSync("data.json", "utf8");
    const users = JSON.parse(data);
    users.push(newUser);
    fs.writeFileSync("data.json", JSON.stringify(users, null, 2));

    res.send("User added successfully to both database and file!");
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send("Error adding user");
  }
});



app.post("/add-student", async (req, res) => {
  const newStudent = req.body;

  try {
    const student = new Student(newStudent);
    await student.save();

    // Save to student.json
    const data = fs.readFileSync("student.json", "utf8");
    const students = JSON.parse(data);
    students.push(newStudent);
    fs.writeFileSync("student.json", JSON.stringify(students, null, 2));

    res.status(201).json({ message: "Student added successfully to database and file!" });
  } catch (error) {
    console.error("Error adding student to database", error);
    res.status(500).json({ message: "Error adding student to database" });
  }
});



app.put("/edit-user/:index", async (req, res) => {
  const index = parseInt(req.params.index, 10);
  const updatedUser = req.body;

  try {
    const users = await User.find();
    if (!users[index]) {
      return res.status(404).send("User not found");
    }

    const userDoc = users[index];
    userDoc.name = updatedUser.name;
    userDoc.email = updatedUser.email;
    userDoc.password = updatedUser.password;
    await userDoc.save();

    const data = fs.readFileSync("data.json", "utf8");
    const jsonUsers = JSON.parse(data);

    if (!jsonUsers[index]) {
      return res.status(404).send("User not found in JSON file");
    }

    jsonUsers[index] = updatedUser;
    fs.writeFileSync("data.json", JSON.stringify(jsonUsers, null, 2));

    res.send("User updated successfully!");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});



app.delete("/delete-user/:index", async (req, res) => {
  const index = parseInt(req.params.index, 10);

  try {
    const users = await User.find();
    if (!users[index]) {
      return res.status(404).send("User not found");
    }

    const userId = users[index]._id;
    await User.findByIdAndDelete(userId);

    const data = fs.readFileSync("data.json", "utf8");
    const jsonUsers = JSON.parse(data);
    if (jsonUsers[index]) {
      jsonUsers.splice(index, 1);
      fs.writeFileSync("data.json", JSON.stringify(jsonUsers, null, 2));
    }

    res.send("User deleted successfully!");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
});

app.put("/edit-student/:index", async (req, res) => {
  const index = req.params.index;
  const updatedStudent = req.body;

  try {
    const students = await Student.find();
    if (!students[index]) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentId = students[index]._id;
    await Student.findByIdAndUpdate(studentId, updatedStudent);

    // Update student.json
    const data = fs.readFileSync("student.json", "utf8");
    const jsonStudents = JSON.parse(data);
    if (jsonStudents[index]) {
      jsonStudents[index] = updatedStudent;
      fs.writeFileSync("student.json", JSON.stringify(jsonStudents, null, 2));
    }

    res.status(200).json({ message: "Student updated successfully!" });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Error updating student" });
  }
});


app.delete("/delete-student/:index", async (req, res) => {
  const index = req.params.index;

  try {
    const students = await Student.find();
    if (!students[index]) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentId = students[index]._id;
    await Student.findByIdAndDelete(studentId);

    // Update student.json
    const data = fs.readFileSync("student.json", "utf8");
    const jsonStudents = JSON.parse(data);
    if (jsonStudents[index]) {
      jsonStudents.splice(index, 1);
      fs.writeFileSync("student.json", JSON.stringify(jsonStudents, null, 2));
    }

    res.status(200).json({ message: "Student deleted successfully!" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Error deleting student" });
  }
});




app.get("/users", async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});



app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error("Error fetching students from database", error);
    res.status(500).json({ error: "Error fetching students from database" });
  }
});


app.get('/calculate/:num1/:num2', (req, res) => {

  const num1 = parseInt(req.params.num1);
  const num2 = parseInt(req.params.num2);
 
  if (isNaN(num1) || isNaN(num2)) {
    return res.send('Please provide valid numbers.');
  }
 
  const sum = num1 + num2;
  res.send(`The sum of ${num1} and ${num2} is ${sum}`);
 
});


app.get('/search', (req, res) => {

  const query = req.query.q;
 
  if (!query) {
    return res.send('Please provide a search query using ?q=your_query');
  }
 
  res.send(`You searched for: ${query}`);

});

// Image upload route
app.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Return the file path that can be used to access the image
    const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    res.json({ 
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading image' });
  }
});


app.listen(port, () =>{

    console.log(`Server running on ${port}`)

});