"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 max-w-3xl px-4">
        <div className="inline-block mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <span className="text-3xl">📚</span>
          </div>
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Skillon
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Your AI-powered document assistant
        </p>
        <p className="text-gray-500">
          Upload documents, ask questions, and manage your knowledge base with ease.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full px-4">
        <Card className="hover:shadow-lg transition-shadow border-2 hover:border-blue-200">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">📄</span>
            </div>
            <CardTitle className="text-xl">Manage Documents</CardTitle>
            <CardDescription>
              Upload, organize, and search through your document library
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/docs">
                Go to Documents
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-2 hover:border-green-200">
          <CardHeader>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">❓</span>
            </div>
            <CardTitle className="text-xl">Ask Questions</CardTitle>
            <CardDescription>
              Get instant answers from your documents using AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/ask">
                Start Asking
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-2 hover:border-purple-200">
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <span className="text-2xl">⚙️</span>
            </div>
            <CardTitle className="text-xl">Admin Dashboard</CardTitle>
            <CardDescription>
              Configure settings and manage system preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
              <Link href="/admin">
                Open Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats or Info Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full px-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">Fast</div>
          <p className="text-gray-600">Get answers in seconds</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">Smart</div>
          <p className="text-gray-600">AI-powered understanding</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">Secure</div>
          <p className="text-gray-600">Your data stays private</p>
        </div>
      </div>
    </div>
  );
}