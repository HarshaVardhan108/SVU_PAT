const { Pool } = require('pg');
const dbConfig = require('./db-config');

// Create a connection pool
const pool = new Pool(dbConfig);

// Log connection status
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

// Handle errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Save a complete form submission to the database
 * @param {Object} formData - The complete form data from all sections
 * @returns {Promise<Object>} - The submission ID and status
 */
async function saveSubmission(formData) {
  const client = await pool.connect();
  
  try {
    // Begin transaction
    await client.query('BEGIN');
    
    // Process arrays for skills, hobbies, and workshops
    const skills = formData.skills ? 
      (Array.isArray(formData.skills) ? formData.skills : [formData.skills]) : 
      null;
    
    const hobbies = formData.hobbies ? 
      (Array.isArray(formData.hobbies) ? formData.hobbies : [formData.hobbies]) : 
      null;
      
    const workshops = formData.workshops_interested ? 
      (Array.isArray(formData.workshops_interested) ? formData.workshops_interested : [formData.workshops_interested]) : 
      null;
    
    // Calculate marks using Number() for robustness
    const mcq = Number(formData.mcq_marks) || 0;
    const personality = Number(formData.personality_marks) || 0;
    const interest = Number(formData.interest_marks) || 0;
    const express = Number(formData.express_marks) || 0;
    const iq = Number(formData.iq_marks) || 0;
    const total_score = mcq + personality + interest + express + iq;

    // Insert into user_submissions table
    const submissionResult = await client.query(
      `INSERT INTO user_submissions (
        name, branch, gender, phone_number, native_place, whatsapp_number, hostel_or_day_scholar,
        media_impact, god_belief, habit_behavior, vedic_text, newspaper_reading,
        pm_changes, education_changes, ambition, role_models, skills, hobbies,
        food_preference, seat_preference, productive_time, movie_genre, music_preference, 
        book_preference, wall_painting, club_preference, career_outlook,
        spirituality_interest, yoga_interest, meditation_interest, social_service_interest,
        cost_price_question, year_week_month_question, iq_question3, iq_question4, iq_question5,
        join_course, workshops_interested, feedback,
        mcq_marks, personality_marks, interest_marks, express_marks, iq_marks, total_score
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36,
        $37, $38, $39, $40, $41, $42, $43, $44, $45
      ) RETURNING id`,
      [
        // Personal Information
        formData.name || null,
        formData.branch || null,
        formData.gender || null,
        formData.phone_number || null,
        formData.native_place || null,
        formData.whatsapp_number || null,
        formData.hostel_or_day_scholar || null,
        
        // MCQ Section
        formData.media_impact || null,
        formData.god_belief || null,
        formData.habit_behavior || null,
        formData.vedic_text || null,
        formData.newspaper_reading || null,
        
        // Express Yourself Section
        formData.pm_changes || null,
        formData.education_changes || null,
        formData.ambition || null,
        formData.role_models || null,
        skills,
        hobbies,
        
        // Personality Section
        formData.food_preference || null,
        formData.seat_preference || null,
        formData.productive_time || null,
        formData.movie_genre || null,
        formData.music_preference || null,
        formData.book_preference || null,
        formData.wall_painting || null,
        formData.club_preference || null,
        formData.career_outlook || null,
        
        // Interests Section
        parseInt(formData.spirituality_interest) || null,
        parseInt(formData.yoga_interest) || null,
        parseInt(formData.meditation_interest) || null,
        parseInt(formData.social_service_interest) || null,
        
        // IQ Section
        formData.cost_price_question || null,
        formData.year_week_month_question || null,
        formData.iq_question3 || null,
        formData.iq_question4 || null,
        formData.iq_question5 || null,
        
        // Final Section
        formData.join_course || null,
        workshops,
        formData.feedback || null,
        mcq,
        personality,
        interest,
        express,
        iq,
        // Calculate total_score in backend
        total_score
      ]
    );
    
    const submissionId = submissionResult.rows[0].id;
    
    // Commit transaction
    await client.query('COMMIT');
    
    return {
      success: true,
      submissionId: submissionId,
      message: 'Submission saved successfully'
    };
    
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error saving submission:', error);
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to save submission'
    };
    
  } finally {
    // Release client back to pool
    client.release();
  }
}

/**
 * Get all submissions from the database
 * @returns {Promise<Array>} - Array of submissions
 */
async function getAllSubmissions() {
  try {
    const result = await pool.query(`
      SELECT s.*, 
             to_char(s.submission_date, 'YYYY-MM-DD HH24:MI:SS') as formatted_date
      FROM user_submissions s
      ORDER BY s.submission_date DESC
    `);
    
    return result.rows;
  } catch (error) {
    console.error('Error getting submissions:', error);
    throw error;
  }
}

/**
 * Get a single submission with all its responses
 * @param {Number} submissionId - The submission ID
 * @returns {Promise<Object>} - The complete submission data
 */
async function getSubmissionById(submissionId) {
  try {
    // Get submission by ID
    const result = await pool.query(
      `SELECT *, to_char(submission_date, 'YYYY-MM-DD HH24:MI:SS') as formatted_date
       FROM user_submissions 
       WHERE id = $1`,
      [submissionId]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
    
  } catch (error) {
    console.error('Error getting submission by ID:', error);
    throw error;
  }
}

module.exports = {
  pool,
  saveSubmission,
  getAllSubmissions,
  getSubmissionById
};
