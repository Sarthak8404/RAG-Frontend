"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AskPage() {
  const [query, setQuery] = useState("");
  const [k, setK] = useState(5);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch("https://rag-backend-kyl8.onrender.com/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, k }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading && query.trim()) {
      askQuestion();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span>❓</span> Ask a Question
        </h1>
        <p className="text-gray-500 mt-1">
          Get AI-powered answers from your document knowledge base
        </p>
      </div>

      {/* Query Input Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Question</CardTitle>
          <CardDescription>
            Ask anything about your uploaded documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="query">Question</Label>
            <Input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., What is the main topic of the document?"
              className="text-base"
            />
          </div>

          <div className="flex items-end gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="k">Number of References (k)</Label>
              <Input
                id="k"
                type="number"
                value={k}
                onChange={(e) => setK(Number(e.target.value))}
                min="1"
                max="20"
                className="w-24"
              />
            </div>

            <Button
              onClick={askQuestion}
              disabled={!query.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 px-8"
              size="lg"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Asking...
                </>
              ) : (
                "Ask"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-4">
          {/* Answer Card */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span>💡</span> Answer
                </CardTitle>
                <Badge variant={result.cached ? "default" : "secondary"}>
                  {result.cached ? "🚀 Cached" : "🔍 Fresh"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{result.answer}</p>
            </CardContent>
          </Card>

          {/* References Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📚</span> References
              </CardTitle>
              <CardDescription>
                Source documents used to generate this answer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result.references?.length > 0 ? (
                <div className="space-y-3">
                  {result.references.map((ref, i) => (
                    <Card key={i} className="bg-gray-50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            Doc {ref.docId}
                          </Badge>
                          <Badge variant="outline">Page {ref.page}</Badge>
                          <Badge className="ml-auto bg-blue-600">
                            Ref {i + 1}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {ref.text}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    No references found for this query
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">🤔</div>
            <h3 className="text-lg font-semibold mb-2">Ready to help!</h3>
            <p className="text-gray-500 max-w-md">
              Type your question above and press Ask to get AI-powered answers
              from your documents.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}