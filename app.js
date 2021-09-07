const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Landmark = require('./models/landmark');

mongoose.connect('mongodb://localhost:27017/sanatana',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind('connection error:'));
db.once('open',()=>{
    console.log('Database Connected');
})

const app = express();

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/',(req,res)=>{
    res.render('home.ejs');
});

app.get('/landmarks',async (req,res)=>{
    try{
        const landmarks = await Landmark.find({});
        res.render('landmarks/index',{landmarks})
    }catch(e){
        console.log(e);
    }
})

app.get("/landmarks/new",(req,res)=>{
    res.render('landmarks/new');
})

app.post('/landmarks',async(req,res)=>{
    try{
        const newLandmark = await new Landmark(req.body.landmark);
        await newLandmark.save();
        res.redirect(`/landmarks/${newLandmark._id}`);
    }catch(e){
        console.log(e);
    }
})

app.get('/landmarks/:id',async (req,res)=>{
    try{
        const landmark = await Landmark.findById(req.params.id);
        res.render('landmarks/show',{landmark})
    }catch(e){
        console.log(e);
    }
})
app.get('/landmarks/:id/edit',async (req,res)=>{
    try{
        const landmark = await Landmark.findById(req.params.id);
        res.render('landmarks/edit',{landmark})
    }catch(e){
        console.log(e);
    }
})

app.put('/landmarks/:id',async(req,res)=>{
    try{
        const id = req.params.id;
        const updatedLandmark = await Landmark.findByIdAndUpdate(id,{...req.body.landmark});
        res.redirect(`/landmarks/${updatedLandmark._id}`);
    }catch(e){
        console.log(e);
    }
})

app.delete('/landmarks/:id',async(req,res)=>{
    try{
        const id = req.params.id;
        await Landmark.findByIdAndDelete(id);
        res.redirect(`/landmarks`);
    }catch(e){
        console.log(e);
    }
})

app.listen(3000, ()=>{
    console.log('running on port 3000');
})
