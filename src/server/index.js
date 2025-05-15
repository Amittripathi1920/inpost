import path from 'path';
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load .env variables
dotenv.config();

// ESM __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// // Import Groq generation route
// import generatePostRoute from '../api/generatePost.js';

// Supabase client setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Mount Groq generation API
app.use('/api', generatePostRoute);

// Health check
app.get('/api/db/ping', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) throw error;
    res.status(200).json({ message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Failed to connect to database: ' + error.message });
  }
});

// DB Init
app.post('/api/db/init', async (req, res) => {
  try {
    const { error: userError } = await supabase.from('users').upsert([{
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123',
      profile_image: 'https://i.pravatar.cc/150?u=demo'
    }]);
    if (userError) throw userError;

    const { error: postsError } = await supabase.from('posts').upsert([{
      user_id: 1,
      topic: 'Leadership',
      content: 'Today marks an important milestone in my leadership journey.',
      hashtags: '#Leadership #PersonalGrowth #TeamEmpowerment',
      length: 'medium',
      language: 'english',
      tone: 'professional',
      experience: 'intermediate',
    }]);
    if (postsError) throw postsError;

    const { error: optionsError } = await supabase.from('options').upsert([
      { category: 'topics', name: 'Leadership', value: 'Leadership', order_position: 1 },
      { category: 'lengths', name: 'Short', value: 'short', order_position: 1 },
      { category: 'languages', name: 'English', value: 'english', order_position: 1 },
      { category: 'tones', name: 'Professional', value: 'professional', order_position: 1 },
      { category: 'experiences', name: 'Beginner', value: 'beginner', order_position: 1 }
    ]);
    if (optionsError) throw optionsError;

    res.status(200).json({ message: 'Database initialized successfully with demo data' });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize database: ' + error.message });
  }
});

// Users
app.get('/api/db/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users: ' + error.message });
  }
});

app.get('/api/db/users/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user: ' + error.message });
  }
});

app.post('/api/db/users', async (req, res) => {
  try {
    const { name, email, password, profile_image } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const { data, error } = await supabase.from('users').insert([{ name, email, password, profile_image }]);
    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user: ' + error.message });
  }
});

// Posts
app.get('/api/db/posts', async (req, res) => {
  try {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts: ' + error.message });
  }
});

app.post('/api/db/posts', async (req, res) => {
  try {
    const { user_id, topic, content, hashtags, length, language, tone, experience } = req.body;
    if (!user_id || !topic || !content || !length || !language || !tone || !experience) {
      return res.status(400).json({ error: 'Missing required post fields' });
    }

    const { data, error } = await supabase.from('posts').insert([{
      user_id, topic, content, hashtags, length, language, tone, experience
    }]);
    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post: ' + error.message });
  }
});

// Settings
app.get('/api/db/settings', async (req, res) => {
  try {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings: ' + error.message });
  }
});

app.put('/api/db/settings/:name', async (req, res) => {
  try {
    const { value } = req.body;
    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required' });
    }

    const { error } = await supabase
      .from('settings')
      .upsert([{ name: req.params.name, value }]);
    if (error) throw error;

    res.status(200).json({ message: 'Setting updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting: ' + error.message });
  }
});

// Options
app.get('/api/db/options', async (req, res) => {
  try {
    const { category } = req.query;
    const { data, error } = await supabase
      .from('options')
      .select('*')
      .eq('category', category)
      .order('order_position', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch options: ' + error.message });
  }
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

export default app;
