---
title: "System Design: URL Shortener"
description: "A complete beginner-to-interview-ready system design walkthrough covering scalability, caching, database design, and trade-offs."
date: "2026-01-15"
readingTime: "10 min read"
category: "System Design"
slug: "system-design-url-shortener"
---

## 1. Introduction

System Design interviews are not about knowing every tool in the ecosystem. They are about showing how you think, how you break down a problem, and how you make reasonable engineering trade-offs.

In this blog, we will design a **URL Shortener system** similar to TinyURL or Bitly. This problem is intentionally chosen because it looks simple on the surface but touches almost every important system design concept: scalability, databases, caching, consistency, and trade-offs.

---

## 2. Problem Statement

We need to design a system that converts a long URL into a short URL. When a user opens the short URL, the system should redirect them to the original long URL with minimal latency.

The system should work reliably even when millions of users are creating and accessing short URLs concurrently.

---

## 3. Why This System Design Is Important (Interview Perspective)

Interviewers frequently ask this problem because it tests clarity of thought rather than memorization. A good answer demonstrates that the candidate can:

- Clarify ambiguous requirements  
- Estimate scale realistically  
- Choose appropriate data stores  
- Optimize for read-heavy traffic  

A poor answer usually jumps straight into tools without understanding the problem constraints.

---

## 4. Requirements Clarification

Before designing any system, we must clearly understand what the system is expected to do.

### 4.1 Functional Requirements

The system should allow users to submit a long URL and receive a unique short URL in return. When someone accesses this short URL, they should be redirected to the original long URL. The mapping between short and long URLs must remain consistent over time.

### 4.2 Non-Functional Requirements

The redirection process should be extremely fast because users expect instant page loads. The system should be highly available, scalable to handle traffic growth, and optimized for a read-heavy workload, since redirects happen far more frequently than URL creation.

---

## 5. Capacity Estimation & Assumptions

Capacity estimation is not about exact numbers but about demonstrating reasoning.

### 5.1 Traffic Assumptions

Let us assume that the system generates around 100 million short URLs per year. This represents a moderately popular URL shortening service.

### 5.2 Read vs Write Ratio

Typically, each short URL is accessed many times after creation. A reasonable assumption is a 100:1 read-to-write ratio, meaning for every URL created, it is accessed around 100 times.

### 5.3 Storage Estimation

Each record needs to store the short code, the original long URL, and some metadata. If we assume an average of 600 bytes per record, storing 100 million URLs would require approximately 60 GB of storage per year, which is manageable for modern databases.

### 5.4 Throughput Estimation

Based on these assumptions, the system may need to handle around 10 write requests per second and roughly 1000 read requests per second. This confirms that the system is heavily read-oriented.

---

## 6. High-Level System Design

At a high level, the system consists of clients, application servers, a cache layer, and a database.

### 6.1 High-Level Architecture Diagram

```
Client
  |
Load Balancer
  |
Application Servers
  |
+-------------------+
|                   |
Cache (Redis)     Database
```

### 6.2 Request Flow (End-to-End)

When a user creates a short URL, the request goes through the load balancer to an application server. The server generates a short code, stores the mapping in the database, and returns the short URL.

For redirection, the server first checks the cache. If the mapping is found, the user is redirected immediately. If not, the server queries the database, updates the cache, and then redirects the user.

---

## 7. API Design

The API layer exposes simple endpoints to interact with the system.

### 7.1 Core APIs

One API is responsible for creating short URLs, while another handles redirection based on the short code.

### 7.2 Request & Response Format

```
POST /shorten
Request: { longUrl }
Response: { shortUrl }
```

---

## 8. Database Design

Choosing the right database is a crucial decision and should be justified clearly.

### 8.1 Database Choice & Justification

A relational database such as MySQL or PostgreSQL is a good initial choice. It provides strong consistency, supports auto-increment IDs (useful for key generation), and keeps the schema simple. At this scale, using NoSQL would add unnecessary complexity.

### 8.2 Schema Design

```
URL_MAPPING
---------------------
id (primary key)
short_code (unique)
long_url
created_at
```

### 8.3 Indexing Strategy

Indexes on the primary key and short code ensure fast lookups during redirection.

---

## 9. Core Component Design

This section explains the most important logic in the system: short URL generation.

### 9.1 Key Generation: Alternatives & Final Choice

A naive approach is to hash the long URL and take a few characters from the hash. However, hashing can lead to collisions and inconsistent results for the same input.

A more reliable approach is to use a global auto-increment counter and convert the numeric ID into a Base62 string. This guarantees uniqueness, keeps URLs short, and performs efficiently.

### 9.2 Data Flow & Edge Handling

The system must handle malformed URLs, retries on failures, and ensure that duplicate requests do not break consistency.

---

## 10. Caching Strategy

Caching is essential because redirection traffic dominates the system load.

### 10.1 Why Caching Is Needed

Without caching, every redirect would hit the database, increasing latency and load. A cache significantly reduces both.

### 10.2 Cache Read & Write Flow

```
Request → Cache
         → Database (on cache miss)
```

### 10.3 Cache Eviction Strategy

Least Recently Used (LRU) eviction combined with TTL-based expiry ensures efficient memory usage.

---

## 11. Scalability & High Availability

As traffic grows, the system must scale horizontally.

### 11.1 Load Balancing

A load balancer distributes incoming traffic evenly across multiple application servers.

### 11.2 Horizontal vs Vertical Scaling

Horizontal scaling is preferred for application servers because it improves fault tolerance and elasticity.

### 11.3 Database Scaling Strategy

Read replicas can handle redirect traffic, while sharding can be introduced later if write volume increases significantly.

---

## 12. Consistency, Reliability & Fault Tolerance

### 12.1 Consistency Model

Strong consistency is required to ensure that every short URL always maps to the correct long URL.

### 12.2 Failure Scenarios

The system should gracefully handle cache failures and database replica lag without affecting users.

### 12.3 Data Recovery Strategy

Regular backups and replication strategies protect against data loss.

---

## 13. Security & Rate Limiting

### 13.1 Abuse Prevention

Rate limiting prevents malicious users from flooding the system with requests.

### 13.2 Authentication / Authorization

Public URL creation may not require authentication, but analytics or admin features should be protected.

---

## 14. Optional & Advanced Features

Advanced features such as URL expiry, custom aliases, and click analytics can be added to enhance functionality and provide better insights.

---

## 15. Trade-offs & Alternative Approaches

Every design decision involves trade-offs. Hash-based keys are simpler but risk collisions. SQL databases offer simplicity and consistency, while NoSQL systems provide scalability at the cost of complexity.

---

## 16. Time & Space Complexity Analysis

Both URL creation and redirection operations run in constant time. Storage grows linearly with the number of URLs.

---

## 17. Common Mistakes Candidates Make

Many candidates skip requirement clarification, avoid capacity estimation, or over-engineer solutions prematurely. These mistakes often cost interview performance.

---

## 18. How to Explain This Design in an Interview

A clear interview explanation starts with requirements, moves through estimation and architecture, and ends with trade-offs. Communication matters as much as the design itself.

---

## 19. Summary & Key Takeaways

The URL Shortener problem demonstrates how simple requirements can lead to complex design decisions. Structured thinking, justified choices, and clarity are the keys to success.

---

## 20. What’s Next?

In the next blog, we will design a **Rate Limiter** and explore Token Bucket and Leaky Bucket algorithms in detail.
