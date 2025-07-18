import axios from "axios";
const API_URI = import.meta.env.VITE_API_BASE_URL;


export const getProblemById = async (problemId) => {
  const res = await axios.get(`${API_URI}/problems/${problemId}`);
  return res.data;
};

export const getAllProblems = async () => {
  const res = await axios.get(`${API_URI}/problems`);
  return res.data;
};