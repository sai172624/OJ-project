import express from "express";
import { getProblemById, getAllProblems } from "../controller/ProblemController.js";

const router = express.Router();

router.get("/", getAllProblems);
router.get("/:problemId", getProblemById);


export default router;
