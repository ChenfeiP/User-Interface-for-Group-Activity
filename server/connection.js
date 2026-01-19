const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');


const app = express();

// AWS PostgreSQL connection pool
const pool = new Pool({
  host: '3.20.185.35',  // PUBLIC IP - what DBeaver actually uses!
  // host: '172.31.38.217',  // Private IP (only works from within AWS VPC)
  // host: 'wander-app-dev.cluster-cfgkii2cxbc.us-east-2.rds.amazonaws.com',  // Hostname (DNS not resolving currently)
  port: 5432,
  database: 'wander_app',
  user: 'danny',
  password: 'HyFnoXPQT4rN3BL7XYRy',
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to AWS database: ', err.message);
    console.error('\n⚠️  Database connection failed. Please check:');
    console.error('1. Are you connected to VPN?');
    console.error('2. Is the AWS RDS security group configured correctly?');
    console.error('3. Can you connect via DBeaver?\n');
    console.error('Server will continue running but database queries will fail.\n');
    return;
  }
  console.log('✅ Connected to AWS PostgreSQL database');
  console.log('Database: wander_app');
  console.log('Host: wander-app-dev.cluster-cfgkii2cxbc.us-east-2.rds.amazonaws.com\n');
  release();
});

// Enable CORS
app.use(cors());
app.use(express.json());


// Get all users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
      console.error('Error querying database: ', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Search users by email, username, or first_name
app.get('/users/search', async (req, res) => {
  const { query, type } = req.query; // type can be 'email', 'username', or 'first_name'

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    let sqlQuery = '';
    const searchPattern = `%${query}%`;

    if (type === 'email') {
      sqlQuery = 'SELECT * FROM users WHERE email ILIKE $1 ORDER BY created_at DESC';
    } else if (type === 'username') {
      sqlQuery = 'SELECT * FROM users WHERE username ILIKE $1 ORDER BY created_at DESC';
    } else if (type === 'first_name') {
      sqlQuery = 'SELECT * FROM users WHERE first_name ILIKE $1 ORDER BY created_at DESC';
    } else {
      // Search all fields if no type specified
      sqlQuery = `
        SELECT * FROM users
        WHERE email ILIKE $1
           OR username ILIKE $1
           OR first_name ILIKE $1
        ORDER BY created_at DESC
      `;
    }

    const result = await pool.query(sqlQuery, [searchPattern]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error searching users: ', err);
    res.status(500).json({ error: 'Search query failed' });
  }
});

// Get single user profile (similar to the SQL you provided)
app.get('/users/profile', async (req, res) => {
  const { email, username, first_name } = req.query;

  if (!email && !username && !first_name) {
    return res.status(400).json({ error: 'At least one search parameter is required' });
  }

  try {
    let conditions = [];
    let params = [];
    let paramCount = 1;

    if (email) {
      conditions.push(`email ILIKE $${paramCount}`);
      params.push(`%${email}%`);
      paramCount++;
    }
    if (username) {
      conditions.push(`username ILIKE $${paramCount}`);
      params.push(`%${username}%`);
      paramCount++;
    }
    if (first_name) {
      conditions.push(`first_name ILIKE $${paramCount}`);
      params.push(`%${first_name}%`);
      paramCount++;
    }

    const sqlQuery = `
      SELECT
        user_id,
        username,
        email,
        first_name,
        user_focus,
        look_for_gender,
        user_summary,
        top_user,
        interests,
        summary,
        connection_type,
        age_preference,
        created_at
      FROM users
      WHERE ${conditions.join(' OR ')}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const result = await pool.query(sqlQuery, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error getting user profile: ', err);
    res.status(500).json({ error: 'Profile query failed' });
  }
});


// Get user timeline (implements your complex SQL query with UNION ALL)
app.get('/users/:userId/timeline', async (req, res) => {
  const userId = req.params.userId;  // Keep as string, not parseInt

  try {
    const query = `
      WITH target_user AS (
        SELECT user_id, username, email, first_name
        FROM users
        WHERE user_id = $1
      ),
      timeline AS (
        -- 1) joined_group
        SELECT
          'joined_group'::text AS activity_type,
          'member'::text AS activity_role,
          gm.joined_at AS activity_time,
          gm.group_id::text,
          g.group_subject,
          g.group_location,
          g.group_time,
          NULL::text AS app_status,
          NULL::timestamptz AS app_decided_at,
          NULL::text AS invite_code,
          NULL::timestamptz AS invite_expires_at,
          NULL::int AS invite_usage_count,
          NULL::text AS invite_id,
          NULL::text AS redemption_id,
          NULL::text AS expr_topic,
          NULL::text AS expr_ai_question,
          NULL::text AS expr_user_answer,
          NULL::text AS expr_context,
          NULL::timestamptz AS expr_created_at,
          NULL::text AS post_content,
          NULL::timestamptz AS post_created_at,
          NULL::timestamptz AS post_updated_at
        FROM target_user t
        JOIN group_members gm ON gm.user_id = t.user_id
        JOIN groups g ON g.group_id = gm.group_id
        WHERE g.is_delete = 'N' OR g.is_delete IS NULL

        UNION ALL

        -- 2) applied_to_group
        SELECT
          'applied_to_group'::text AS activity_type,
          'applicant'::text AS activity_role,
          ga.created_at AS activity_time,
          ga.group_id::text,
          g.group_subject,
          g.group_location,
          g.group_time,
          ga.status::text AS app_status,
          ga.decided_at AS app_decided_at,
          NULL::text AS invite_code,
          NULL::timestamptz AS invite_expires_at,
          NULL::int AS invite_usage_count,
          NULL::text AS invite_id,
          NULL::text AS redemption_id,
          NULL::text AS expr_topic,
          NULL::text AS expr_ai_question,
          NULL::text AS expr_user_answer,
          NULL::text AS expr_context,
          NULL::timestamptz AS expr_created_at,
          NULL::text AS post_content,
          NULL::timestamptz AS post_created_at,
          NULL::timestamptz AS post_updated_at
        FROM target_user t
        JOIN group_applications ga ON ga.applicant_user_id = t.user_id
        LEFT JOIN groups g ON g.group_id = ga.group_id

        UNION ALL

        -- 3) created_invite
        SELECT
          'created_invite'::text AS activity_type,
          'inviter'::text AS activity_role,
          ic.created_at AS activity_time,
          ic.group_id::text,
          g.group_subject,
          g.group_location,
          g.group_time,
          NULL::text AS app_status,
          NULL::timestamptz AS app_decided_at,
          TRIM(ic.invite_code) AS invite_code,
          ic.expires_at AS invite_expires_at,
          ic.usage_count AS invite_usage_count,
          ic.invite_id::text AS invite_id,
          NULL::text AS redemption_id,
          NULL::text AS expr_topic,
          NULL::text AS expr_ai_question,
          NULL::text AS expr_user_answer,
          NULL::text AS expr_context,
          NULL::timestamptz AS expr_created_at,
          NULL::text AS post_content,
          NULL::timestamptz AS post_created_at,
          NULL::timestamptz AS post_updated_at
        FROM target_user t
        JOIN group_invite_codes ic ON ic.inviter_id = t.user_id
        LEFT JOIN groups g ON g.group_id = ic.group_id
        WHERE ic.is_active = true

        UNION ALL

        -- 4) redeemed_invite
        SELECT
          'redeemed_invite'::text AS activity_type,
          'invitee'::text AS activity_role,
          r.redeemed_at AS activity_time,
          r.group_id::text,
          g.group_subject,
          g.group_location,
          g.group_time,
          NULL::text AS app_status,
          NULL::timestamptz AS app_decided_at,
          NULL::text AS invite_code,
          NULL::timestamptz AS invite_expires_at,
          NULL::int AS invite_usage_count,
          r.invite_id::text AS invite_id,
          r.redemption_id::text AS redemption_id,
          NULL::text AS expr_topic,
          NULL::text AS expr_ai_question,
          NULL::text AS expr_user_answer,
          NULL::text AS expr_context,
          NULL::timestamptz AS expr_created_at,
          NULL::text AS post_content,
          NULL::timestamptz AS post_created_at,
          NULL::timestamptz AS post_updated_at
        FROM target_user t
        JOIN group_invite_redemptions r ON r.user_id = t.user_id
        LEFT JOIN groups g ON g.group_id = r.group_id

        UNION ALL

        -- 5) expressions (no group_id required)
        SELECT
          'expression'::text AS activity_type,
          'member'::text AS activity_role,
          e.created_at AS activity_time,
          COALESCE(e.group_id::text, 'N/A') AS group_id,
          COALESCE(g.group_subject, 'No Group') AS group_subject,
          g.group_location,
          g.group_time,
          NULL::text AS app_status,
          NULL::timestamptz AS app_decided_at,
          NULL::text AS invite_code,
          NULL::timestamptz AS invite_expires_at,
          NULL::int AS invite_usage_count,
          NULL::text AS invite_id,
          NULL::text AS redemption_id,
          e.topic AS expr_topic,
          e.ai_question AS expr_ai_question,
          e.user_answer AS expr_user_answer,
          e.context AS expr_context,
          e.created_at AS expr_created_at,
          NULL::text AS post_content,
          NULL::timestamptz AS post_created_at,
          NULL::timestamptz AS post_updated_at
        FROM target_user t
        JOIN expressions e ON e.user_id = t.user_id
        LEFT JOIN groups g ON g.group_id = e.group_id

        UNION ALL

        -- 6) user_post
        SELECT
          'user_post'::text AS activity_type,
          'author'::text AS activity_role,
          up.created_at AS activity_time,
          up.group_id::text,
          g.group_subject,
          g.group_location,
          g.group_time,
          NULL::text AS app_status,
          NULL::timestamptz AS app_decided_at,
          NULL::text AS invite_code,
          NULL::timestamptz AS invite_expires_at,
          NULL::int AS invite_usage_count,
          NULL::text AS invite_id,
          NULL::text AS redemption_id,
          NULL::text AS expr_topic,
          NULL::text AS expr_ai_question,
          NULL::text AS expr_user_answer,
          NULL::text AS expr_context,
          NULL::timestamptz AS expr_created_at,
          up.post_content AS post_content,
          up.created_at AS post_created_at,
          up.updated_at AS post_updated_at
        FROM target_user t
        JOIN user_post up ON up.user_id = t.user_id
        LEFT JOIN groups g ON g.group_id = up.group_id
      )
      SELECT * FROM timeline
      ORDER BY activity_time DESC, activity_type
    `;

    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error getting user timeline: ', err);
    res.status(500).json({ error: 'Timeline query failed', details: err.message });
  }
});

// Get user timeline by search params (email, username, or first_name)
app.get('/users/timeline/search', async (req, res) => {
  const { email, username, first_name } = req.query;

  if (!email && !username && !first_name) {
    return res.status(400).json({ error: 'At least one search parameter is required' });
  }

  try {
    // First, find the user
    let userConditions = [];
    let userParams = [];
    let paramCount = 1;

    if (email) {
      userConditions.push(`email ILIKE $${paramCount}`);
      userParams.push(`%${email}%`);
      paramCount++;
    }
    if (username) {
      userConditions.push(`username ILIKE $${paramCount}`);
      userParams.push(`%${username}%`);
      paramCount++;
    }
    if (first_name) {
      userConditions.push(`first_name ILIKE $${paramCount}`);
      userParams.push(`%${first_name}%`);
      paramCount++;
    }

    const userQuery = `
      SELECT user_id, username, email, first_name, user_focus, look_for_gender,
             user_summary, top_user, interests, summary, connection_type, age_preference
      FROM users
      WHERE ${userConditions.join(' OR ')}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const userResult = await pool.query(userQuery, userParams);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Now get their timeline
    const timelineQuery = `
      WITH target_user AS (
        SELECT user_id
        FROM users
        WHERE user_id = $1
      ),
      timeline AS (
        SELECT
          'joined_group'::text AS activity_type,
          'member'::text AS activity_role,
          gm.joined_at AS activity_time,
          gm.group_id::text,
          g.group_subject,
          g.group_location,
          g.group_time,
          NULL::text AS app_status,
          NULL::timestamptz AS app_decided_at,
          NULL::text AS invite_code,
          NULL::timestamptz AS invite_expires_at,
          NULL::int AS invite_usage_count,
          NULL::text AS invite_id,
          NULL::text AS redemption_id,
          NULL::text AS expr_topic,
          NULL::text AS expr_ai_question,
          NULL::text AS expr_user_answer,
          NULL::text AS expr_context,
          NULL::timestamptz AS expr_created_at,
          NULL::text AS post_content,
          NULL::timestamptz AS post_created_at,
          NULL::timestamptz AS post_updated_at
        FROM target_user t
        JOIN group_members gm ON gm.user_id = t.user_id
        JOIN groups g ON g.group_id = gm.group_id
        WHERE g.is_delete = 'N' OR g.is_delete IS NULL

        UNION ALL

        SELECT
          'applied_to_group'::text AS activity_type,
          'applicant'::text AS activity_role,
          ga.created_at AS activity_time,
          ga.group_id::text,
          g.group_subject,
          g.group_location,
          g.group_time,
          ga.status::text AS app_status,
          ga.decided_at AS app_decided_at,
          NULL::text AS invite_code,
          NULL::timestamptz AS invite_expires_at,
          NULL::int AS invite_usage_count,
          NULL::text AS invite_id,
          NULL::text AS redemption_id,
          NULL::text AS expr_topic,
          NULL::text AS expr_ai_question,
          NULL::text AS expr_user_answer,
          NULL::text AS expr_context,
          NULL::timestamptz AS expr_created_at,
          NULL::text AS post_content,
          NULL::timestamptz AS post_created_at,
          NULL::timestamptz AS post_updated_at
        FROM target_user t
        JOIN group_applications ga ON ga.applicant_user_id = t.user_id
        LEFT JOIN groups g ON g.group_id = ga.group_id

        UNION ALL

        SELECT
          'created_invite'::text AS activity_type,
          'inviter'::text AS activity_role,
          ic.created_at AS activity_time,
          ic.group_id::text,
          g.group_subject,
          g.group_location,
          g.group_time,
          NULL::text AS app_status,
          NULL::timestamptz AS app_decided_at,
          TRIM(ic.invite_code) AS invite_code,
          ic.expires_at AS invite_expires_at,
          ic.usage_count AS invite_usage_count,
          ic.invite_id::text AS invite_id,
          NULL::text AS redemption_id,
          NULL::text AS expr_topic,
          NULL::text AS expr_ai_question,
          NULL::text AS expr_user_answer,
          NULL::text AS expr_context,
          NULL::timestamptz AS expr_created_at,
          NULL::text AS post_content,
          NULL::timestamptz AS post_created_at,
          NULL::timestamptz AS post_updated_at
        FROM target_user t
        JOIN group_invite_codes ic ON ic.inviter_id = t.user_id
        LEFT JOIN groups g ON g.group_id = ic.group_id
        WHERE ic.is_active = true

        UNION ALL

        SELECT
          'redeemed_invite'::text AS activity_type,
          'invitee'::text AS activity_role,
          r.redeemed_at AS activity_time,
          r.group_id::text,
          g.group_subject,
          g.group_location,
          g.group_time,
          NULL::text AS app_status,
          NULL::timestamptz AS app_decided_at,
          NULL::text AS invite_code,
          NULL::timestamptz AS invite_expires_at,
          NULL::int AS invite_usage_count,
          r.invite_id::text AS invite_id,
          r.redemption_id::text AS redemption_id,
          NULL::text AS expr_topic,
          NULL::text AS expr_ai_question,
          NULL::text AS expr_user_answer,
          NULL::text AS expr_context,
          NULL::timestamptz AS expr_created_at,
          NULL::text AS post_content,
          NULL::timestamptz AS post_created_at,
          NULL::timestamptz AS post_updated_at
        FROM target_user t
        JOIN group_invite_redemptions r ON r.user_id = t.user_id
        LEFT JOIN groups g ON g.group_id = r.group_id

        UNION ALL

        SELECT
          'expression'::text AS activity_type,
          'member'::text AS activity_role,
          e.created_at AS activity_time,
          COALESCE(e.group_id::text, 'N/A') AS group_id,
          COALESCE(g.group_subject, 'No Group') AS group_subject,
          g.group_location,
          g.group_time,
          NULL::text AS app_status,
          NULL::timestamptz AS app_decided_at,
          NULL::text AS invite_code,
          NULL::timestamptz AS invite_expires_at,
          NULL::int AS invite_usage_count,
          NULL::text AS invite_id,
          NULL::text AS redemption_id,
          e.topic AS expr_topic,
          e.ai_question AS expr_ai_question,
          e.user_answer AS expr_user_answer,
          e.context AS expr_context,
          e.created_at AS expr_created_at,
          NULL::text AS post_content,
          NULL::timestamptz AS post_created_at,
          NULL::timestamptz AS post_updated_at
        FROM target_user t
        JOIN expressions e ON e.user_id = t.user_id
        LEFT JOIN groups g ON g.group_id = e.group_id

        UNION ALL

        SELECT
          'user_post'::text AS activity_type,
          'author'::text AS activity_role,
          up.created_at AS activity_time,
          up.group_id::text,
          g.group_subject,
          g.group_location,
          g.group_time,
          NULL::text AS app_status,
          NULL::timestamptz AS app_decided_at,
          NULL::text AS invite_code,
          NULL::timestamptz AS invite_expires_at,
          NULL::int AS invite_usage_count,
          NULL::text AS invite_id,
          NULL::text AS redemption_id,
          NULL::text AS expr_topic,
          NULL::text AS expr_ai_question,
          NULL::text AS expr_user_answer,
          NULL::text AS expr_context,
          NULL::timestamptz AS expr_created_at,
          up.post_content AS post_content,
          up.created_at AS post_created_at,
          up.updated_at AS post_updated_at
        FROM target_user t
        JOIN user_post up ON up.user_id = t.user_id
        LEFT JOIN groups g ON g.group_id = up.group_id
      )
      SELECT * FROM timeline
      ORDER BY activity_time DESC, activity_type
    `;

    const timelineResult = await pool.query(timelineQuery, [user.user_id]);

    res.json({
      user: user,
      timeline: timelineResult.rows
    });
  } catch (err) {
    console.error('Error searching user timeline: ', err);
    res.status(500).json({ error: 'Timeline search failed', details: err.message });
  }
});

app.listen(3000, () => {
  console.log('🚀 Server listening on port 3000');
  console.log('📊 Using REAL AWS DATABASE');
  console.log('');
});
