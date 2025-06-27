import axios from "axios";
const API_URI = import.meta.env.VITE_API_BASE_URL;


export const addProblemWithTestcases = async (problemPayload) => {
    try {
        const response = await axios.post(`${API_URI}/admin/addproblems`, problemPayload);
        return response.data;
    } catch (err) {
        console.log('Error while adding problem:', err);
        throw err;  
    }
};


export const fetchProblems = async (page) => {
  try {
    console.log("Fetching problems for page:", page);
    const response = await axios.get(`${API_URI}/admin/problems?page=${page}`);
    return response.data.problems;
  } catch (err) {
    console.error("Error fetching problems:", err);
    throw err;
  }
};

// Delete a problem by id
export const deleteProblem = async (id) => {
  try {
    await axios.delete(`${API_URI}/admin/delete/${id}`);
    return true;
  } catch (err) {
    console.error("Error deleting problem:", err);
    throw err;
  }
};

export const getUpdateFormData = async (id) => {
  try {
    const response = await axios.get(`${API_URI}/admin/editProblem/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching update form data:", err);
    throw err;
  }
};

export const updateProblem = async (problemId, updatedData) => {
  const res = await axios.put(`${API_URI}/admin/update/${problemId}`, updatedData);
  return res.data;
};