import axios from "axios";
export const getAIHint = async (req, res) => {
  const { title, statement } = req.body;
  console.log("🔍 Received getAIHint request:", { title, statement });

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model:"mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful coding assistant. Given a problem statement, return only a useful hint or idea, not the full solution."
          },
          {
            role: "user",
            content: `Problem Title: ${title}\nProblem Statement: ${statement}\nGive me a hint to solve this.`
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const hint = response.data.choices[0]?.message?.content?.trim();
    console.log("✅ AI Hint Response:", hint);
    res.status(200).json({ hint });
  } catch (error) {
    console.error("❌ AI Hint Error:", error.response?.data || error.message);
    res.status(500).json({ hint: "AI Hint failed. Please try again later." });
  }
};




const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Store in .env
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

export const getAICodeReview = async (req, res) => {

  const { code, language, title, statement } = req.body;

  if (!code || !language || !title || !statement) {
    return res.status(400).json({ error: "Missing required fields" });
  }
console.log("received ai code review request");
  const prompt = `
You're a technical interviewer reviewing a ${language} solution for the problem titled: "${title}".

Problem Statement:
${statement}

Candidate's Code:
${code}

Please give short, interview-style feedback (3-5 bullet points only) on:
- Logic correctness
- Variable naming
- Use of datatypes
- Code structure

Use simple language and avoid long explanations. Focus on what a real interviewer would quickly point out in a review round.
`;



  try {
    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY
        }
      }
    );

    const review = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No feedback received.";
    res.json({ review });
  } catch (error) {
    console.error("Gemini review error:", error.message);
    res.status(500).json({ error: "Failed to fetch AI review." });
  }
};

export const getAICodeExplanation = async (req, res) => {
  const { code, language } = req.body;
  if (!code || !language) {
    return res.status(400).json({ error: "Missing code or language" });
  }
  const prompt = `Explain only the logic of the following ${language} code. Do not explain syntax or keywords. Focus on what the code is trying to do, and how the logic works step by step:\n\n${code}`;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY2
        }
      }
    );
    const explanation = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No explanation received.";
    res.json({ explanation });
  } catch (error) {
    console.error("Gemini code explanation error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch code explanation." });
  }
};
