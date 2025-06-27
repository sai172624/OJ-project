import express from 'express';
import { updateProblem,editProblemInfo, addProblemWithTestcases ,fetchProblems,deleteProblem} from '../controller/adminController.js';
const router = express.Router();
router.post('/addproblems', addProblemWithTestcases);
router.get('/problems', fetchProblems);
router.delete('/problems/:id', deleteProblem); 
router.get("/editProblem/:id",editProblemInfo);
router.put("/update/:id", updateProblem);
export default router;
