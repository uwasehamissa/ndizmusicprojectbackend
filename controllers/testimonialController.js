const Testimonial = require('../models/Testimonial');
const EmailService = require('../emails/sendEmail');

class TestimonialController {
  
  // ========== CREATE OPERATIONS ==========
  
  /**
   * Create a new testimonial
   * POST /api/testimonials
   */
  static async createTestimonial(req, res) {
    try {
      const {
        name, instrument, duration, joinDate, rating, text, email,
        location, ageGroup, isVerified
      } = req.body;

      // Validate required fields
      if (!name || !instrument || !duration || !joinDate || !rating || !text || !email) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields'
        });
      }

      // Create testimonial
      const testimonial = await Testimonial.create({
        name,
        instrument,
        duration,
        joinDate,
        rating,
        text,
        email,
        location: location || '',
        ageGroup: ageGroup || null,
        isVerified: isVerified || false,
        status: 'pending'
      });

      // Send confirmation email
      try {
        await EmailService.sendTestimonialConfirmation(testimonial);
        testimonial.emailSent = true;
        await testimonial.save();
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the request if email fails
      }

      res.status(201).json({
        success: true,
        message: 'Testimonial submitted successfully. Check your email for confirmation.',
        data: testimonial
      });
    } catch (error) {
      console.error('Error creating testimonial:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: messages
        });
      }

      // Handle duplicate email submissions
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'A testimonial with this email already exists'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create testimonial',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Create multiple testimonials (batch import)
   * POST /api/testimonials/batch
   */
  static async createBatchTestimonials(req, res) {
    try {
      const testimonials = req.body;
      
      if (!Array.isArray(testimonials) || testimonials.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide an array of testimonials'
        });
      }

      // Validate each testimonial
      const validTestimonials = [];
      const invalidTestimonials = [];
      
      for (const testimonial of testimonials) {
        try {
          // Set default values
          testimonial.status = testimonial.status || 'pending';
          testimonial.emailSent = testimonial.emailSent || false;
          
          const newTestimonial = new Testimonial(testimonial);
          await newTestimonial.validate();
          validTestimonials.push(newTestimonial);
        } catch (error) {
          invalidTestimonials.push({
            data: testimonial,
            error: error.message
          });
        }
      }

      if (validTestimonials.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid testimonials found',
          invalid: invalidTestimonials
        });
      }

      // Save valid testimonials
      const savedTestimonials = await Testimonial.insertMany(validTestimonials);

      res.status(201).json({
        success: true,
        message: `Successfully created ${savedTestimonials.length} testimonials`,
        createdCount: savedTestimonials.length,
        invalidCount: invalidTestimonials.length,
        data: savedTestimonials,
        invalid: invalidTestimonials.length > 0 ? invalidTestimonials : undefined
      });
    } catch (error) {
      console.error('Error creating batch testimonials:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create batch testimonials',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // ========== READ OPERATIONS ==========
  
  /**
   * Get all testimonials with filtering, sorting, and pagination
   * GET /api/testimonials
   */
  static async getAllTestimonials(req, res) {
    try {
      const {
        status,
        instrument,
        minRating,
        maxRating,
        featured,
        ageGroup,
        isVerified,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10,
        search
      } = req.query;

      // Build filter object
      const filter = {};
      
      if (status) filter.status = status;
      if (instrument) filter.instrument = new RegExp(instrument, 'i');
      if (minRating || maxRating) {
        filter.rating = {};
        if (minRating) filter.rating.$gte = parseInt(minRating);
        if (maxRating) filter.rating.$lte = parseInt(maxRating);
      }
      if (featured !== undefined) filter.featured = featured === 'true';
      if (ageGroup) filter.ageGroup = ageGroup;
      if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
      
      // Search functionality
      if (search) {
        filter.$or = [
          { name: new RegExp(search, 'i') },
          { instrument: new RegExp(search, 'i') },
          { text: new RegExp(search, 'i') },
          { location: new RegExp(search, 'i') }
        ];
      }

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      // Execute query with pagination
      const testimonials = await Testimonial.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v');

      // Get total count for pagination
      const totalCount = await Testimonial.countDocuments(filter);
      const totalPages = Math.ceil(totalCount / parseInt(limit));

      res.json({
        success: true,
        count: testimonials.length,
        totalCount,
        totalPages,
        currentPage: parseInt(page),
        data: testimonials,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      });
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch testimonials',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get single testimonial by ID
   * GET /api/testimonials/:id
   */
  static async getTestimonialById(req, res) {
    try {
      const testimonial = await Testimonial.findById(req.params.id).select('-__v');
      
      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      res.json({
        success: true,
        data: testimonial
      });
    } catch (error) {
      console.error('Error fetching testimonial:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid testimonial ID format'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to fetch testimonial',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get testimonials by email
   * GET /api/testimonials/email/:email
   */
  static async getTestimonialsByEmail(req, res) {
    try {
      const testimonials = await Testimonial.find({ 
        email: req.params.email.toLowerCase() 
      })
      .sort({ createdAt: -1 })
      .select('-__v');

      res.json({
        success: true,
        count: testimonials.length,
        data: testimonials
      });
    } catch (error) {
      console.error('Error fetching testimonials by email:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch testimonials'
      });
    }
  }

  /**
   * Get featured testimonials
   * GET /api/testimonials/featured
   */
  static async getFeaturedTestimonials(req, res) {
    try {
      const testimonials = await Testimonial.find({ 
        featured: true, 
        status: 'approved' 
      })
      .sort({ rating: -1, createdAt: -1 })
      .limit(10)
      .select('-__v');

      res.json({
        success: true,
        count: testimonials.length,
        data: testimonials
      });
    } catch (error) {
      console.error('Error fetching featured testimonials:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch featured testimonials'
      });
    }
  }

  /**
   * Get testimonials by instrument
   * GET /api/testimonials/instrument/:instrument
   */
  static async getTestimonialsByInstrument(req, res) {
    try {
      const testimonials = await Testimonial.find({ 
        instrument: new RegExp(req.params.instrument, 'i'),
        status: 'approved'
      })
      .sort({ rating: -1, createdAt: -1 })
      .select('-__v');

      res.json({
        success: true,
        count: testimonials.length,
        data: testimonials
      });
    } catch (error) {
      console.error('Error fetching testimonials by instrument:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch testimonials'
      });
    }
  }

  // ========== UPDATE OPERATIONS ==========
  
  /**
   * Update testimonial by ID
   * PUT /api/testimonials/:id
   */
  static async updateTestimonial(req, res) {
    try {
      const testimonial = await Testimonial.findByIdAndUpdate(
        req.params.id,
        req.body,
        { 
          new: true, 
          runValidators: true,
          context: 'query'
        }
      ).select('-__v');

      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      res.json({
        success: true,
        message: 'Testimonial updated successfully',
        data: testimonial
      });
    } catch (error) {
      console.error('Error updating testimonial:', error);
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation Error',
          errors: messages
        });
      }

      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid testimonial ID format'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update testimonial',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Partially update testimonial
   * PATCH /api/testimonials/:id
   */
  static async patchTestimonial(req, res) {
    try {
      const testimonial = await Testimonial.findById(req.params.id);
      
      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      // Update only provided fields
      Object.keys(req.body).forEach(key => {
        if (req.body[key] !== undefined) {
          testimonial[key] = req.body[key];
        }
      });

      await testimonial.save();

      res.json({
        success: true,
        message: 'Testimonial updated successfully',
        data: testimonial
      });
    } catch (error) {
      console.error('Error patching testimonial:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update testimonial'
      });
    }
  }

  /**
   * Approve testimonial
   * PATCH /api/testimonials/:id/approve
   */
  static async approveTestimonial(req, res) {
    try {
      const testimonial = await Testimonial.findById(req.params.id);
      
      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      testimonial.status = 'approved';
      await testimonial.save();

      // Send approval email if not sent before
      if (!testimonial.emailSent) {
        try {
          await EmailService.sendTestimonialApproval(testimonial);
          testimonial.emailSent = true;
          await testimonial.save();
        } catch (emailError) {
          console.error('Approval email failed:', emailError);
        }
      }

      res.json({
        success: true,
        message: 'Testimonial approved successfully',
        data: testimonial
      });
    } catch (error) {
      console.error('Error approving testimonial:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to approve testimonial'
      });
    }
  }

  /**
   * Reject testimonial
   * PATCH /api/testimonials/:id/reject
   */
  static async rejectTestimonial(req, res) {
    try {
      const { adminNotes } = req.body;
      const testimonial = await Testimonial.findById(req.params.id);
      
      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      testimonial.status = 'rejected';
      if (adminNotes) testimonial.adminNotes = adminNotes;
      await testimonial.save();

      res.json({
        success: true,
        message: 'Testimonial rejected',
        data: testimonial
      });
    } catch (error) {
      console.error('Error rejecting testimonial:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reject testimonial'
      });
    }
  }

  /**
   * Toggle featured status
   * PATCH /api/testimonials/:id/toggle-featured
   */
  static async toggleFeatured(req, res) {
    try {
      const testimonial = await Testimonial.findById(req.params.id);
      
      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      testimonial.featured = !testimonial.featured;
      await testimonial.save();

      res.json({
        success: true,
        message: `Testimonial ${testimonial.featured ? 'added to' : 'removed from'} featured`,
        data: testimonial
      });
    } catch (error) {
      console.error('Error toggling featured status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle featured status'
      });
    }
  }

  // ========== DELETE OPERATIONS ==========
  
  /**
   * Delete testimonial by ID
   * DELETE /api/testimonials/:id
   */
  static async deleteTestimonial(req, res) {
    try {
      const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

      if (!testimonial) {
        return res.status(404).json({
          success: false,
          message: 'Testimonial not found'
        });
      }

      res.json({
        success: true,
        message: 'Testimonial deleted successfully',
        deletedId: testimonial._id
      });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: 'Invalid testimonial ID format'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete testimonial',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Delete multiple testimonials
   * DELETE /api/testimonials/batch
   */
  static async deleteBatchTestimonials(req, res) {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide an array of testimonial IDs'
        });
      }

      const result = await Testimonial.deleteMany({ _id: { $in: ids } });

      res.json({
        success: true,
        message: `Successfully deleted ${result.deletedCount} testimonials`,
        deletedCount: result.deletedCount
      });
    } catch (error) {
      console.error('Error deleting batch testimonials:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete testimonials'
      });
    }
  }

  // ========== STATISTICS OPERATIONS ==========
  
  /**
   * Get testimonial statistics
   * GET /api/testimonials/stats/overview
   */
  static async getStatistics(req, res) {
    try {
      const [
        totalCount,
        approvedCount,
        pendingCount,
        rejectedCount,
        averageRating,
        instrumentStats,
        statusStats,
        ratingDistribution,
        recentActivity
      ] = await Promise.all([
        // Total count
        Testimonial.countDocuments(),
        
        // Approved count
        Testimonial.countDocuments({ status: 'approved' }),
        
        // Pending count
        Testimonial.countDocuments({ status: 'pending' }),
        
        // Rejected count
        Testimonial.countDocuments({ status: 'rejected' }),
        
        // Average rating
        Testimonial.aggregate([
          { $match: { status: 'approved' } },
          { $group: { _id: null, averageRating: { $avg: '$rating' } } }
        ]),
        
        // Instrument statistics
        Testimonial.aggregate([
          { $match: { status: 'approved' } },
          { $group: { 
            _id: '$instrument', 
            count: { $sum: 1 },
            averageRating: { $avg: '$rating' }
          }},
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]),
        
        // Status statistics
        Testimonial.aggregate([
          { $group: { 
            _id: '$status', 
            count: { $sum: 1 }
          }}
        ]),
        
        // Rating distribution
        Testimonial.aggregate([
          { $match: { status: 'approved' } },
          { $group: { 
            _id: '$rating', 
            count: { $sum: 1 }
          }},
          { $sort: { _id: 1 } }
        ]),
        
        // Recent activity (last 7 days)
        Testimonial.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              }
            }
          },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } },
          { $limit: 7 }
        ])
      ]);

      // Calculate approval rate
      const approvalRate = totalCount > 0 ? (approvedCount / totalCount * 100).toFixed(2) : 0;

      // Format recent activity
      const formattedActivity = recentActivity.map(item => ({
        date: item._id,
        count: item.count
      }));

      // Format instrument stats
      const formattedInstrumentStats = instrumentStats.map(stat => ({
        instrument: stat._id,
        count: stat.count,
        averageRating: Math.round(stat.averageRating * 10) / 10
      }));

      // Format rating distribution
      const formattedRatingDistribution = Array.from({ length: 5 }, (_, i) => {
        const rating = i + 1;
        const stat = ratingDistribution.find(r => r._id === rating);
        return {
          rating,
          count: stat ? stat.count : 0,
          percentage: stat ? ((stat.count / approvedCount) * 100).toFixed(1) : '0.0'
        };
      });

      res.json({
        success: true,
        data: {
          overview: {
            total: totalCount,
            approved: approvedCount,
            pending: pendingCount,
            rejected: rejectedCount,
            approvalRate: `${approvalRate}%`,
            averageRating: averageRating[0]?.averageRating ? 
              Math.round(averageRating[0].averageRating * 10) / 10 : 0
          },
          instruments: formattedInstrumentStats,
          statusBreakdown: statusStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
          }, {}),
          ratingDistribution: formattedRatingDistribution,
          recentActivity: formattedActivity,
          featuredCount: await Testimonial.countDocuments({ featured: true }),
          verifiedCount: await Testimonial.countDocuments({ isVerified: true }),
          // Top testimonials by rating
          topRated: await Testimonial.find({ status: 'approved' })
            .sort({ rating: -1, createdAt: -1 })
            .limit(5)
            .select('name instrument rating text createdAt')
        }
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Get dashboard statistics (for admin dashboard)
   * GET /api/testimonials/stats/dashboard
   */
  static async getDashboardStats(req, res) {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const startOfWeek = new Date(today.setDate(today.getDate() - 7));
      const startOfMonth = new Date(today.setMonth(today.getMonth() - 1));

      const [
        todayCount,
        weekCount,
        monthCount,
        recentTestimonials,
        topInstruments
      ] = await Promise.all([
        // Today's testimonials
        Testimonial.countDocuments({ createdAt: { $gte: startOfDay } }),
        
        // This week's testimonials
        Testimonial.countDocuments({ createdAt: { $gte: startOfWeek } }),
        
        // This month's testimonials
        Testimonial.countDocuments({ createdAt: { $gte: startOfMonth } }),
        
        // Recent testimonials
        Testimonial.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('name instrument rating status createdAt'),
        
        // Top instruments
        Testimonial.aggregate([
          { $group: { 
            _id: '$instrument', 
            count: { $sum: 1 }
          }},
          { $sort: { count: -1 } },
          { $limit: 5 }
        ])
      ]);

      res.json({
        success: true,
        data: {
          counts: {
            today: todayCount,
            week: weekCount,
            month: monthCount
          },
          recentTestimonials,
          topInstruments,
          // Quick stats
          quickStats: {
            awaitingReview: await Testimonial.countDocuments({ status: 'pending' }),
            featured: await Testimonial.countDocuments({ featured: true }),
            verified: await Testimonial.countDocuments({ isVerified: true })
          }
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard statistics'
      });
    }
  }

  /**
   * Get testimonial trends over time
   * GET /api/testimonials/stats/trends
   */
  static async getTrends(req, res) {
    try {
      const { period = 'month' } = req.query;
      let groupFormat, matchPeriod;
      
      switch (period) {
        case 'day':
          groupFormat = '%Y-%m-%d';
          matchPeriod = 30; // Last 30 days
          break;
        case 'week':
          groupFormat = '%Y-%U'; // Year-Week number
          matchPeriod = 12; // Last 12 weeks
          break;
        default: // month
          groupFormat = '%Y-%m';
          matchPeriod = 12; // Last 12 months
      }

      const matchDate = new Date();
      matchDate.setMonth(matchDate.getMonth() - matchPeriod);

      const trends = await Testimonial.aggregate([
        {
          $match: {
            createdAt: { $gte: matchDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: groupFormat, date: '$createdAt' }
            },
            count: { $sum: 1 },
            avgRating: { $avg: '$rating' },
            approved: {
              $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
            },
            pending: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      res.json({
        success: true,
        period,
        data: trends
      });
    } catch (error) {
      console.error('Error fetching trends:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch trends'
      });
    }
  }
  

  /**
   * Export testimonials (CSV/JSON)
   * GET /api/testimonials/export
   */
  static async exportTestimonials(req, res) {
    try {
      const { format = 'json', status } = req.query;
      const filter = status ? { status } : {};

      const testimonials = await Testimonial.find(filter)
        .sort({ createdAt: -1 })
        .select('-__v');

      if (format === 'csv') {
        // Convert to CSV
        const headers = ['Name', 'Email', 'Instrument', 'Rating', 'Duration', 'Join Date', 'Status', 'Location', 'Text'];
        const csvRows = [
          headers.join(','),
          ...testimonials.map(t => [
            `"${t.name}"`,
            t.email,
            `"${t.instrument}"`,
            t.rating,
            `"${t.duration}"`,
            `"${t.joinDate}"`,
            t.status,
            `"${t.location || ''}"`,
            `"${t.text.replace(/"/g, '""')}"`
          ].join(','))
        ];

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=testimonials.csv');
        return res.send(csvRows.join('\n'));
      }

      // Default to JSON
      res.json({
        success: true,
        count: testimonials.length,
        exportedAt: new Date().toISOString(),
        data: testimonials
      });
    } catch (error) {
      console.error('Error exporting testimonials:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export testimonials'
      });
    }
  }

  /**
   * Health check endpoint
   * GET /api/testimonials/health
   */
  static async healthCheck(req, res) {
    try {
      const count = await Testimonial.countDocuments();
      const dbStatus = count >= 0 ? 'healthy' : 'unavailable';
      
      res.json({
        success: true,
        service: 'Testimonial API',
        status: 'operational',
        database: dbStatus,
        timestamp: new Date().toISOString(),
        stats: {
          totalTestimonials: count,
          uptime: process.uptime()
        }
      });
    } catch (error) {
      res.status(503).json({
        success: false,
        service: 'Testimonial API',
        status: 'unavailable',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = TestimonialController;