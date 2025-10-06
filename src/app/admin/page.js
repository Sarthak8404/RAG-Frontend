"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rebuilding, setRebuilding] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res1 = await fetch("http://localhost:5000/api/index/stats");
      const data1 = await res1.json();
      setStats(data1);

      const res2 = await fetch("http://localhost:5000/api/docs?limit=50&offset=0");
      const data2 = await res2.json();
      setDocs(data2.docs || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const rebuildIndex = async () => {
    setRebuilding(true);
    try {
      await fetch("http://localhost:5000/api/index/rebuild", { method: "POST" });
      await fetchData();
    } catch (error) {
      console.error("Failed to rebuild index:", error);
    }
    setRebuilding(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span>⚙️</span> Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            System overview and management tools
          </p>
        </div>
        <Button
          onClick={rebuildIndex}
          disabled={rebuilding}
          variant="destructive"
          className="bg-red-600 hover:bg-red-700"
        >
          {rebuilding ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Rebuilding...
            </>
          ) : (
            <>
              <span className="mr-2">🔄</span>
              Rebuild Index
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                Total Chunks
              </CardDescription>
              <CardTitle className="text-4xl font-bold text-blue-600">
                {stats.totalChunks.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Text segments in vector database
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <span className="text-lg">🎯</span>
                Vector Dimension
              </CardDescription>
              <CardTitle className="text-4xl font-bold text-green-600">
                {stats.dimension}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Embedding size per chunk
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <span className="text-lg">📚</span>
                Total Documents
              </CardDescription>
              <CardTitle className="text-4xl font-bold text-purple-600">
                {docs.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Uploaded to the system
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* System Info Alert */}
      <Alert className="bg-blue-50 border-blue-200">
        <AlertTitle className="flex items-center gap-2">
          <span>ℹ️</span> System Information
        </AlertTitle>
        <AlertDescription>
          The rebuild index operation will re-process all documents and update the
          vector database. This may take a few minutes depending on the number of
          documents.
        </AlertDescription>
      </Alert>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span>📄</span> All Documents
              </CardTitle>
              <CardDescription>
                Complete list of uploaded documents
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {docs.length} docs
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : docs.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {docs.map((doc, index) => (
                <div
                  key={doc.docId}
                  className="flex items-center justify-between p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Badge variant="outline" className="font-mono">
                      #{index + 1}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(doc.uploadDate)}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-purple-600">
                    ID: {doc.docId}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                No documents found. Upload documents to get started!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}