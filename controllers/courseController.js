// controllers/courseController.js
const Course = require('../models/Course');

// CREATE
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      createdBy: req.user?._id
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET ALL COURSES
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE COURSE
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    res.json({ success: true, data: course });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE COURSE
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastModifiedBy: req.user?._id },
      { new: true, runValidators: true }
    );

    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    res.json({
      success: true,
      message: "Course updated",
      data: course
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE COURSE
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    res.json({ success: true, message: "Course deleted" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SEARCH COURSES
exports.searchCourses = async (req, res) => {
  try {
    const q = req.query.q || "";
    const courses = await Course.find({ $text: { $search: q } });

    res.json({
      success: true,
      results: courses.length,
      data: courses
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// FULL STATISTICS
exports.getCourseStatistics = async (req, res) => {
  try {
    const stats = await Course.aggregate([
      {
        $facet: {
          totalCourses: [{ $count: "count" }],

          activeCourses: [
            { $match: { status: "active" } },
            { $count: "count" }
          ],

          inactiveCourses: [
            { $match: { status: "inactive" } },
            { $count: "count" }
          ],

          draftCourses: [
            { $match: { status: "draft" } },
            { $count: "count" }
          ],

          categoryDistribution: [
            { $group: { _id: "$category", total: { $sum: 1 } } },
            { $sort: { total: -1 } }
          ],

          levelDistribution: [
            { $group: { _id: "$level", total: { $sum: 1 } } },
            { $sort: { total: -1 } }
          ],

          averagePrice: [
            { $group: { _id: null, averagePrice: { $avg: "$price" } } }
          ],

          revenuePotential: [
            { $group: { _id: null, totalRevenue: { $sum: "$price" } } }
          ],

          topCourses: [
            { $sort: { enrolledStudents: -1 } },
            { $limit: 5 }
          ],

          ratingsSummary: [
            { $group: { _id: null, avgRating: { $avg: "$rating" }, totalReviews: { $sum: "$reviewsCount" } } }
          ],

          featuredCourses: [
            { $match: { isFeatured: true } },
            { $count: "count" }
          ],

          popularCourses: [
            { $match: { isPopular: true } },
            { $count: "count" }
          ]
        }
      }
    ]);

    res.json({
      success: true,
      message: "Course statistics fetched successfully",
      data: stats[0]
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
