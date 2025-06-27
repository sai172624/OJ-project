import express from "express";
import { getProblemById } from "../controller/ProblemController.js";

const router = express.Router();

router.get("/:problemId", getProblemById);


export default router;
