const express = require('express');
const router = express.Router();
const User = require('../models').User;
const Course = require('../models').Course;
const bcryptjs = require('bcryptjs'); //for hashing passwords
const auth = require('basic-auth'); //basic-auth to parse https headers


module.exports = router;
//validation variables
const { check, validationResult } = require('express-validator');

/* Handler function to wrap each route. */
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
        res.status(201).end()
      } catch(error){
        res.status(500).send(error);
        console.log(error.message, error.stack)
      }
    }
  }
//middleware to Authenticate User

const authenticateUser = async (req, res, next) => {
    // Parse the user's credentials from the Authorization header.
    let credentials = auth(req);

    // match given username with availableconst authenticateUser = (req, res, next) => {
  let message = null;

  if (credentials) {
    // Look for a user whose `username` matches the credentials `name` property.
    //const user = await User.findOne({ where: { emailAddress : credentials.name }});
    const users = await User.findAll();
    const user = users.find(user => user.emailAddress === credentials.name);

    if (user) {
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);
      if (authenticated) {
        console.log(`Authentication successful for username: ${user.username}`);

        // Store the user on the Request object.
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.username}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};

  
  //send a GET request to view all courses
router.get('/courses', asyncHandler(async (req, res) =>{
        let courses = await Course.findAll();
         res.status(200).json(courses).end();
         //converts to JSON object

}))

//sends a GET request to view all users
router.get('/users', asyncHandler(async (req, res) =>{
    let user = await User.findAll(req.params.id);
     res.status(200).json(user).end();

}))

//sends a GET request to view a single user
router.get('/users/:id', asyncHandler(async (req, res) =>{
    let user = await User.findByPk(req.params.id);
     res.status(200).json(user).end();

}))

//validation chains for POST requests
//validations can be handled in SEQUELIZE but for this project I wanted to try out the express-validation library
const firstNameValidationChain = check('firstName')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "firstName"');
const lastNameValidationChain = check('lastName')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "lastName"');
const titleValidationChain = check('title')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "title"');
const userIdValidationChain = check('UserId')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('Please provide a value for "UserId" - at least one teacher must be assosciated with the class');

//sends a POST request to create a new user
router.post('/users', [firstNameValidationChain, lastNameValidationChain], 
   asyncHandler(async (req, res) =>{
    //'user' body sent & tested via Postman in the following format:
    // {
    //     "firstName":"Hoad",
    //     "lastName":"Gilled",
    //     "emailAddress":"hogiel@gaddme.com",
    //     "password":"badPass"
    //     }
    
    // Attempt to get the validation result from the Request object. 
    const errors = validationResult(req);
    // If there are validation errors... 
    if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages. 
    const errorMessages = errors.array().map(error => error.msg);
    // Return the validation errors to the client.
       res.status(400).json({ errors: errorMessages }); 
      } else {
    const user = req.body;
    user.password = bcryptjs.hashSync(user.password); //hashes password
    let userData = await User.create(user);
     res.status(201).json(userData).end();
  }
}))



//sends a GET request to view a single course
router.get('/courses/:id', asyncHandler(async (req, res) =>{
    let course = await Course.findByPk(req.params.id);
     res.status(200).json(course).end();

}))

//sends a POST request to create a new course
router.post('/courses', [titleValidationChain, userIdValidationChain], authenticateUser,
  asyncHandler(async (req, res) =>{
  //'course' body sent & tested via Postman in the following format:
  // {
  //   "title":"New Course",
  //   "description":"Just a test Course",
  //   "estimatedTime": "One Week",
  //   "materialsNeeded": "Nothing",
  //   "UserId": "2"
  //   }
      // Attempt to get the validation result from the Request object. 
      const errors = validationResult(req);
      // If there are validation errors... 
      if (!errors.isEmpty()) {
      // Use the Array `map()` method to get a list of error messages. 
      const errorMessages = errors.array().map(error => error.msg);
      // Return the validation errors to the client.
         res.status(400).json({ errors: errorMessages }); 
        } else {
          let course = await Course.create(req.body);
          res.status(201).json(course).end();       
    }
}))

//sends a PUT request to update a course
router.put('/courses/:id', asyncHandler(async (req, res) =>{
  // 'course' body sent & tested via Postman 
  let course = await Course.findByPk(req.params.id);
  await course.update(req.body)
   res.status(204).end();

}))

//sends a DELETE request to destroy a course
router.delete('/courses/:id', asyncHandler(async (req, res) =>{
  //'course' deleted via postman to test
    
  let course = await Course.findByPk(req.params.id);
  await course.destroy()
   res.status(204).end();

}))