import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Upload, Users, TrendingUp, Filter, GitBranch } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Customer Cohort Analytics</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/upload">
                <Button variant="ghost">Data Upload</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Advanced Customer Retention & Cohort Analysis
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            This project demonstrates advanced SQL for cohort retention, churn, and customer value analysis 
            on e-commerce data using Supabase. It highlights how business insights can be derived directly 
            from SQL queries with beautiful data visualizations.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link to="/dashboard">
              <Button size="lg" className="h-12 px-8">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Analytics Dashboard
              </Button>
            </Link>
            <Link to="/upload">
              <Button variant="outline" size="lg" className="h-12 px-8">
                <Upload className="mr-2 h-5 w-5" />
                Upload Data
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-chart-1/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-chart-1" />
              </div>
              <CardTitle>Cohort Analysis</CardTitle>
              <CardDescription>
                Group users by signup month and track retention over time with Month 0, 1, 2+ analysis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-chart-2" />
              </div>
              <CardTitle>Retention Heatmap</CardTitle>
              <CardDescription>
                Visual heatmap showing percentage of retained users in each cohort over time periods
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                <Filter className="h-6 w-6 text-chart-3" />
              </div>
              <CardTitle>Churn Analysis</CardTitle>
              <CardDescription>
                Identify customers with no orders in the last 60 days and analyze churn patterns
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-chart-4/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-chart-4" />
              </div>
              <CardTitle>High-Value Customers</CardTitle>
              <CardDescription>
                Top 10 customers by total spending, segmented by region with detailed analytics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-chart-5/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-chart-5" />
              </div>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>
                Monthly revenue trends with growth analysis and forecasting capabilities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <GitBranch className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Raw SQL Queries</CardTitle>
              <CardDescription>
                View and analyze the actual SQL queries used for each metric and insight
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Technical Details */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">Technical Implementation</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Database Schema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-sm">
                      <strong>Users</strong>: user_id, signup_date, region
                    </code>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <code className="text-sm">
                      <strong>Orders</strong>: order_id, user_id, order_date, amount
                    </code>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span className="text-sm">CSV data upload and processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-accent"></div>
                    <span className="text-sm">Advanced SQL query execution</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-chart-2"></div>
                    <span className="text-sm">Interactive data visualizations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-chart-3"></div>
                    <span className="text-sm">Real-time filtering and analysis</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            Built with React, TypeScript, Supabase, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;