-- VOZAZI Database Extensions
-- Run this after creating the database to enable required extensions

-- Enable pgvector for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search with trigram similarity
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create indexes for performance
-- (These will be created automatically by Drizzle ORM migrations)

-- Verify extensions
SELECT extname FROM pg_extension WHERE extname IN ('vector', 'uuid-ossp', 'pg_trgm');
