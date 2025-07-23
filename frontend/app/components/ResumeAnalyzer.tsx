"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { FeedbackSection, AnalysisResult } from "../types/types";
import AnalysisReport from "./AnalysisReport";
import ErrorMessage from "./ErrorMessage";

export default function ResumeAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setError("");
      } else {
        setError("Please select a valid PDF file");
        setSelectedFile(null);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analyze-resume`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setError("Failed to analyze resume. Please try again.");
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (analysisResult) {
    return (
      <AnalysisReport
        analysisResult={analysisResult}
        setAnalysisResult={setAnalysisResult}
        setSelectedFile={setSelectedFile}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              <FileText className="w-10 h-10 text-red-500" />
              <h1 className="text-3xl font-bold text-gray-900 font-montserrat">
                PDF Resume Analyzer
              </h1>
            </div>
            <p className="text-gray-600 font-light">
              Get AI-powered feedback on your resume quality and structure
            </p>
          </div>

          <div className="space-y-6">
            <div
              onClick={handleUploadClick}
              className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4 group-hover:text-blue-500 transition-colors" />

              {selectedFile ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    Selected file:
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-600 font-medium">
                    Click to upload your PDF resume
                  </p>
                  <p className="text-sm text-gray-500">
                    Maximum file size: 10MB
                  </p>
                </div>
              )}
            </div>

            {error && <ErrorMessage error={error} />}

            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || isAnalyzing}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 font-montserrat tracking-wider text-sm"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ANALYZING...
                </div>
              ) : (
                "ANALYZE RESUME"
              )}
            </button>

            <div className="mt-8 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 text-center">
                What we analyze:
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Content Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Grammar & Style</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Structure & Format</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Skills Relevance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
