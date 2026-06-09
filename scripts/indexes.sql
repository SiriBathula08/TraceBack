-- Run AFTER first app startup
-- Usage: psql -U admin -d lostfound -f indexes.sql

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_items_status_location
    ON items (status, location_name);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_items_type_status
    ON items (type, status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_items_type_status_category
    ON items (type, status, category);

-- Supports keyset pagination cursor
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_items_status_created_id
    ON items (status, created_at DESC, id DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_items_user_id
    ON items (user_id, created_at DESC);

ANALYZE items;
