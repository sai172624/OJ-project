import axios from "axios";
const API_URL = import.meta.env.VITE_API_BASE_URL;
export const getUserProblemSubmissions = async (problemId, userId) => {
  try {
    const res = await axios.get(`${API_URL}/submissions/${problemId}/${userId}`);
    return res.data; // array of submissions
  } catch (err) {
    console.error("Error fetching submissions:", err);
    throw err;
  }
};

export const getAllUserSubmissions = async (userId) => {
  try {
    const res = await axios.get(`${API_URL}/submissions/user/${userId}`);
    return res.data.submissions;
  } catch (err) {
    console.error("Failed to get user submissions:", err);
    throw err;
  }
};