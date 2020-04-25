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
        console.log(error.message, error.stack)
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

//sends a POST request to create a new user
router.post('/users', asyncHandler(async (req, res) =>{
    //'user' body sent & tested via Postman in the following format:
    // {
    //     "firstName":"Hoad",
    //     "lastName":"Gilled",
    //     "emailAddress":"hogiel@gaddme.com",
    //     "password":"badPass"
    //     }
    let user = await User.create(req.body);
     res.status(201).json(user);

}))



//sends a GET request to view a single course
router.get('/courses/:id', asyncHandler(async (req, res) =>{
    let course = await Course.findByPk(req.params.id);
     res.status(200).json(course);

}))

//sends a POST request to create a new course
router.post('/courses', asyncHandler(async (req, res) =>{
  //'course' body sent & tested via Postman in the following format:
  // {
  //   "title":"New Course",
  //   "description":"Just a test Course",
  //   "estimatedTime": "One Week",
  //   "materialsNeeded": "Nothing",
  //   "UserId": "2"
  //   }
    
  let course = await Course.create(req.body);
   res.status(201).json(course);

}))

//sends a PUT request to update a course
router.put('/courses/:id', asyncHandler(async (req, res) =>{
  // 'course' body sent & tested via Postman in the following format:
  // {
  //   "title":"New Updated Course",
  //   "description":"Just an Updated test Course",
  //   "estimatedTime": "One Week",
  //   "materialsNeeded": "Nothing",
  //   "UserId": "2"
  //   }
    
  let course = await Course.findByPk(req.params.id);
  await course.update(req.body)
   res.status(204);

}))

//sends a DELETE request to destroy a course
router.delete('/courses/:id', asyncHandler(async (req, res) =>{
  //'course' body sent & tested via Postman in the following format:
  // {
  //   "title":"New Course",
  //   "description":"Just a test Course",
  //   "estimatedTime": "One Week",
  //   "materialsNeeded": "Nothing",
  //   "UserId": "2"
  //   }
    
  let course = await Course.findByPk(req.params.id);
  await course.destroy()
   res.status(204);

}))