import express from "express";
import { getUserProblemSubmissions, getSubmissionsByUser } from "../controller/submissionController.js";

const router = express.Router();
router.get("/user/:userId", getSubmissionsByUser);
router.get("/:problemId/:userId", getUserProblemSubmissions);


export default router;
