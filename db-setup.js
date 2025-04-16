const { Pool } = require('pg');
const dbConfig = require('./db-config');

// Create a new pool using the configuration
const pool = new Pool(dbConfig);

// SQL statements to create tables
const createTablesQueries = [
  // Single comprehensive table for all user submissions
  `CREATE TABLE IF NOT EXISTS user_submissions (
    id SERIAL PRIMARY KEY,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Personal Information
    name VARCHAR(100),
    branch VARCHAR(100),
    gender VARCHAR(20),
    phone_number VARCHAR(20),
    native_place VARCHAR(100),
    whatsapp_number VARCHAR(20),
    hostel_or_day_scholar VARCHAR(20),
    
    -- MCQ Section (EQ and SQ)
    media_impact VARCHAR(50),
    god_belief VARCHAR(50),
    habit_behavior VARCHAR(50),
    vedic_text VARCHAR(50),
    newspaper_reading VARCHAR(50),
    
    -- Express Yourself Section
    pm_changes TEXT,
    education_changes TEXT,
    ambition TEXT,
    role_models TEXT,
    skills TEXT[],
    hobbies TEXT[],
    
    -- Personality Section
    food_preference VARCHAR(50),
    seat_preference VARCHAR(50),
    productive_time VARCHAR(50),
    movie_genre VARCHAR(50),
    music_preference VARCHAR(50),
    book_preference VARCHAR(50),
    wall_painting VARCHAR(50),
    club_preference VARCHAR(50),
    career_outlook VARCHAR(50),
    
    -- Interests Section (Ratings 1-10)
    spirituality_interest INTEGER,
    yoga_interest INTEGER,
    meditation_interest INTEGER,
    social_service_interest INTEGER,
    
    -- IQ Section
    cost_price_question VARCHAR(50),
    year_week_month_question VARCHAR(50),
    iq_question3 VARCHAR(50),
    iq_question4 VARCHAR(50),
    iq_question5 VARCHAR(50),
    
    -- Final Section
    join_course VARCHAR(50),
    workshops_interested TEXT[],
    feedback TEXT,
    mcq_marks INTEGER,
    personality_marks INTEGER,
    interest_marks INTEGER,
    express_marks INTEGER,
    iq_marks INTEGER,
    total_score INTEGER
  )`
];

// Function to create all tables
async function setupDatabase() {
  try {
    // Connect to PostgreSQL
    const client = await pool.connect();
    
    console.log('Connected to PostgreSQL database');
    
    // Execute each table creation query
    for (const query of createTablesQueries) {
      await client.query(query);
      console.log('Table created or already exists');
    }
    
    console.log('Database setup completed successfully');
    client.release();
    
    // Close the pool
    await pool.end();
    
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Run the setup
setupDatabase();
