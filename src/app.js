import express from 'express'
import db from './models/index.js'

const app = express()
app.use(express.json())

const port = 3000

try {
    await db.sequelize.authenticate();
    console.log("Database connection successful!");

    await db.sequelize.sync(); 
    console.log("Models synchronized.");

    /* const joao = db.users.create({
        fullName: 'João', 
        email: 'joao@email.com', 
        password: '12345', 
        role: 'user'
    });

    console.log("Is instance of model?", joao instanceof db.users); 
    console.log("User name:", joao.fullName);  */

} catch (error) {
    console.error("Initialization failed:", error);
}


app.get("/", (req, res) =>{
    res.send('API is running')
})

app.listen(port, () =>{
    console.log(`Running on localhost:${port}`);
    
})