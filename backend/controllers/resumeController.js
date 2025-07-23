import PDFParser from "pdf2json";
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyDDZEfz7TwdZIFnTuoqKDNJC2CjuOxVjaU");

const generationConfig = {
    stopSequences: ["red"],
    maxOutputTokens: 20000,
    temperature: 0.8,
    topP: 0.07,
    topK: 30,
};

const extractTextFromPDF = (buffer) => {

    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1); 

        pdfParser.on("pdfParser_dataError", errData => {
            reject(new Error(`PDF parsing failed: ${errData.parserError}`));
        });

        pdfParser.on("pdfParser_dataReady", pdfData => {
            try {
                let rawText = '';

                // Handle different PDF structures
                const pages = pdfData?.Pages || pdfData?.FormImage?.Pages;

                if (!pages || !Array.isArray(pages)) {
                    return reject(new Error("PDF contains no readable pages or unsupported format"));
                }

                rawText = pages.map(page => {
                    if (!page.Texts || !Array.isArray(page.Texts)) {
                        return '';
                    }

                    return page.Texts.map(text => {
                        try {
                            return text.R?.[0]?.T ? decodeURIComponent(text.R[0].T) : '';
                        } catch (e) {
                            return text.R?.[0]?.T || '';
                        }
                    }).filter(t => t.trim()).join(" ");
                }).filter(pageText => pageText.trim()).join("\n");

                rawText = rawText.replace(/\s+/g, ' ').trim();

                if (!rawText || rawText.length < 10) {
                    reject(new Error("No readable text extracted from PDF"));
                } else {
                    resolve(rawText);
                }
            } catch (error) {
                reject(new Error(`Error processing PDF: ${error.message}`));
            }
        });

        try {
            pdfParser.parseBuffer(buffer);
        } catch (error) {
            reject(new Error(`Failed to initialize PDF parser: ${error.message}`));
        }
    });
};


const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, generationConfig);

const ANALYSIS_PROMPT = `You are an expert resume reviewer with extensive experience in HR and recruitment. Analyze the following resume text and provide comprehensive feedback.

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

Resume Text:`;

export const analyzeResume = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        if (file.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: 'File must be a PDF' });
        }

        if (file.size > 10 * 1024 * 1024) {
            return res.status(400).json({ error: 'File size must be less than 10MB' });
        }

        let extractedText;
        try {
            const pdfData = await extractTextFromPDF(file.buffer);
            extractedText = pdfData;
        } catch (error) {
            console.error('PDF parse error:', error);
            return res.status(400).json({
                error: 'Failed to extract text from PDF. Please ensure it is not password-protected.'
            });
        }

        if (!extractedText || extractedText.trim().length < 100) {
            return res.status(400).json({
                error: 'Insufficient text extracted from PDF.'
            });
        }

        const prompt = ANALYSIS_PROMPT + extractedText;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const analysisText = response.text();

        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Invalid response format from AI');

        const analysisResult = JSON.parse(jsonMatch[0]);

        // Ensure scores are within range
        analysisResult.overallScore = Math.min(100, Math.max(0, analysisResult.overallScore));
        analysisResult.sections.forEach(section => {
            section.score = Math.min(100, Math.max(0, section.score));
        });

        return res.json(analysisResult);
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
