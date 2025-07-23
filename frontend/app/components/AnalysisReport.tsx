import React, { Dispatch, SetStateAction } from "react";
import {
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Target,
  Lightbulb,
} from "lucide-react";
import { FeedbackSection, AnalysisResult } from "../types/types";

function AnalysisReport({
  analysisResult,
  setAnalysisResult,
  setSelectedFile,
}: {
  analysisResult: AnalysisResult | null;
  setAnalysisResult: Dispatch<SetStateAction<AnalysisResult | null>>;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
}) {
  if (!analysisResult) {
    return (
      <div className="text-center text-gray-500">
        No analysis data available.
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5" />;
    if (score >= 60) return <AlertCircle className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resume Analysis Results
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div
              className={`px-6 py-3 rounded-full ${getScoreColor(
                analysisResult.overallScore
              )}`}
            >
              <div className="flex items-center gap-2">
                {getScoreIcon(analysisResult.overallScore)}
                <span className="text-xl font-bold">
                  Overall Score: {analysisResult.overallScore}/100
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setAnalysisResult(null);
                setSelectedFile(null);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Analyze Another Resume
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Detailed Analysis
            </h2>

            {analysisResult.sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h3>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                      section.score
                    )}`}
                  >
                    {section.score}/100
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{section.feedback}</p>

                {section.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Suggestions:
                    </h4>
                    <ul className="space-y-1">
                      {section.suggestions.map((suggestion, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-600 flex items-start gap-2"
                        >
                          <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
                <Star className="w-6 h-6" />
                Key Strengths
              </h2>
              <ul className="space-y-3">
                {analysisResult.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                Areas for Improvement
              </h2>
              <ul className="space-y-3">
                {analysisResult.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6" />
                Key Recommendations
              </h2>
              <ul className="space-y-3">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisReport;
