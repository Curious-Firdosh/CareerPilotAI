
import  app  from "./src/app.js";
import { DbConnect } from "./src/config/db.js";



await DbConnect();

app.get('/' , () => {
    console.log("Hello How Are You???")
  
})

app.listen(3000,() => {
    console.log("App is Started at 3000");
}) 
