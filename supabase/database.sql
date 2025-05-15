
-- users table
CREATE TABLE IF NOT EXISTS public.users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100),
    user_email VARCHAR(150) UNIQUE NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    profile_image TEXT,
    exp_level VARCHAR(255)
);

-- topics table  
CREATE TABLE IF NOT EXISTS public.topics (
    topic_id SERIAL PRIMARY KEY,
    topic_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- influencers table 
CREATE TABLE IF NOT EXISTS public.influencers (
    influencer_id SERIAL PRIMARY KEY,
    influencer_name VARCHAR(100),
    influencer_domain VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- language table
CREATE TABLE IF NOT EXISTS public.language (
    language_id SERIAL PRIMARY KEY,
    language_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- tone table
CREATE TABLE IF NOT EXISTS public.tone (
    tone_id SERIAL PRIMARY KEY,
    tone_name VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- experience_level table
CREATE TABLE IF NOT EXISTS public.experience_level (    exp_name VARCHAR(50),
    exp_level_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- length table
CREATE TABLE length (
    length_id SERIAL PRIMARY KEY,
    length_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- user_topic_preference table
CREATE TABLE IF NOT EXISTS public.user_topic_preference (
CREATE TABLE user_topic_preference (
    id SERIAL PRIMARY KEY,
    user_id INT,
    topic_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (topic_id) REFERENCES topics(topic_id)
);

-- user_generated_post_meta table
CREATE TABLE IF NOT EXISTS public.user_generated_post_meta (
    user_generated_post_id SERIAL PRIMARY KEY,
    user_id INT,
    topic_id INT,
    influencer_id INT,
    length_id INT,
    language_id INT,
    tone_id INT,
    exp_level_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (topic_id) REFERENCES topics(topic_id),
    FOREIGN KEY (influencer_id) REFERENCES influencers(influencer_id),
    FOREIGN KEY (length_id) REFERENCES length(length_id),
    FOREIGN KEY (language_id) REFERENCES language(language_id),
    FOREIGN KEY (tone_id) REFERENCES tone(tone_id),
    FOREIGN KEY (exp_level_id) REFERENCES experience_level(exp_level_id)
);

-- user_generated_post table
CREATE TABLE IF NOT EXISTS public.user_generated_post (
    id SERIAL PRIMARY KEY,
    generated_post TEXT, 
    FOREIGN KEY (id) REFERENCES user_generated_post_meta (user_generated_post_id )
);
