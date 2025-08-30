import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Calendar, Filter, Code, Database, TrendingUp, Users, AlertTriangle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { AnalyticsChart } from "@/components/AnalyticsChart";

const Dashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("12");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { 
    cohortData, 
    churnData, 
    highValueCustomers, 
    revenueData, 
    loading, 
    error, 
    refetch 
  } = useAnalytics({ 
    selectedRegion, 
    selectedPeriod, 
    startDate, 
    endDate 
  });

  const sqlQueries = {
    cohort: `WITH cohort_months AS (
  SELECT 
    u.user_id,
    DATE_TRUNC('month', u.signup_date) as cohort_month,
    u.region
  FROM users u
  ${selectedRegion !== "all" ? `WHERE u.region = '${selectedRegion}'` : ''}
),
user_activities AS (
  SELECT 
    cm.user_id,
    cm.cohort_month,
    DATE_TRUNC('month', o.order_date) as activity_month,
    EXTRACT(month FROM AGE(o.order_date, cm.cohort_month)) as month_number
  FROM cohort_months cm
  LEFT JOIN orders o ON cm.user_id = o.user_id
)
SELECT 
  TO_CHAR(cohort_month, 'YYYY-MM') as cohort_month,
  COUNT(DISTINCT CASE WHEN month_number = 0 THEN user_id END) as month_0,
  COUNT(DISTINCT CASE WHEN month_number = 1 THEN user_id END) as month_1,
  COUNT(DISTINCT CASE WHEN month_number = 2 THEN user_id END) as month_2,
  COUNT(DISTINCT CASE WHEN month_number = 3 THEN user_id END) as month_3
FROM user_activities
GROUP BY cohort_month
ORDER BY cohort_month;`,
    churn: `SELECT 
  u.user_id,
  u.region,
  MAX(o.order_date) as last_order_date,
  COALESCE(SUM(o.amount), 0) as total_spent
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
${selectedRegion !== "all" ? `WHERE u.region = '${selectedRegion}'` : ''}
GROUP BY u.user_id, u.region
HAVING MAX(o.order_date) < CURRENT_DATE - INTERVAL '60 days'
   OR MAX(o.order_date) IS NULL
ORDER BY last_order_date DESC NULLS LAST
LIMIT 20;`,
    highValue: `SELECT 
  u.user_id,
  u.region,
  SUM(o.amount) as total_spent,
  COUNT(o.order_id) as order_count
FROM users u
JOIN orders o ON u.user_id = o.user_id
${selectedRegion !== "all" ? `WHERE u.region = '${selectedRegion}'` : ''}
GROUP BY u.user_id, u.region
ORDER BY total_spent DESC
LIMIT 10;`,
    revenue: `SELECT 
  TO_CHAR(DATE_TRUNC('month', o.order_date), 'YYYY-MM') as month,
  SUM(o.amount) as revenue
FROM orders o
JOIN users u ON o.user_id = u.user_id
${selectedRegion !== "all" ? `WHERE u.region = '${selectedRegion}'` : ''}
GROUP BY DATE_TRUNC('month', o.order_date)
ORDER BY month;`
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
              <Button 
                variant="outline" 
                onClick={refetch}
                disabled={loading}
                size="sm"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <Database className="mr-1 h-3 w-3" />
                Live Supabase Data Connected
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
                    <SelectItem value="North America">North America</SelectItem>
                    <SelectItem value="Europe">Europe</SelectItem>
                    <SelectItem value="Asia">Asia</SelectItem>
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
                <Input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm font-medium">Error: {error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics Sections */}
        <Tabs defaultValue="cohort" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
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
                  <div className="space-y-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">SQL Query</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(sqlQueries.cohort)}
                        >
                          <Code className="mr-1 h-3 w-3" />
                          Copy Query
                        </Button>
                      </div>
                      <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                        {sqlQueries.cohort}
                      </pre>
                    </div>

                    {loading ? (
                      <div className="flex items-center justify-center h-32">
                        <div className="flex items-center space-x-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">Loading cohort data...</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <AnalyticsChart 
                          data={cohortData}
                          type="bar"
                          xKey="cohort_month"
                          yKey={["month_0", "month_1", "month_2", "month_3"]}
                          title="Cohort Retention by Month"
                          height={300}
                        />
                        
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
                              <TableRow key={row.cohort_month}>
                                <TableCell className="font-medium">{row.cohort_month}</TableCell>
                                <TableCell>
                                  <Badge className="bg-chart-1/10 text-chart-1">{row.month_0}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-chart-2/10 text-chart-2">{row.month_1}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-chart-3/10 text-chart-3">{row.month_2}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-chart-4/10 text-chart-4">{row.month_3}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    )}
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
                <div className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">SQL Query</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(sqlQueries.churn)}
                      >
                        <Code className="mr-1 h-3 w-3" />
                        Copy Query
                      </Button>
                    </div>
                    <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                      {sqlQueries.churn}
                    </pre>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Loading churn data...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="p-4">
                          <div className="text-2xl font-bold text-destructive">{churnData.length}</div>
                          <div className="text-sm text-muted-foreground">Churned Customers</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-2xl font-bold">${churnData.reduce((sum, c) => sum + Number(c.total_spent), 0).toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Lost Revenue</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-2xl font-bold">${(churnData.reduce((sum, c) => sum + Number(c.total_spent), 0) / Math.max(churnData.length, 1)).toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Avg Spent per Churned Customer</div>
                        </Card>
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
                              <TableCell className="font-medium">{row.user_id.slice(0, 8)}...</TableCell>
                              <TableCell>{row.last_order_date || 'No orders'}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{row.region}</Badge>
                              </TableCell>
                              <TableCell>${Number(row.total_spent).toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  )}
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
                <div className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">SQL Query</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(sqlQueries.highValue)}
                      >
                        <Code className="mr-1 h-3 w-3" />
                        Copy Query
                      </Button>
                    </div>
                    <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                      {sqlQueries.highValue}
                    </pre>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Loading high-value customer data...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <AnalyticsChart 
                        data={highValueCustomers}
                        type="bar"
                        xKey="user_id"
                        yKey="total_spent"
                        title="High-Value Customers by Total Spent"
                        height={300}
                      />

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>User ID</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>Total Spent</TableHead>
                            <TableHead>Order Count</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {highValueCustomers.map((row, index) => (
                            <TableRow key={row.user_id}>
                              <TableCell>
                                <Badge className="bg-success/10 text-success">#{index + 1}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">{row.user_id.slice(0, 8)}...</TableCell>
                              <TableCell>
                                <Badge variant="outline">{row.region}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">${Number(row.total_spent).toFixed(2)}</TableCell>
                              <TableCell>{row.order_count} orders</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Trends */}
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-chart-1" />
                  Monthly Revenue Trends
                </CardTitle>
                <CardDescription>Revenue growth and trends analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">SQL Query</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(sqlQueries.revenue)}
                      >
                        <Code className="mr-1 h-3 w-3" />
                        Copy Query
                      </Button>
                    </div>
                    <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                      {sqlQueries.revenue}
                    </pre>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Loading revenue data...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card className="p-4">
                          <div className="text-2xl font-bold text-chart-1">${revenueData.reduce((sum, r) => sum + Number(r.revenue), 0).toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Total Revenue</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-2xl font-bold">${(revenueData.reduce((sum, r) => sum + Number(r.revenue), 0) / Math.max(revenueData.length, 1)).toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Avg Monthly Revenue</div>
                        </Card>
                        <Card className="p-4">
                          <div className="text-2xl font-bold">{revenueData.length}</div>
                          <div className="text-sm text-muted-foreground">Active Months</div>
                        </Card>
                      </div>

                      <AnalyticsChart 
                        data={revenueData}
                        type="line"
                        xKey="month"
                        yKey="revenue"
                        title="Monthly Revenue Trend"
                        height={400}
                      />

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Month</TableHead>
                            <TableHead>Revenue</TableHead>
                            <TableHead>Growth</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {revenueData.map((row, index) => {
                            const prevRevenue = index > 0 ? Number(revenueData[index - 1].revenue) : 0;
                            const currentRevenue = Number(row.revenue);
                            const growth = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue * 100) : 0;
                            
                            return (
                              <TableRow key={row.month}>
                                <TableCell className="font-medium">{row.month}</TableCell>
                                <TableCell>${currentRevenue.toFixed(2)}</TableCell>
                                <TableCell>
                                  {index === 0 ? '-' : (
                                    <Badge 
                                      variant="outline" 
                                      className={growth >= 0 ? 'text-success border-success' : 'text-destructive border-destructive'}
                                    >
                                      {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                                    </Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </>
                  )}
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