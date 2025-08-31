import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload as UploadIcon, FileText, Database, CheckCircle, AlertCircle, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Upload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const handleFileUpload = (fileType: string) => {
    setUploadStatus("uploading");
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadStatus("success");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
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
                <h1 className="text-xl font-semibold text-foreground">Data Upload</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="outline">View Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">

        <div className="grid gap-8">
          {/* Upload Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                CSV Upload Instructions
              </CardTitle>
              <CardDescription>
                Upload your customer and order data to begin analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Users CSV Format</h4>
                  <div className="p-4 bg-muted rounded-lg">
                    <code className="text-sm">
                      user_id,signup_date,region<br />
                      USR001,2024-01-15,North America<br />
                      USR002,2024-01-18,Europe<br />
                      USR003,2024-02-10,Asia
                    </code>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• user_id: Unique identifier (string)</li>
                    <li>• signup_date: YYYY-MM-DD format</li>
                    <li>• region: Customer's geographic region</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Orders CSV Format</h4>
                  <div className="p-4 bg-muted rounded-lg">
                    <code className="text-sm">
                      order_id,user_id,order_date,amount<br />
                      ORD001,USR001,2024-01-20,125.50<br />
                      ORD002,USR002,2024-01-25,89.99<br />
                      ORD003,USR001,2024-02-01,200.00
                    </code>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• order_id: Unique order identifier</li>
                    <li>• user_id: Must match Users table</li>
                    <li>• order_date: YYYY-MM-DD format</li>
                    <li>• amount: Decimal value (e.g., 125.50)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Users Upload */}
            <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UploadIcon className="mr-2 h-5 w-5 text-chart-1" />
                  Upload Users Data
                </CardTitle>
                <CardDescription>
                  Upload CSV file with user information (user_id, signup_date, region)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-chart-1/50 transition-colors cursor-pointer">
                    <div className="text-center">
                      <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to browse or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">CSV files only</p>
                    </div>
                  </div>
                  
                  {uploadStatus === "uploading" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Uploading users.csv</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  {uploadStatus === "success" && (
                    <Alert className="border-success/20 bg-success/5">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <AlertDescription className="text-success">
                        Users data uploaded successfully! 1,234 records processed.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    onClick={() => handleFileUpload("users")}
                    disabled={uploadStatus === "uploading"}
                    className="w-full"
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Select Users CSV File
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Orders Upload */}
            <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UploadIcon className="mr-2 h-5 w-5 text-chart-2" />
                  Upload Orders Data
                </CardTitle>
                <CardDescription>
                  Upload CSV file with order information (order_id, user_id, order_date, amount)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-chart-2/50 transition-colors cursor-pointer">
                    <div className="text-center">
                      <UploadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to browse or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">CSV files only</p>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleFileUpload("orders")}
                    disabled={uploadStatus === "uploading"}
                    className="w-full"
                    variant="outline"
                  >
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Select Orders CSV File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload Status */}
          <Card>
            <CardHeader>
              <CardTitle>Upload History & Status</CardTitle>
              <CardDescription>
                Track your data uploads and processing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">Sample Users Data</p>
                      <p className="text-sm text-muted-foreground">Uploaded 2 hours ago • 1,234 records</p>
                    </div>
                  </div>
                  <Badge className="bg-success/10 text-success">Processed</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium">Orders Data</p>
                      <p className="text-sm text-muted-foreground">Pending upload</p>
                    </div>
                  </div>
                  <Badge variant="outline">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upload;