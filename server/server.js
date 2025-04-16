const express = require("express");
const pool = require("./db");
const app = express();

app.use(express.json());

// Final submission
app.post("/api/submit-final", async (req, res) => {
  const { studentId } = req.body;

  try {
    // First get the individual scores
    const scoresResult = await pool.query(
      `SELECT iq_score, eq_score, sq_score FROM student_responses WHERE id = $1`,
      [studentId]
    );
    
    const { iq_score, eq_score, sq_score } = scoresResult.rows[0];
    
    // Calculate total score with proper weights
    // IQ: 30%, EQ: 35%, SQ: 35%
    const totalScore = Math.round(
      (iq_score * 0.3) + (eq_score * 0.35) + (sq_score * 0.35)
    );

    // Update the total score
    const result = await pool.query(
      `UPDATE student_responses 
       SET total_score = $1,
           completed_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING iq_score, eq_score, sq_score, total_score`,
      [totalScore, studentId]
    );

    const scores = result.rows[0];
    res.json({ success: true, scores });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update calculate test score function
function calculateTestScore(responses) {
  if (!responses || typeof responses !== 'object') return 0;
  
  // Convert responses to array if it's an object
  const answersArray = Array.isArray(responses) 
    ? responses 
    : Object.values(responses);
  
  // Calculate score based on correct answers (implement your scoring logic here)
  // For now, let's say each correct answer is worth 10 points
  const maxScore = 100;
  const scorePerQuestion = maxScore / answersArray.length;
  
  // Sample scoring logic - replace with actual scoring criteria
  return Math.round(answersArray.length * scorePerQuestion);
}

module.exports = app;