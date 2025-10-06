"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DocsPage() {
  const [docs, setDocs] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDocs = async () => {
    const res = await fetch("https://rag-backend-kyl8.onrender.com/api/docs?limit=20&offset=0");
    const data = await res.json();
    setDocs(data.docs || []);
  };

  const fetchStats = async () => {
    const res = await fetch("https://rag-backend-kyl8.onrender.com/api/index/stats");
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    fetchDocs();
    fetchStats();
  }, []);

  const uploadFile = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("https://rag-backend-kyl8.onrender.com/api/docs", {
      method: "POST",
      body: formData,
    });
    await res.json();
    setFile(null);
    setLoading(false);
    fetchDocs();
    fetchStats();
  };

  const rebuildIndex = async () => {
    await fetch("https://rag-backend-kyl8.onrender.com/api/index/rebuild", { method: "POST" });
    fetchStats();
  };

  const viewDoc = async (id) => {
    const res = await fetch(`https://rag-backend-kyl8.onrender.com/api/docs/${id}`);
    const data = await res.json();
    setSelectedDoc(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span>📂</span> Document Manager
          </h1>
          <p className="text-gray-500 mt-1">Upload and manage your documents</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Documents</CardDescription>
              <CardTitle className="text-3xl">{docs.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Chunks</CardDescription>
              <CardTitle className="text-3xl">{stats.totalChunks}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Vector Dimension</CardDescription>
              <CardTitle className="text-3xl">{stats.dimension}</CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Upload a new document to add it to your knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="flex-1"
            />
            <div className="flex gap-2">
              <Button
                onClick={uploadFile}
                disabled={!file || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Uploading..." : "Upload"}
              </Button>
              <Button
                onClick={rebuildIndex}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                🔄 Rebuild Index
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              Click on a document to view its chunks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {docs.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No documents uploaded yet. Upload your first document to get started!
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => viewDoc(doc.id)}
                    className="p-3 rounded-lg border hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{doc.name}</span>
                      <Badge variant="secondary">ID: {doc.id}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Details */}
        <Card>
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
            <CardDescription>
              {selectedDoc
                ? `Viewing chunks for ${selectedDoc.filename}`
                : "Select a document to view its chunks"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDoc ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Badge className="bg-blue-600">{selectedDoc.filename}</Badge>
                  <Badge variant="outline">Doc ID: {selectedDoc.id}</Badge>
                </div>
                {selectedDoc.chunks?.map((c, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Chunk {i + 1}</CardTitle>
                        <Badge variant="secondary">Page {c.page}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {c.text}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  👈 Select a document from the list to view its content chunks
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}