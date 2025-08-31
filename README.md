📊 Customer Cohort & Retention Analysis

📌 Project Overview
It is built with Supabase (PostgreSQL) as the backend and a react front-end to display results as interactive dashboards.

🎯 Objectives

Derive actionable business insights from raw order and user data.

Build a dashboard that connects SQL queries → outputs → business interpretation.

Practice storytelling with data, aligning with a Business Analyst role.

🗂️ Dataset & Schema
Users Table
Column	Type	Description
user_id	UUID	Unique ID for each customer
signup_date	DATE	Date when the customer signed up
region	TEXT	Geographic region of the customer
Orders Table
Column	Type	Description
order_id	UUID	Unique ID for each order
user_id	UUID	Foreign key → Users table
order_date	DATE	Date of purchase
amount	DECIMAL	Order value in currency
📊 Dashboards & SQL Queries
🔹 1. Churn Analysis

Query: Identify customers with no orders in the last 60 days.
Insights:

10 churned customers → $4310 lost revenue.

Avg. spend per churned customer: $431.

Business Action: Run win-back campaigns to re-engage these users.

🔹 2. High-Value Customers

Query: Rank top 10 customers by total spending (grouped by region).
Insights:

Top 10% of customers contribute majority of revenue.

Business Action: Introduce loyalty rewards or VIP benefits.

🔹 3. Revenue Trends

Query: Aggregate total revenue by month.
Insights:

Identified seasonal peaks and dips in revenue.

Business Action: Align campaigns & inventory planning with revenue cycles.

🔹 4. Cohort Retention Analysis (Optional Extension)

Query: Track user cohorts by signup month and measure retention across months.
Insights:

Retention drops ~40% by Month 2.

Business Action: Launch early engagement strategies to retain users beyond Month 2.

🛠️ Tech Stack

Database: Supabase (PostgreSQL)

Frontend: React, TailwindCSS

Visualization: Interactive tables, bar/line/heatmap charts

Languages: SQL, JavaScript 

