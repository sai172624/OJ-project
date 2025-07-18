import axios from "axios";
const API_URL = import.meta.env.VITE_API_BASE_URL;
export const getAIHint = async (title, statement) => {
    console.log("getAIHint is executing");
  const res = await axios.post(`${API_URL}/ai/hint`, {
    title,
    statement
  });
  return res.data.hint;
};
export const getAICodeReview = async (code, language, problemTitle, problemStatement) => {
    console.log("ai revirew is executing");
  const res = await axios.post(`${API_URL}/ai/review`, {
    code,
    language,
    title: problemTitle,
    statement: problemStatement,
  });
  return res.data.review;
};

export const getAICodeExplanation = async (code, language) => {
  const res = await axios.post(`${API_URL}/ai/code-explain`, { code, language });
  return res.data.explanation;
};
