/**
 * Course CRUD routes.
 * @module routes/coursesRoutes
 */

const express = require('express');
const router = express.Router();
const authenticationMiddleware = require("../middleware/auth");

const Course = require("../models/course");
const Topic = require("../models/topic");

/**
 * Creates a new course (staff-only).
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 */
const create = async (req, res, next) => {

  if (!req.user.staff) return res.json({ error: 'permission denied' });
  const { name, topics } = req.body;
  const instructor = req.user;
  const courseExists = await Course.findOne({ "name": name })
    .then(async (course) => {
      if (course) return res.json({ error: "Course already exists" });
      return newCourse = await Course.create({ name, topics, instructor })
        .then((newCourse) => {
          const { _id } = newCourse;
          const newCourseAltered = {
            id: _id,
            name: name
          };
          topics.forEach(async (element) => {
            const newtopic = await Topic.create({ id: newCourse._id, name: element, course: newCourseAltered });
          });
          next();
        })
    })
    .catch(error => {
      res.json({ failed_1: error.message });
    })


}

/**
 * Edits an existing course (instructor-only).
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 */
const edit = async (req, res, next) => {

  const { username } = req.user;
  const { id } = req.params;
  const myCourse = await Course.findOne({ _id: id })
    .then(async course => {
      if (!course) return res.json({ error: "Course does not exists" });

      const courseExists = await Course.findOne({ "name": req.body.name })
        .then(async existingCourse => {

          if (existingCourse) return res.json({ error: "Course already exists" });
          const { instructor } = course;

          if (username !== instructor.username) return res.json({ error: "Permission denied" });
          const NewCourse = await Course.findOneAndUpdate(
            { _id: id },
            req.body,
            {
              new: true,
              runValidators: true
            });
          next();
        })



    })
    .catch(error => res.json({ failed: error }))
}

/**
 * Retrieves a single course by ID.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const getOne = async (req, res) => {

  const { id } = req.params;
  const myCourse = await Course.find({ _id: id }, {})
    .then((course) => {
      if (!course) return res.json({ error: "Course not found" });

      res.json({ course });
    })
    .catch((error) => res.status(400).json({ failed: error }));
}

/**
 * Deletes a course and its associated topics.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next middleware function.
 * @returns {Promise<void>}
 */
const deleteCourse = async (req, res, next) => {

  const { id } = req.params;

  const myCourse = await Course.findOneAndDelete({ _id: id })
    .then(async (course) => {
      if (!course) return res.json({ error: "Course not found" });
      const deleteTopic = await Topic.find({ id: id }, []).then(
        async (topics) => {
          topics.forEach(async (topic) => {
            const Deleted = await Topic.findOneAndDelete({
              _id: topic._id,
            });
          });
          next();
        }
      );
    })
    .catch((error) => res.json({ failed: error.message }));
}

/**
 * Retrieves all courses.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>}
 */
const getAll = async (req, res) => {
  const Courses = await Course.find();
  res.json({ courses: Courses });
}

router.route('/').get(authenticationMiddleware, getAll);
router.route('/:id')
  .get(authenticationMiddleware, getOne)
  .patch(authenticationMiddleware, edit, getAll)
  .delete(authenticationMiddleware, deleteCourse, getAll)

router.route('/add').post(authenticationMiddleware, create, getAll);
module.exports = router;
