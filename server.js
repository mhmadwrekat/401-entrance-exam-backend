'use strict' ;
const express = require('express');
const app= express();
const cors = require('cors');
const Axios = require('axios');
require('dotenv').config();
app.use(cors());
app.use(express.json());
const mongoose = require('mongoose');
const PORT = process.env.PORT ;
const API = process.env.API_URL;
const MONGO = process.env.MONGO_URL ;
mongoose.connect(`mongodb+srv://${MONGO}?retryWrites=true&w=majority`,{useNewUrlParser:true, useUnifiedTopology:true});

app.listen(PORT,()=>{console.log('You in PORT : ', PORT);})

class WatchModel {constructor(title,description,toUSD,image_url){
this.title = title ;
this.description = description ;
this.toUSD = toUSD ;
this.image_url = image_url ;
}}
const getDAta = async(req,res) => {
    let URL =`https://${API}`;
    let axiosRes = await Axios.get(URL);
    let Data = axiosRes.data;
    let cleanData = Data.map(item => {
        return new WatchModel(item.title,item.description,item.toUSD,item.image_url);
    })
    res.status(200).json(cleanData)
}
app.get('/data',getDAta);
///////////////////// DB //////////////////
const SCM = new mongoose.Schema({
    title : String ,
 description:String ,
 toUSD : String ,
image_url : String
});
const WachModel = mongoose.model('watch',SCM);
let seed = () => {
    let newWatch = new WachModel({
        title:"v.salvatore7.gs@gmail.com",
        description:"TEST - DESCRIPTION",
        toUSD:"15:50",
        image_url:"test-Image"
    });
    newWatch.save();
}
let watchController = (req,res) => {
    WachModel.find().then(item => {
        res.status(200).json(item);
    })
}
app.get('/DBseed',seed);
app.get('/DBdata',watchController);
/////////// POST ///////////
const createWatchController = async (req,res) => {
    let watchData = req.body ;
    let newWatch =  WachModel(watchData);
    newWatch.save();
    let Data = await WachModel.find({});
    res.status(201).json(Data);
}
app.post('/create',createWatchController);
/////////// UPDATE ///////////
const updateWatchController = async(req,res) => {
    let ID = req.params.id ;
    let update = req.body ;
    WachModel.findOne({_id:ID}).then(item => {
        item.title = update.title ,
        item.description = update.description,
        item.toUSD = update.toUSD,
        item.image_url = update.image_url
        item.save();
    });
    let UP = await WachModel.find({});
    res.status(200).send(UP);
}
app.put('/update/:id',updateWatchController);
/////////// DELETE ///////////
const deleteWatchController = (req,res) => {
    let id = req.params.id ;
    WachModel.findByIdAndDelete(id,(error,data) => {
        if (error){
            res.status(500).send("ERROR");
        }else{
            WachModel.find({}).then(item => {
                res.json(item);
            })
        }
    })
}
app.delete('/delete/:id', deleteWatchController);
