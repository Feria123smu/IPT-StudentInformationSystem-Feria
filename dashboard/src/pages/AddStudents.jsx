import "./AddStudents.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Button, TextField, Table, TableBody, TableRow, 
  TableCell, TableHead, Paper, TableContainer,
  Select, MenuItem, FormControl, InputLabel,
  Box, Alert, CircularProgress, Card, CardMedia, CardContent,
  Avatar, Typography
} from "@mui/material";

function AddStudents() {
  const [id, setId] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [middle, setMiddle] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [students, setStudents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [errors, setErrors] = useState({});

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const courseOptions = [
    "Civil Engineering",
    "Electrical Engineering",
    "Electronics Engineering",
    "Computer Engineering",
    "Architecture",
    "Information Technology",
    "Computer Science",
    "Library and Information Science"
  ];
  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];
  

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      
      if (!file.type.startsWith('image/') && !/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.name)) {
        setUploadError("Please select an image file");
        return;
      }

      

      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Auto upload the selected file
      handleUploadImage();
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      setUploadError("Please select an image first");
      return;
    }

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:1337/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setImageUrl(response.data.imageUrl);
      setSelectedFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.response?.data?.error || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setImageUrl("");
    setUploadError("");
  };

  const fetchUsers = () => {
    axios.get("http://localhost:1337/students")
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!id.trim()) {
      newErrors.id = "ID is required";
    } else if (isNaN(id) || parseInt(id) != id || parseInt(id) <= 0) {
      newErrors.id = "ID must be a positive integer";
    } else if (students.some((student, idx) => student.id == id && idx !== editIndex)) {
      newErrors.id = "ID must be unique";
    }
    if (!first.trim()) newErrors.first = "First name is required";
    if (!last.trim()) newErrors.last = "Last name is required";
    if (!course) newErrors.course = "Course is required";
    if (!year) newErrors.year = "Year is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  useEffect(() => { fetchUsers(); }, []);

  async function handleAddUser() {
    if (!validateForm()) return;
    try {
      await axios.post("http://localhost:1337/add-student", { id, first, last, middle, course, year, imageUrl });
      alert("Student added!");
      fetchUsers();
      clearForm();
    } catch (error) { console.error(error); }
  }

  function handleEdit(student, index) {
    setId(student.id);
    setFirst(student.first);
    setMiddle(student.middle);
    setLast(student.last);
    setCourse(student.course);
    setYear(student.year);
    setImageUrl(student.imageUrl || "");
    setEditIndex(index);
    // Clear the file input
    const input = document.getElementById('profile-image-input');
    if (input) input.value = '';
  }

  async function handleUpdateStudent() {
    if (!validateForm()) return;
    try {
      await axios.put(`http://localhost:1337/edit-student/${editIndex}`, { id, first, middle, last, course, year, imageUrl });
      alert("Student updated!");
      fetchUsers();
      clearForm();
      setEditIndex(null);
    } catch (error) { console.error(error); }
  }

  async function handleDeleteStudent(index) {
    const confirmDelete = window.confirm("Confirm to Delete");
    if (!confirmDelete) return;
    
    try {
      await axios.delete(`http://localhost:1337/delete-student/${index}`);
      alert("Student deleted!")
      fetchUsers();
      clearForm();


    } catch (error) { console.error(error); }
  }


  const clearForm = () => {
    setId(""); setFirst(""); setLast(""); setMiddle(""); setCourse(""); setYear("");
    setSelectedFile(null); setPreview(null); setImageUrl(""); setUploadError("");
    setErrors({});
    // Clear the file input
    const input = document.getElementById('profile-image-input');
    if (input) input.value = '';
  };

  return (
    <div className="AddStudents-container">
      <h1 className="add">Student Management</h1>

      <div className="adds">
        <div className="mui">
          <h3>{editIndex !== null ? "Edit Details" : "Register Student"}</h3>
          
          <TextField label="ID Number" fullWidth size="small" margin="dense" value={id} onChange={(e) => setId(e.target.value)} error={!!errors.id} helperText={errors.id} />
          <TextField label="First Name" fullWidth size="small" margin="dense" value={first} onChange={(e) => setFirst(e.target.value)} error={!!errors.first} helperText={errors.first} />
          <TextField label="Middle Name" fullWidth size="small" margin="dense" value={middle} onChange={(e) => setMiddle(e.target.value)} />
          <TextField label="Last Name" fullWidth size="small" margin="dense" value={last} onChange={(e) => setLast(e.target.value)} error={!!errors.last} helperText={errors.last} />
          <FormControl fullWidth size="small" margin="dense" error={!!errors.course}>
            <InputLabel>Course</InputLabel>
            <Select value={course} onChange={(e) => setCourse(e.target.value)} label="Course">
              {courseOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </Select>
            {errors.course && <div style={{color: 'red', fontSize: '0.75rem', marginTop: '3px'}}>{errors.course}</div>}
          </FormControl>
          <FormControl fullWidth size="small" margin="dense" error={!!errors.year}>
            <InputLabel>Year</InputLabel>
            <Select value={year} onChange={(e) => setYear(e.target.value)} label="Year">
              {yearOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </Select>
            {errors.year && <div style={{color: 'red', fontSize: '0.75rem', marginTop: '3px'}}>{errors.year}</div>}
          </FormControl>

          {/* Image Upload Section */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Profile Picture
            </Typography>
            
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="profile-image-input"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="profile-image-input">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                sx={{ mb: 1 }}
              >
                📁 Select Profile Picture
              </Button>
            </label>

            {selectedFile && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </Typography>
            )}

            {uploadError && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {uploadError}
              </Alert>
            )}

            {preview && (
              <Card sx={{ mb: 2, maxWidth: 200 }}>
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    Preview
                  </Typography>
                </CardContent>
                <CardMedia
                  component="img"
                  height="150"
                  image={preview}
                  alt="Preview"
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ pt: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      size="small" 
                      variant="contained" 
                      onClick={handleUploadImage}
                      disabled={uploading}
                      fullWidth
                    >
                      {uploading ? <CircularProgress size={16} /> : "Upload"}
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      onClick={handleRemoveImage}
                      fullWidth
                    >
                      Remove
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {imageUrl && !preview && (
              <Card sx={{ mb: 2, maxWidth: 200 }}>
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    Current Profile Picture
                  </Typography>
                </CardContent>
                <CardMedia
                  component="img"
                  height="150"
                  image={imageUrl}
                  alt="Profile"
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ pt: 1 }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={handleRemoveImage}
                    fullWidth
                  >
                    Remove Picture
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>

          <Button 
            variant="contained" 
            disableElevation 
            onClick={editIndex === null ? handleAddUser : handleUpdateStudent}
            sx={{ mt: 2, borderRadius: 1, textTransform: 'none' }}
            color={editIndex === null ? "primary" : "secondary"}
          >
            {editIndex === null ? "Add Student" : "Update Student"}
          </Button>
        </div>

        <div className="List">
          <h2 className="title">Active Records</h2>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Profile</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Avatar 
                        src={student.imageUrl} 
                        alt={`${student.first} ${student.last}`}
                        sx={{ width: 40, height: 40 }}
                      >
                        {student.first?.charAt(0)}{student.last?.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{`${student.first} ${student.last}`}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button size="small" variant="outlined" onClick={() => handleEdit(student, index)}>Edit</Button>
                        <Button 
                          size="small" 
                          variant="contained"
                          color="error"
                          onClick={()=> handleDeleteStudent(index)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default AddStudents;