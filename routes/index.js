const express = require('express');
const router = express.Router();
const User = require('../models').User;
const Course = require('../models').Course;
module.exports = router;

/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
        res.status(201)
      } catch(error){
        res.status(500).send(error);
        console.log(error.message)
      }
    }
  }

  //send a GET request to view all courses
router.get('/courses', asyncHandler(async (req, res) =>{
        let courses = await Course.findAll();
         res.status(200).json(courses);
         //converts to JSON object

}))

//sends a GET request to view all users
router.get('/users', asyncHandler(async (req, res) =>{
    let user = await User.findAll(req.params.id);
     res.status(200).json(user);

}))

//sends a GET request to view a single user
router.get('/users/:id', asyncHandler(async (req, res) =>{
    let user = await User.findByPk(req.params.id);
     res.status(200).json(user);

}))

//sends a GET request to view a single course
router.get('/courses/:id', asyncHandler(async (req, res) =>{
    let course = await Course.findByPk(req.params.id);
     res.status(200).json(course);

}))

