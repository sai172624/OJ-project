import express from 'express';
import { runCode } from '../controllers/runController.js';
import { submitCode } from '../controllers/submitController.js';
import { verifyCode } from '../controllers/verifyController.js';

const router = express.Router();

router.post('/run', runCode);
router.post('/submit', submitCode);
router.post('/verify', verifyCode);

export default router;
