TraceBack: Production-Grade Lost & Found Platform

TraceBack is a high-performance, distributed backend and full-stack application designed to handle lost-and-found item tracking at scale. Built with Spring Boot, PostgreSQL, and Redis, the system has been optimized to handle high read loads, minimize database stress through smart caching strategies, and execute lightning-fast queries across millions of records.

🏗️ System Architecture

TraceBack transitions a standard CRUD application into an enterprise-ready distributed system using the Cache-Aside (Lazy Loading) pattern and architectural fail-safes.

                  +-----------------------+
                  |   React Frontend      |
                  +-----------+-----------+
                              |
                           Vite / REST API
                              v
                  +-----------------------+
                  |   Spring Boot App     |
                  +---+---------------+---+
                      |               |
          Cache Lookup|               | DB Fallback / Writes
         (Cache-Aside)|               |
                      v               v
            +-----------+       +-----------+
            |   Redis   |       | PostgreSQL|
            |   Cache   |       |  Database |
            +-----------+       +-----------+

Key Architectural PatternsCache-Aside Pattern:

Read requests check Redis first. On a cache miss, data is fetched from PostgreSQL, written back to Redis with a strict 60-minute Time-To-Live (TTL), and returned to the user.Graceful Cache Degradation: Powered by a custom CacheErrorHandler. If your Redis cluster undergoes an outage or network split, the backend intercepts the failure, logs a [Cache DEGRADED] warning, and silently routes 100% of traffic directly to PostgreSQL without a single client-facing crash.Polymorphic JSON Serialization: Configured with a dedicated, isolated Jackson ObjectMapper containing type-safety details for Redis, ensuring Spring MVC’s REST endpoints remain generic and standard-compliant.

⚡ Performance Optimizations & Benchmarks

The database layer was engineered to withstand high data density and deeply nested page requests.1. Sequential Scan Elimination (Composite Indexing)
1.Standard single-column indexes fail under complex query filtering. Two production-grade composite B-Tree indexes were designed based on query selectivity patterns:
idx_items_status_location: (status, location_name) — Optimizes core geolocation search.idx_items_type_status_category: (type, status, category) — Powers primary dashboard filters.

Benchmark (100k Realistic Rows Scale):
SQL
-- Before Indexing (Full Sequential Table Scan)
EXPLAIN ANALYZE SELECT * FROM items WHERE status = 'COMPLETED' AND location_name = 'Hyderabad';
-- Execution Time: 42.15 ms

-- After Composite B-Tree Indexing (Index Scan)
EXPLAIN ANALYZE SELECT * FROM items WHERE status = 'COMPLETED' AND location_name = 'Hyderabad';
-- Execution Time: 0.38 ms (99.1% Latency Reduction)

2. Keyset (Cursor) Pagination vs OFFSET
Traditional LIMIT X OFFSET Y pagination forces the database to read and discard Y records sequentially, creating an O(N) performance degradation on deep pages. TraceBack utilizes Keyset Pagination via a composite cursor (createdAt, id) allowing the database to jump directly to the target row cluster in O(log N) time.
Page 1 (Offset vs Keyset): Both execute under 2ms.
Page 5,000 (Deep Pagination): OFFSET queries degrade to 180ms+. Keyset cursor queries maintain stable execute speeds under 2ms (a 98.8% improvement).

🛠️ Tech Stack

Backend Framework: Spring Boot 3.x (Java 17).
Database: PostgreSQL (Relational persistence, optimized connection pooling via HikariCP)
Caching Layer: Redis (Distributed data structures, allkeys-lru eviction policy)
Security: Spring Security, JWT (JSON Web Tokens) with sliding-window Refresh Token rotation.
Frontend Framework: React (Vite, TailwindCSS, Axios API Client)
DevOps & Infrastructure: Docker (Multi-stage layered JAR builds), GitHub Actions (CI/CD)

🚀 Getting Started (Docker Compose Deployment)

The entire infrastructure—including database initialization scripts, seed data, configuration profiles, and environment setups—is fully containerized.
Prerequisites
Docker & Docker Compose installed.
One-Command Spin Up
Clone the repository and run the following command in the root project folder:
Bash
docker-compose up --build
This brings up all structural tiers simultaneously:
PostgreSQL Container: Auto-executes seed_100k.sql and injects production composite indexes.
Redis Container: Boots with performance pool limits tailored for fast internal execution.
Spring Boot Backend Container: Leverages health-check gating; it intentionally pauses its own compilation boot sequences until it verifies both PostgreSQL and Redis ports are fully healthy and receiving active handshakes
.React Frontend Container: Served locally on Vite dev environment.

📁 Key Technical ImplementationsRedis
Config.java & CacheConfig.java: Centralizes customized cache keys to avoid naming collisions and binds transaction-aware caching.ItemRepository.java: Outlines the native PostgreSQL cursor-seeking queries driving keyset pagination.Multi-Stage Dockerfile: Separates dependency resolution from the final runtime image build, producing a minimal application image using layered JARs running under a secure non-root OS user profile.
            
