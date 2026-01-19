const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const {
  mockUsers,
  findUser,
  generateUserTimeline
} = require('./mock-data');

const app = express();

// AWS PostgreSQL connection pool
const pool = new Pool({
  host: 'wander-app-dev.cluster-cfgkii2cxbc.us-east-2.rds.amazonaws.com',
  port: 5432,
  database: 'wander_app',
  user: 'danny',
  password: 'HyFnoXPQT4rN3BL7XYRy',
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000,
});

let dbConnected = false;

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed: ', err.message);
    console.error('\n⚠️  Using MOCK DATA mode');
    console.error('To connect to real database:');
    console.error('1. Connect to VPN if required');
    console.error('2. Verify AWS RDS security group allows your IP');
    console.error('3. Test connection with DBeaver first\n');
    dbConnected = false;
  } else {
    console.log('✅ Connected to AWS PostgreSQL database');
    console.log('Database: wander_app');
    console.log('Host: wander-app-dev.cluster-cfgkii2cxbc.us-east-2.rds.amazonaws.com\n');
    dbConnected = true;
    release();
  }
});

// Enable CORS
app.use(cors());
app.use(express.json());

// Mock data is now imported from mock-data.js

// Get all users
app.get('/users', async (req, res) => {
  console.log('📊 GET /users - Returning mock user data');
  return res.json(mockUsers);

  // Uncomment below when database connection is available
  /*
  if (!dbConnected) {
    console.log('📊 Returning mock user data');
    return res.json(mockUsers);
  }

  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying database: ', err);
    console.log('📊 Falling back to mock data');
    res.json(mockUsers);
  }
  */
});

// Search users by email, username, or first_name
app.get('/users/search', async (req, res) => {
  const { query, type } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  console.log(`📊 Searching mock data for: ${query} (type: ${type || 'all'})`);
  const searchPattern = query.toLowerCase();
  let filtered = mockUsers.filter(user => {
    if (type === 'email') {
      return user.email.toLowerCase().includes(searchPattern);
    } else if (type === 'username') {
      return user.username.toLowerCase().includes(searchPattern);
    } else if (type === 'first_name') {
      return user.first_name.toLowerCase().includes(searchPattern);
    } else {
      return user.email.toLowerCase().includes(searchPattern) ||
             user.username.toLowerCase().includes(searchPattern) ||
             user.first_name.toLowerCase().includes(searchPattern);
    }
  });
  return res.json(filtered);

  // Uncomment below when database connection is available
  /*
  if (!dbConnected) {
    console.log(`📊 Searching mock data for: ${query} (type: ${type || 'all'})`);
    const searchPattern = query.toLowerCase();
    let filtered = mockUsers.filter(user => {
      if (type === 'email') {
        return user.email.toLowerCase().includes(searchPattern);
      } else if (type === 'username') {
        return user.username.toLowerCase().includes(searchPattern);
      } else if (type === 'first_name') {
        return user.first_name.toLowerCase().includes(searchPattern);
      } else {
        return user.email.toLowerCase().includes(searchPattern) ||
               user.username.toLowerCase().includes(searchPattern) ||
               user.first_name.toLowerCase().includes(searchPattern);
      }
    });
    return res.json(filtered);
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
    console.log('📊 Falling back to mock data');
    const searchPattern = query.toLowerCase();
    const filtered = mockUsers.filter(user =>
      user.email.toLowerCase().includes(searchPattern) ||
      user.username.toLowerCase().includes(searchPattern) ||
      user.first_name.toLowerCase().includes(searchPattern)
    );
    res.json(filtered);
  }
  */
});

// Get single user profile
app.get('/users/profile', async (req, res) => {
  const { email, username, first_name } = req.query;

  if (!email && !username && !first_name) {
    return res.status(400).json({ error: 'At least one search parameter is required' });
  }

  console.log('📊 Searching mock profile data');
  const found = mockUsers.find(user => {
    if (email && user.email.toLowerCase().includes(email.toLowerCase())) return true;
    if (username && user.username.toLowerCase().includes(username.toLowerCase())) return true;
    if (first_name && user.first_name.toLowerCase().includes(first_name.toLowerCase())) return true;
    return false;
  });

  if (!found) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json(found);

  // Uncomment below when database connection is available
  /*
  if (!dbConnected) {
    console.log('📊 Searching mock profile data');
    const found = mockUsers.find(user => {
      if (email && user.email.toLowerCase().includes(email.toLowerCase())) return true;
      if (username && user.username.toLowerCase().includes(username.toLowerCase())) return true;
      if (first_name && user.first_name.toLowerCase().includes(first_name.toLowerCase())) return true;
      return false;
    });

    if (!found) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(found);
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
  */
});

// Get user timeline (implements your complex SQL query)
app.get('/users/:userId/timeline', async (req, res) => {
  const userId = parseInt(req.params.userId);

  console.log(`📊 Generating timeline for user ${userId}`);

  const timeline = generateUserTimeline(userId);
  return res.json(timeline);

  // Uncomment below when database connection is available
  /*
  if (!dbConnected) {
    console.log(`📊 Generating mock timeline for user ${userId}`);
    const timeline = generateUserTimeline(userId);
    return res.json(timeline);
  }

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
          gm.group_id,
          g.group_subject,
          g.group_location,
          g.group_time,
          NULL::text AS app_status,
          NULL::timestamptz AS app_decided_at,
          NULL::text AS invite_code,
          NULL::timestamptz AS invite_expires_at,
          NULL::int AS invite_usage_count,
          NULL::uuid AS invite_id,
          NULL::uuid AS redemption_id
        FROM target_user t
        JOIN group_members gm ON gm.user_id = t.user_id
        JOIN groups g ON g.group_id = gm.group_id

        UNION ALL

        -- 2) applied_to_group
        SELECT
          'applied_to_group'::text AS activity_type,
          'applicant'::text AS activity_role,
          ga.created_at AS activity_time,
          ga.group_id,
          g.group_subject,
          g.group_location,
          g.group_time,
          ga.status::text AS app_status,
          ga.decided_at AS app_decided_at,
          NULL::text AS invite_code,
          NULL::timestamptz AS invite_expires_at,
          NULL::int AS invite_usage_count,
          NULL::uuid AS invite_id,
          NULL::uuid AS redemption_id
        FROM target_user t
        JOIN group_applications ga ON ga.applicant_user_id = t.user_id
        LEFT JOIN groups g ON g.group_id = ga.group_id

        UNION ALL

        -- 3) created_invite
        SELECT
          'created_invite'::text AS activity_type,
          'inviter'::text AS activity_role,
          ic.created_at AS activity_time,
          ic.group_id,
          g.group_subject,
          g.group_location,
          g.group_time,
          NULL::text AS app_status,
          NULL::timestamptz AS app_decided_at,
          ic.invite_code AS invite_code,
          ic.expires_at AS invite_expires_at,
          ic.usage_count AS invite_usage_count,
          ic.invite_id AS invite_id,
          NULL::uuid AS redemption_id
        FROM target_user t
        JOIN group_invite_codes ic ON ic.inviter_id = t.user_id
        LEFT JOIN groups g ON g.group_id = ic.group_id

        UNION ALL

        -- 4) redeemed_invite
        SELECT
          'redeemed_invite'::text AS activity_type,
          'invitee'::text AS activity_role,
          r.redeemed_at AS activity_time,
          r.group_id,
          g.group_subject,
          g.group_location,
          g.group_time,
          NULL::text AS app_status,
          NULL::timestamptz AS app_decided_at,
          NULL::text AS invite_code,
          NULL::timestamptz AS invite_expires_at,
          NULL::int AS invite_usage_count,
          r.invite_id AS invite_id,
          r.redemption_id AS redemption_id
        FROM target_user t
        JOIN group_invite_redemptions r ON r.user_id = t.user_id
        LEFT JOIN groups g ON g.group_id = r.group_id
      )
      SELECT * FROM timeline
      ORDER BY activity_time DESC, activity_type
    `;

    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error getting user timeline: ', err);
    console.log('📊 Falling back to mock timeline');
    const timeline = generateUserTimeline(userId);
    res.json(timeline);
  }
  */
});

// Get user timeline by search params (email, username, or first_name)
app.get('/users/timeline/search', async (req, res) => {
  const { email, username, first_name } = req.query;

  if (!email && !username && !first_name) {
    return res.status(400).json({ error: 'At least one search parameter is required' });
  }

  console.log('📊 Searching for user timeline');
  const user = findUser(email, username, first_name);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const timeline = generateUserTimeline(user.user_id);
  return res.json({
    user: user,
    timeline: timeline
  });
});

app.listen(3000, () => {
  console.log('🚀 Server listening on port 3000');
  if (!dbConnected) {
    console.log('📊 Running in MOCK DATA mode');
  }
  console.log('');
});
