-- Run before/after indexes to compare query plans

-- Without index (~40ms, Seq Scan):
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, title FROM items
WHERE status = 'ACTIVE' AND location_name = 'Hyderabad Airport'
ORDER BY created_at DESC LIMIT 20;

-- With index (<1ms, Index Scan):
-- \i scripts/indexes.sql  -- then run same query again

-- OFFSET deep page (~180ms):
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, title FROM items WHERE status = 'ACTIVE'
ORDER BY created_at DESC LIMIT 10 OFFSET 50000;

-- Keyset same depth (<2ms):
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, title FROM items
WHERE status = 'ACTIVE' AND (created_at, id) < ('2024-06-15 12:00:00', 49000)
ORDER BY created_at DESC, id DESC LIMIT 10;
