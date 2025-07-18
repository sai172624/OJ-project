import express from "express";
import { getAIHint,getAICodeReview, getAICodeExplanation } from "../controller/aiController.js";

const router = express.Router();
router.post("/hint", getAIHint);
router.post("/review", getAICodeReview);
router.post("/code-explain", getAICodeExplanation);
export default router;
