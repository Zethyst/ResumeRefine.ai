# PDF Resume Analyzer

A modern web application that analyzes PDF resumes using Google's Gemini AI and provides comprehensive feedback on resume quality, structure, and content relevance.

## 🚀 Features

- **PDF Upload Interface**: Simple drag-and-drop or click-to-upload PDF resumes
- **AI-Powered Analysis**: Uses Google Gemini AI for intelligent resume evaluation
- **Comprehensive Feedback**: Detailed analysis across multiple dimensions:
  - Content Quality & Relevance (25%)
  - Structure & Formatting (25%)
  - Professional Skills & Experience (25%)
  - Grammar & Language Quality (25%)
- **Visual Results**: Color-coded scoring system with detailed suggestions
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini AI API
- **PDF Processing**: pdf2json library
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Zethyst/ResumeRefine.ai.git
   cd resumeRefine.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Get your Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/)
   - Sign in with your Google account
   - Create a new API key
   - Copy and paste it into your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How It Works

1. **File Upload**: Users upload a PDF resume (max 10MB)
2. **Text Extraction**: The app extracts text content from the PDF using pdf-parse
3. **AI Analysis**: Extracted text is sent to Google Gemini AI with a comprehensive prompt
4. **Feedback Generation**: AI analyzes the resume across 4 key dimensions
5. **Results Display**: Users see detailed feedback with scores, suggestions, and recommendations

### Analysis Dimensions

1. **Content Quality & Relevance (25%)**
   - Relevance of experience to career goals
   - Achievement quantification
   - Industry-specific keywords
   - Value proposition clarity

2. **Structure & Formatting (25%)**
   - Logical flow and organization
   - Consistent formatting
   - Appropriate length
   - Visual appeal and readability

3. **Professional Skills & Experience (25%)**
   - Skills alignment with job market
   - Career progression demonstration
   - Technical and soft skills balance
   - Experience depth and breadth

4. **Grammar & Language Quality (25%)**
   - Grammar and spelling accuracy
   - Professional tone
   - Clear and concise communication
   - Action verb usage

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with gradient backgrounds
- **Responsive Design**: Optimized for all screen sizes
- **Loading States**: Smooth animations and loading indicators
- **Color-Coded Scoring**: Visual feedback with green/yellow/red scoring system
- **Interactive Elements**: Hover effects and smooth transitions