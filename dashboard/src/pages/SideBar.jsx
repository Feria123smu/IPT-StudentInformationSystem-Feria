import "./SideBar.css";
 
function SideBar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">Student App</h2>
 
     
     
          <a href="/">Home</a>
       
<br></br>
       
          <a href="/AddStudents">Add Student</a>
<br></br>
          <a href="/Users">Users</a>
       
     
    </aside>
  );
}
 
export default SideBar;