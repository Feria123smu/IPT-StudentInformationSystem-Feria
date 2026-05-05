import React from "react";
import {useState} from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

 
function Car() {    
    const [model, setModel] = useState("");
    const [color, setColor] = useState("");
    const [year, setYear] = useState("");
 
    let tempColor = "";
    let tempModel = "";
    let tempYear = "";
 
    function handleChange(e){
        const {name, value} = e.target;
        if(name==="model"){
            tempModel = value;
        }
        else if(name==="color"){
            tempColor = value;
        }
        else if(name==="year"){
            tempYear = value;
        }
       
    }
      function handleClick(){
        setModel(tempModel);
        setColor(tempColor);
        setYear(tempYear);
    }
 
 
    return(
          <div>
              <div>Car</div>
              <TextField name="model" label="Model" margin="dense" fullWidth onChange={handleChange}/>
              <TextField name="color" label="Color" margin="dense" fullWidth onChange={handleChange}/>
              <TextField name="year" label="Year" margin="dense" fullWidth onChange={handleChange}/>
             
              <Button onClick={handleClick}>CHANGE COLOR</Button>
              <p>My car is a {color} {model} with the year {year}.</p>
          </div>
     
    )
}
 
export default Car;