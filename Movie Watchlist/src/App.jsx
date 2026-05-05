import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import MovieWatchList from "./pages/MovieWatchList";

 
 
 
function App() {
 
 
  return (
    <>
   
      <BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar />
 
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/MovieWatchList" element={<MovieWatchList />} />
              
          </Routes>
        </div>
      </div>
    </BrowserRouter>
   
    </>
  )
}
 
export default App
 