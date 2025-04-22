-- Truncate tables in the correct order to avoid foreign key constraint errors
TRUNCATE TABLE bookings CASCADE;
TRUNCATE TABLE tours CASCADE;
TRUNCATE TABLE events CASCADE;
TRUNCATE TABLE tour_categories CASCADE;
TRUNCATE TABLE event_types CASCADE;
TRUNCATE TABLE destinations CASCADE;
TRUNCATE TABLE admin_logs CASCADE;
TRUNCATE TABLE testimonials CASCADE;

-- Reset any sequence generators
ALTER SEQUENCE IF EXISTS tours_id_seq RESTART;
ALTER SEQUENCE IF EXISTS events_id_seq RESTART;
ALTER SEQUENCE IF EXISTS bookings_id_seq RESTART;
ALTER SEQUENCE IF EXISTS tour_categories_id_seq RESTART;
ALTER SEQUENCE IF EXISTS event_types_id_seq RESTART;
ALTER SEQUENCE IF EXISTS destinations_id_seq RESTART;
ALTER SEQUENCE IF EXISTS admin_logs_id_seq RESTART;
ALTER SEQUENCE IF EXISTS testimonials_id_seq RESTART; 