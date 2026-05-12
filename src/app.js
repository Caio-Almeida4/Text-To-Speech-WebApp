import express from 'express'
import db from './models/index.js'

const app = express()
app.use(express.json())

const port = 3000

try {
    await db.sequelize.authenticate();
    console.log('DB connection successful!');

    await db.sequelize.sync()
    console.log('Models Synchronized!');

} catch (err){
    console.error('Unable to connect to database: ', err);
    
}

app.get("/", (req, res) =>{
    res.send('API is running')
})

app.listen(port, () =>{
    console.log(`Running on localhost:${port}`);
    
})