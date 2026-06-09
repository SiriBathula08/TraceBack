-- Run AFTER first app startup (Hibernate creates the tables first)
-- Usage: psql -U admin -d lostfound -f seed_100k.sql

DO $$
DECLARE
    categories TEXT[] := ARRAY['Electronics','Bags','Clothing','Jewellery','Keys',
                                'Documents','Toys','Sports','Books','Accessories'];
    locations  TEXT[] := ARRAY['Hyderabad Airport','Jubilee Hills','Banjara Hills',
                                'HITEC City','Gachibowli','Secunderabad Station',
                                'Ameerpet Metro','Charminar','Nampally','Kukatpally'];
    statuses   TEXT[] := ARRAY['ACTIVE','ACTIVE','ACTIVE','CLAIMED','RESOLVED'];
    types      TEXT[] := ARRAY['LOST','LOST','FOUND'];
    colors     TEXT[] := ARRAY['Black','White','Red','Blue','Grey','Brown','Green'];
BEGIN
    INSERT INTO items (title, description, category, type, status,
                       location_name, location_lat, location_lng,
                       date_occurred, color, created_at, updated_at, user_id)
    SELECT
        categories[(random()*9)::int + 1] || ' item #' || gs,
        'Description for item ' || gs || ' near ' || locations[(random()*9)::int + 1],
        categories[(random()*9)::int + 1],
        types[(random()*2)::int + 1],
        statuses[(random()*4)::int + 1],
        locations[(random()*9)::int + 1],
        17.3850 + (random() - 0.5) * 0.5,
        78.4867 + (random() - 0.5) * 0.5,
        CURRENT_DATE - (random() * 365)::int,
        colors[(random()*6)::int + 1],
        NOW() - (random() * INTERVAL '365 days'),
        NOW() - (random() * INTERVAL '30 days'),
        1
    FROM generate_series(1, 100000) AS gs;
    RAISE NOTICE 'Seeded 100,000 items.';
END $$;
