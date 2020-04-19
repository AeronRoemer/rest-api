const express = require('express');
const router = express.Router();
const Users = require('../models').User;
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
      }
    }
  }

  //send a GET request to view all courses
router.get('/courses', asyncHandler(async (req, res) =>{
        let courses = await Course.findAll();
         res.status(200).json(courses);
         //converts to JSON object

}))

// router.get('/courses/:id', asyncHandler(async (req, res) =>{
//   try {
//       let course = await Course.findByPk(req.params.id);
//        res.status(200).json(course);
//        //converts to JSON object
//     } catch (error) {
//         res.json({error: error,
//       message: error.message})
//     }
// }))

router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      },
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"]
          }
        }
      ]
    });
    res.status(200).json(course);
  })
);