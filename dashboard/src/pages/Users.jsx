
import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { TextField, Button, Table, TableHead, TableCell, TableRow, TableBody } from "@mui/material";
 
function Users(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [users, setUsers] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
   
 
   function fetchUsers() {
        axios
            .get("http://localhost:1337/users-db")
            .then((response) => {
                setUsers(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }
 
     useEffect(() => {
        fetchUsers();
    }, []);
   
   async function handleAddUser() {
    try {
        await axios.post("http://localhost:1337/add-user-db", {
            name: name,
            email: email,
            password: password,
        });
        alert("User added!");
        fetchUsers();
 
         setName("");
         setEmail("");
         setPassword("");
 
    } catch (error) {
        console.error("Error submitting:", error);
    }
}
 
    function handleEdit(user, index) {
        setName(user.name);
        setEmail(user.email);
        setPassword(user.password);
        setEditIndex(index);
       
    }
 
  async function handleUpdateUser() {
        try {
            await axios.put(`http://localhost:1337/edit-user/${editIndex}`, {
                name: name,
                email: email,
                password: password
            });
            alert("User Updated!")
            fetchUsers();
            setName("");
            setEmail("");
            setPassword("");
            setEditIndex(null);
        } catch (error) {
            console.error(error);
        }
    }
 
async function handleDeleteUser(index) {
  try {
    await axios.delete(`http://localhost:1337/delete-user/${index}`);
    alert("User Deleted");
    fetchUsers();
  } catch (error) {
    console.error(error);
  }
}
 
    return (
<div>
     <div style={{ marginLeft: "300px" }}>
        <h1>Users</h1>
        <TextField
        label="name"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setName(e.target.value)}
        />
 
        <TextField
        label="email"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setEmail(e.target.value)}
        />
 
        <TextField
        label="password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={(e) => setPassword(e.target.value)}
        />
        {}
 
              {editIndex === null ? (
 
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddUser}
        >
          Add User
        </Button>
 
      ) : (
 
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUpdateUser}
        >
          Update User
        </Button>
      )}
             <h2>User List</h2>
                 <Table>
                    <TableBody>
                        <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Password</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell></TableCell>
                       
                    </TableRow>
                        {users.map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.password}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleEdit(user, index)}>Edit</Button>
                                </TableCell>
                                 <TableCell>
                                      <Button
                                        variant="contained"
                                         color="error"
                                        onClick={() => handleDeleteUser(index)}
                                         style={{ marginLeft: "10px" }}>
                                         Delete User
                                        </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                   
                 </Table>
            </div>
        </div>
    )
 }
 export default Users; 
