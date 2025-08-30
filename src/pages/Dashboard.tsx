import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Calendar, Filter, Code, Database, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("12");

  // Sample data for demonstration
  const cohortData = [
    { month: "2024-01", month0: 100, month1: 72, month2: 58, month3: 45 },
    { month: "2024-02", month0: 120, month1: 85, month2: 68, month3: 52 },
    { month: "2024-03", month0: 95, month1: 71, month2: 55, month3: 42 },
  ];

  const churnData = [
    { user_id: "USR001", last_order: "2024-01-15", region: "North America", total_spent: 450 },
    { user_id: "USR002", last_order: "2024-01-18", region: "Europe", total_spent: 320 },
    { user_id: "USR003", last_order: "2024-01-20", region: "Asia", total_spent: 180 },
  ];

  const highValueCustomers = [
    { user_id: "USR101", region: "North America", total_spent: 2450, order_count: 15 },
    { user_id: "USR102", region: "Europe", total_spent: 2200, order_count: 12 },
    { user_id: "USR103", region: "Asia", total_spent: 1950, order_count: 18 },
  ];

  const sqlQueries = {
    cohort: `WITH cohort_months AS (
  SELECT 
    user_id,
    DATE_TRUNC('month', signup_date) as cohort_month
  FROM users
),
user_activities AS (
  SELECT 
    cm.user_id,
    cm.cohort_month,
    DATE_TRUNC('month', o.order_date) as activity_month,
    EXTRACT(months FROM AGE(o.order_date, cm.cohort_month)) as month_number
  FROM cohort_months cm
  LEFT JOIN orders o ON cm.user_id = o.user_id
)
SELECT 
  cohort_month,
  COUNT(DISTINCT CASE WHEN month_number = 0 THEN user_id END) as month_0,
  COUNT(DISTINCT CASE WHEN month_number = 1 THEN user_id END) as month_1,
  COUNT(DISTINCT CASE WHEN month_number = 2 THEN user_id END) as month_2
FROM user_activities
GROUP BY cohort_month
ORDER BY cohort_month;`,
    churn: `SELECT 
  u.user_id,
  u.region,
  MAX(o.order_date) as last_order_date,
  SUM(o.amount) as total_spent
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
GROUP BY u.user_id, u.region
HAVING MAX(o.order_date) < CURRENT_DATE - INTERVAL '60 days'
   OR MAX(o.order_date) IS NULL
ORDER BY last_order_date DESC NULLS LAST;`,
    highValue: `SELECT 
  u.user_id,
  u.region,
  SUM(o.amount) as total_spent,
  COUNT(o.order_id) as order_count
FROM users u
JOIN orders o ON u.user_id = o.user_id
GROUP BY u.user_id, u.region
ORDER BY total_spent DESC
LIMIT 10;`
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-semibold text-foreground">Retention Dashboard</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/upload">
                <Button variant="outline">Upload Data</Button>
              </Link>
              <Badge variant="outline" className="bg-primary/5">
                <Database className="mr-1 h-3 w-3" />
                Connect Supabase to enable live data
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filters & Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Region</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="north-america">North America</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia">Asia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Period (Months)</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">Last 6 Months</SelectItem>
                    <SelectItem value="12">Last 12 Months</SelectItem>
                    <SelectItem value="24">Last 24 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input type="date" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Sections */}
        <Tabs defaultValue="cohort" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
            <TabsTrigger value="retention">Retention Heatmap</TabsTrigger>
            <TabsTrigger value="churn">Churn Analysis</TabsTrigger>
            <TabsTrigger value="high-value">High-Value Customers</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          </TabsList>

          {/* Cohort Analysis */}
          <TabsContent value="cohort">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-chart-1" />
                    Cohort Analysis
                  </CardTitle>
                  <CardDescription>
                    Track user retention by signup month cohorts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">SQL Query</span>
                        <Button variant="outline" size="sm">
                          <Code className="mr-1 h-3 w-3" />
                          Copy Query
                        </Button>
                      </div>
                      <pre className="text-xs text-muted-foreground overflow-x-auto">
                        {sqlQueries.cohort}
                      </pre>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cohort Month</TableHead>
                          <TableHead>Month 0</TableHead>
                          <TableHead>Month 1</TableHead>
                          <TableHead>Month 2</TableHead>
                          <TableHead>Month 3</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cohortData.map((row) => (
                          <TableRow key={row.month}>
                            <TableCell className="font-medium">{row.month}</TableCell>
                            <TableCell>
                              <Badge className="bg-chart-1/10 text-chart-1">{row.month0}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-chart-2/10 text-chart-2">{row.month1}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-chart-3/10 text-chart-3">{row.month2}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-chart-4/10 text-chart-4">{row.month3}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Churn Analysis */}
          <TabsContent value="churn">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
                  Churn Analysis
                </CardTitle>
                <CardDescription>
                  Customers with no orders in the last 60 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">SQL Query</span>
                      <Button variant="outline" size="sm">
                        <Code className="mr-1 h-3 w-3" />
                        Copy Query
                      </Button>
                    </div>
                    <pre className="text-xs text-muted-foreground overflow-x-auto">
                      {sqlQueries.churn}
                    </pre>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Last Order</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Total Spent</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {churnData.map((row) => (
                        <TableRow key={row.user_id}>
                          <TableCell className="font-medium">{row.user_id}</TableCell>
                          <TableCell>{row.last_order}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{row.region}</Badge>
                          </TableCell>
                          <TableCell>${row.total_spent}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* High-Value Customers */}
          <TabsContent value="high-value">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-success" />
                  High-Value Customers
                </CardTitle>
                <CardDescription>
                  Top 10 customers by total spending
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">SQL Query</span>
                      <Button variant="outline" size="sm">
                        <Code className="mr-1 h-3 w-3" />
                        Copy Query
                      </Button>
                    </div>
                    <pre className="text-xs text-muted-foreground overflow-x-auto">
                      {sqlQueries.highValue}
                    </pre>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Order Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {highValueCustomers.map((row, index) => (
                        <TableRow key={row.user_id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-success/10 text-success">#{index + 1}</Badge>
                              <span>{row.user_id}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{row.region}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">${row.total_spent}</TableCell>
                          <TableCell>{row.order_count} orders</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Retention Heatmap Placeholder */}
          <TabsContent value="retention">
            <Card>
              <CardHeader>
                <CardTitle>Retention Heatmap</CardTitle>
                <CardDescription>Visual retention matrix by cohort</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Interactive heatmap visualization will appear here</p>
                    <p className="text-sm text-muted-foreground">Connect Supabase to enable live data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Trends Placeholder */}
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trends</CardTitle>
                <CardDescription>Revenue growth and trends analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Revenue trend charts will appear here</p>
                    <p className="text-sm text-muted-foreground">Connect Supabase to enable live data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;