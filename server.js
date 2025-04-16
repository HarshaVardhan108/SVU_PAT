const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { saveSubmission, getAllSubmissions, getSubmissionById } = require('./db');

const app = express();
const port = 3000;

// Middleware
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to handle form submissions
app.post('/api/submit', async (req, res) => {
  try {
    const formData = req.body;
    const result = await saveSubmission(formData);
    
    if (result.success) {
      // Fetch the saved submission to get total_score and other fields
      const submission = await getSubmissionById(result.submissionId);
      res.status(200).json({
        success: true,
        submissionId: result.submissionId,
        total_score: submission ? submission.total_score : null,
        submission,
        message: 'Form submitted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to submit form',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in form submission:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Test endpoint to insert a sample user (for testing purposes only)
app.get('/api/test-insert', async (req, res) => {
  try {
    // Sample user data
    const testUser = {
      // Personal Information
      name: 'John Doe',
      branch: 'CSE',
      gender: 'male',
      phone_number: '9876543210',
      native_place: 'Hyderabad',
      whatsapp_number: '9876543210',
      hostel_or_day_scholar: 'hostel',
      
      // MCQ Section (EQ and SQ)
      media_impact: 'Positive',
      god_belief: 'Yes',
      habit_behavior: 'Moderate',
      vedic_text: 'Bhagavad Gita',
      newspaper_reading: 'Daily',
      
      // Express Yourself Section
      pm_changes: 'Focus on education and infrastructure',
      education_changes: 'More practical learning',
      ambition: 'Software Engineer',
      role_models: 'APJ Abdul Kalam',
      skills: ['Programming', 'Problem Solving', 'Communication'],
      hobbies: ['Reading', 'Sports', 'Music'],
      
      // Personality Section
      food_preference: 'Vegetarian',
      seat_preference: 'Window',
      productive_time: 'Morning',
      movie_genre: 'Sci-Fi',
      music_preference: 'Classical',
      book_preference: 'Non-fiction',
      wall_painting: 'Nature',
      club_preference: 'Tech Club',
      career_outlook: 'Growth-oriented',
      
      // Interests Section (Ratings 1-10)
      spirituality_interest: 8,
      yoga_interest: 7,
      meditation_interest: 9,
      social_service_interest: 8,
      
      // IQ Section
      cost_price_question: '80',
      year_week_month_question: '52',
      iq_question3: 'Option C',
      iq_question4: 'Option B',
      iq_question5: 'Option A',
      
      // Final Section
      join_course: 'yes',
      workshops_interested: ['stress_management', 'meditation', 'leadership'],
      feedback: 'Great assessment test. Looking forward to the results.'
    };
    
    const result = await saveSubmission(testUser);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        submissionId: result.submissionId,
        message: 'Test user inserted successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to insert test user',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error inserting test user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// API endpoint to get all submissions (admin access)
app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await getAllSubmissions();
    res.status(200).json({
      success: true,
      submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions',
      error: error.message
    });
  }
});

// API endpoint to get a specific submission (admin access)
app.get('/api/submissions/:id', async (req, res) => {
  try {
    const submissionId = req.params.id;
    const submission = await getSubmissionById(submissionId);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    res.status(200).json({
      success: true,
      submission
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission',
      error: error.message
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
