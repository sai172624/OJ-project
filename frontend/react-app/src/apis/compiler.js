import axios from "axios";

const BASE_URL = import.meta.env.VITE_COMPILER_API; //compiler

export const runCode = async ({ code, language, input }) => {
  try {
   console.log("sending run request");
    const response = await axios.post(`${BASE_URL}/api/run`, {
      code,
      language,
      input
    });
    return response.data; // { success: true, output: "..." }
  } catch (err) {
    console.error("Run Error:", err.response?.data || err.message);
    return {
      success: false,
      error: err.response?.data?.error || "Execution failed",
    };
  }
};




export const submitCode = async ({ code, language, problemId }) => {
  try {
    console.log("sending the submit request");
    const res = await axios.post(`${BASE_URL}/api/submit`, {
      code,
      language,
      problemId
    });

    return res.data; // { html: "<div>...</div>" }
  } catch (err) {
    console.error("Submit error:", err);
    throw new Error("Submission failed.");
  }
};