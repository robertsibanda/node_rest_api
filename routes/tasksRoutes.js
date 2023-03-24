const express = require('express');
const router = express.Router()
const mongoose = require('mongoose');
const { findOneAndUpdate } = require('../db/task');
const Task  = require("../db/task");
require('express-async-errors');
const authenticationMiddleware = require("../middleware/auth");


router.route('/')
    .get(authenticationMiddleware,async (req,res) => {
        //get all tasks
        try {
            const tasks = await Task.find()
            res.json({tasks, admin : req.user.admin});
        } catch (error) {
            res.send(error.message);
        }
    })
    .post(authenticationMiddleware,async(req, res) =>{
        //create new task

        try {
            const taskName = req.body.name;
            const task = await Task.create(req.body);
            res.send(task);
        } catch (error) {
            res.send(error.message);
        }     
    })


router.route('/:id')
    //perfom actions on task using id

    .get(authenticationMiddleware,async(req,res) =>{
        //get single task
        try {
            console.log(req.params);
            const task = await Task.findOne({_id : req.params.id});
            if(!task) return res.status(400).json({error : `no task with id ${req.params.id}`});
            res.json({task});
        } catch (error) {
            res.status(500).json({error});
        }

    })

    .patch(authenticationMiddleware,async (req,res) =>{
        //update single task 
        try {
            const task = await Task.findOneAndUpdate({_id : req.params.id}, req.body, {
                new : true, runValidators:true
            })
            if(!task) return res.status(400).json({error : `no task with id ${req.params.id}`});
            res.json({task});
        } catch (error) {
            res.status(500).json({error});
            
        }
    })

    .delete(authenticationMiddleware,async(req, res) => {
        //delete single task

        try {
            const task = await Task.findOneAndDelete({_id : req.params.id})
            if(!task) {
                return res.status(400).json({error : `no task with id ${req.params.id}`});
            }
            res.json({task : task});
        } catch (error) {
            res.json({error});

        }
    })



module.exports  = router;