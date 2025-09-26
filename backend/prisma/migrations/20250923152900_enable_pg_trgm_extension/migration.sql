-- Enable pg_trgm extension for trigram similarity matching
-- This extension provides better fuzzy text matching, especially useful for Thai language search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create an index on the places.name column to improve trigram search performance
CREATE INDEX IF NOT EXISTS places_name_trgm_idx ON places USING gin (name gin_trgm_ops);

-- Create an index on the people.name and people.surname columns to improve trigram search performance
CREATE INDEX IF NOT EXISTS people_name_trgm_idx ON people USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS people_surname_trgm_idx ON people USING gin (surname gin_trgm_ops);

