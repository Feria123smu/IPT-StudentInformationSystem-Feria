import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import AddStudents from "./pages/AddStudents";
import Sidebar from "./pages/SideBar";
import Car from "./pages/Car";
import Users from "./pages/Users"; 
 
function App() {
 
 
  return (
    <>
   
      <BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar />
 
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/AddStudents" element={<AddStudents />} />
              <Route path="/Car" element={<Car />} />
                            <Route path="/Users" element={<Users />} />

          </Routes>
        </div>
      </div>
    </BrowserRouter>
   
    </>
  )
}
 
export default App
 