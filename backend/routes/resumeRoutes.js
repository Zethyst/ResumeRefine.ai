import express from 'express';
import multer from 'multer';
import { analyzeResume } from '../controllers/resumeController.js';

const router = express.Router();
const upload = multer();

router.post('/analyze-resume', upload.single('resume'), analyzeResume);

export default router;
