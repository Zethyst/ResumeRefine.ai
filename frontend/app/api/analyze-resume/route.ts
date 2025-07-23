import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdf from 'pdf-parse';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
console.log("GoogleGenerativeAI initialized with API key:", process.env.GEMINI_API_KEY );

const generationConfig = {
  stopSequences: ["red"],
  maxOutputTokens: 20000,
  temperature: 0.8,
  topP: 0.07,
  topK: 30,
};

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, generationConfig as any);

interface FeedbackSection {
  title: string;
  score: number;
  feedback: string;
  suggestions: string[];
}

interface AnalysisResult {
  overallScore: number;
  sections: FeedbackSection[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

const ANALYSIS_PROMPT = `
You are an expert resume reviewer with extensive experience in HR and recruitment. Analyze the following resume text and provide comprehensive feedback.

Please analyze the resume and return your response in the following JSON format:

{
  "overallScore": number (0-100),
  "sections": [
    {
      "title": "Content Quality & Relevance",
      "score": number (0-100),
      "feedback": "detailed feedback string",
      "suggestions": ["suggestion 1", "suggestion 2", ...]
    },
    {
      "title": "Structure & Formatting",
      "score": number (0-100),
      "feedback": "detailed feedback string",
      "suggestions": ["suggestion 1", "suggestion 2", ...]
    },
    {
      "title": "Professional Skills & Experience",
      "score": number (0-100),
      "feedback": "detailed feedback string",
      "suggestions": ["suggestion 1", "suggestion 2", ...]
    },
    {
      "title": "Grammar & Language Quality",
      "score": number (0-100),
      "feedback": "detailed feedback string",
      "suggestions": ["suggestion 1", "suggestion 2", ...]
    }
  ],
  "strengths": ["strength 1", "strength 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "recommendations": ["recommendation 1", "recommendation 2", ...]
}

Evaluation Criteria:
1. **Content Quality & Relevance** (25%): 
   - Relevance of experience to career goals
   - Achievement quantification
   - Industry-specific keywords
   - Value proposition clarity

2. **Structure & Formatting** (25%):
   - Logical flow and organization
   - Consistent formatting
   - Appropriate length
   - Visual appeal and readability

3. **Professional Skills & Experience** (25%):
   - Skills alignment with job market
   - Career progression demonstration
   - Technical and soft skills balance
   - Experience depth and breadth

4. **Grammar & Language Quality** (25%):
   - Grammar and spelling accuracy
   - Professional tone
   - Clear and concise communication
   - Action verb usage

Please provide actionable, specific feedback. Be constructive but honest. Focus on improvements that will make the biggest impact.

Resume Text:
`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    console.log('Received form data:', formData);
    
    const file = formData.get('resume') as File;
    console.log('Form data keys:', Array.from(formData.keys()));
    console.log('Received file:', file.name, 'Type:', file.type, 'Size:', file.size);
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let extractedText: string;
    try {
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text;
    } catch (error) {
      console.error('PDF parsing error:', error);
      return NextResponse.json(
        { error: 'Failed to extract text from PDF. Please ensure the PDF is not password-protected and contains readable text.' },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.trim().length < 100) {
      return NextResponse.json(
        { error: 'Could not extract sufficient text from the PDF. Please ensure the PDF contains readable text.' },
        { status: 400 }
      );
    }

    try {
      const prompt = ANALYSIS_PROMPT + extractedText;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let analysisText = response.text();

      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }

      const analysisResult: AnalysisResult = JSON.parse(jsonMatch[0]);

      if (!analysisResult.overallScore || !analysisResult.sections || !Array.isArray(analysisResult.sections)) {
        throw new Error('Invalid analysis result structure');
      }

      analysisResult.overallScore = Math.min(100, Math.max(0, analysisResult.overallScore));
      analysisResult.sections.forEach(section => {
        section.score = Math.min(100, Math.max(0, section.score));
      });

      return NextResponse.json(analysisResult);

    } catch (error) {
      console.error('Gemini API error:', error);
      return NextResponse.json(
        { error: 'Failed to analyze resume. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}