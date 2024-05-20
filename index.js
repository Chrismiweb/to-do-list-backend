const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const {model} = mongoose
const app = express()
const port = 2000;
dotenv.config()

app.use(express.json())

const connectionString = process.env.connecttionString;

// connect DB to my work
const connectMongoose =async()=>{
   await mongoose.connect(connectionString)
    console.log('database connected');
}


app.get('/', (req, res)=>{
    res.send('this app is runnin fine')
})

// this is the model and schema 

const todoSchema = new mongoose.Schema({
    task :{
        type: String,
        required: true
    },
    subTask :{
        type: String
    },
    description :{
        type: String
    },
    
})

const todoModel = new model('todo', todoSchema)

// to create a task
app.post('/api/v1/todo', async(req,res)=>{
    const {task, subTask, description } = req.body;
    if(!task){
        res.json({error : "please write down your task"})
    }

    const newTask = await todoModel.create({task, subTask, description})
    return res.json({newTask})
})

// to get all the task created 
app.get('/api/v1/allTask', async(req,res)=>{
    const allTask = await todoModel.find()
    // if(!allTask){
    //     res.body('this task is not available')
    // }
    return res.json({allTask})

})

// to get individual task
app.get('/api/v1/task/:oneTask', async(req,res)=>{
    const {oneTask} = req.params;

    const task = await todoModel.findOne({task : oneTask})

    if(!task){
        return res.json({err: 'this task you searched is not available'})
    }
    

    return res.json({task})
})
// this is to delete a task
app.delete('/api/v1/task/:task', async(req,res)=>{
    const {task} = req.params;
    const findTask = await todoModel.findOne({task: task})
    if(!findTask){
        return res.json('this task was not found')
    }
    const deletedTask = await todoModel.findOneAndDelete({task})
    if(deletedTask){
        return res.json('task was deleted successfully')
    }
})

// this code will update the task
app.patch('/api/v1/task/:updateTask', async(req,res)=>{
    const {updateTask} = req.params
    const foundTask = await todoModel.findOne({task: updateTask})
    if(!foundTask){
        res.json({err: "the task you want to update is not available"})
    }
    const updatedTask = await todoModel.findOneAndUpdate({task:updateTask}, req.body, {runValidator: true})
    if(updatedTask){
        return res.json({message:"Task was updated sucessfully!!!"})
    }


})

app.post("/api/v1/random/task", (req, res)=>{
    res.json(req.body)
})

app.listen(port, async()=>{
    console.log(`server is running on port ${port} `);
    await connectMongoose()  
})
