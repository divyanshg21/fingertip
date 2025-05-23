import path from "path";
import express from "express";
import Connection from "./database/db.js";
import dotenv from 'dotenv';
import Router from "./routes/route.js";
import cors from 'cors';
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";

dotenv.config();

const app = express()

// for file upload
app.use(fileUpload({
    useTempFiles: false
}))
// route
app.use(cors()) //for handling cors 
// for handling POST request by json
app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
//above two lines are strictly required to use before this below line
app.use('/', Router)

// serving the front-end
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../client/build")))
app.get("*", function (_, res) {
    res.sendFile(path.join(__dirname, "../client/build/index.html"), function (err) {
        res.status(500).send(err)
    })
})

dotenv.config();
const PORT = process.env.PORT || 8000;

const url = process.env.MONGO_URI
Connection(url)
.then(()=>app.listen(PORT, () => { console.log(`server is listening at port: ${PORT}`) }))
.catch((err)=>console.log(err.message))

