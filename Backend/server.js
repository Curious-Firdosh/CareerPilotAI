
import  app  from "./src/app.js";
import { DbConnect } from "./src/config/db.js";




await DbConnect();

app.get('/' , (req ,res) => {
  res.send("Welcome To The Backend")
  
})

app.listen(3000,() => {
    console.log("App is Started at 3000");
}) 
