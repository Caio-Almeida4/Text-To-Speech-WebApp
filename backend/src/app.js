import express from 'express'
import cors from 'cors'

import db from './models/index.js'
import authRoutes from './routes/auth.routes.js'


try {
    await db.sequelize.authenticate();
    console.log("Database connection successful!");

    await db.sequelize.sync(); 
    console.log("Models synchronized.");

} catch (error) {
    console.error("Initialization failed:", error);
}

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/auth", authRoutes)

app.get("/", (req, res) =>{
    res.send('API is running')
})


const port = 3000

app.listen(port, () =>{
    console.log(`Running on localhost:${port}`);
})