# ShashCode – System Design Blog Template

This file defines the **standard Markdown format and prompt** to be used for all ShashCode system design blogs.

---

## Frontmatter (MANDATORY)

```md
---
title: "System Design: URL Shortener"
description: "A complete beginner-to-interview-ready system design walkthrough covering scalability, caching, database design, and trade-offs."
date: "YYYY-MM-DD"
readingTime: "10 min read"
category: "System Design"
slug: "system-design-url-shortener"
---
```

Rules:
- `slug` must be unique and kebab-case
- `date` format: YYYY-MM-DD
- Keep category naming consistent

---

## Content Structure (STANDARD – DO NOT CHANGE ORDER)

```md
## 1. Introduction

Explain the problem context and why it matters in system design interviews.


## 2. Problem Statement

Clearly define what system we are building and what is out of scope.


## 3. Why This System Design Is Important (Interview Perspective)

Explain why interviewers ask this problem.

- Bullet points allowed where listing makes sense


## 4. Requirements Clarification

### Functional Requirements
- Core features the system must support

### Non-Functional Requirements
- Scalability, latency, availability, consistency, durability


## 5. Capacity Estimation & Constraints

Back-of-the-envelope calculations and realistic assumptions.


## 6. High-Level Design (HLD)

Explain the architecture at a high level.

Example:
Client → API Gateway → Service → Cache → Database


## 7. Key Design Decisions

Discuss important choices and alternatives.

Example:
- Why naive hashing fails
- Why the chosen ID generation strategy works


## 8. Database Design

### Schema
- Tables or collections

### Choice of Database
- SQL vs NoSQL with reasoning


## 9. Caching Strategy

What to cache, where to cache, TTL, eviction strategy.


## 10. API Design

Endpoints with request/response explanation.


## 11. Scalability & Bottlenecks

What breaks first and how the system scales.


## 12. Fault Tolerance & Reliability

Replication, retries, failures, consistency trade-offs.


## 13. Security Considerations

Abuse prevention, validation, rate limiting, access control.


## 14. Trade-offs & Alternatives

What was chosen and what was consciously avoided.


## 15. Summary / Interview Takeaways

How to explain this system in a 2–3 minute interview answer.
```

---

## Writing Style Guidelines

- Prefer paragraphs over bullets
- Use bullets only for checklists or comparisons
- Explain **WHY**, not just **WHAT**
- Keep interview perspective throughout
- Avoid unnecessary jargon

---

## Reusable Prompt (For Generating New Blogs)

```
Write a detailed system design blog in Markdown for the topic:

"System Design: <TOPIC_NAME>"

Follow this STRICT structure and tone:

- Target audience: beginners + interview candidates
- Language: simple, clear, interview-focused
- Style: Medium-quality long-form blog
- Use paragraphs primarily, bullets only when listing makes sense
- No images; use ASCII diagrams if needed
- Explain design decisions and trade-offs clearly
- Think like an interviewer evaluating a candidate

MANDATORY STRUCTURE:
1. Introduction
2. Problem Statement
3. Why This System Design Is Important (Interview Perspective)
4. Requirements Clarification
   - Functional Requirements
   - Non-Functional Requirements
5. Capacity Estimation & Constraints
6. High-Level Design (HLD)
7. Key Design Decisions
8. Database Design
9. Caching Strategy
10. API Design
11. Scalability & Bottlenecks
12. Fault Tolerance & Reliability
13. Security Considerations
14. Trade-offs & Alternatives
15. Summary / Interview Takeaways

At the top, include frontmatter with:
- title
- description
- date
- readingTime
- category
- slug

Ensure the content is interview-ready and explains not just WHAT but WHY.
```

---

End of template.
