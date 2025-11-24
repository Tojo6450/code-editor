const db = require('../config/db');
const { GoogleGenAI } = require("@google/genai");

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/generate
const generateCode = async (req, res) => {
  const { prompt, language, userId } = req.body;

  // 1. Validation
  if (!prompt || !language) {
    return res.status(400).json({ error: "Prompt and language are required" });
  }

  const activeUserId = userId || 1;

  try {
    // 2. Construct the Prompt
    const fullPrompt = `
      You are an expert coding assistant. 
      Task: Write valid, efficient ${language} code based on the following request.
      Rules: Return ONLY the code. Do not use markdown formatting (no \`\`\`). Do not add explanations.
      
      Request: ${prompt}
    `;

    // 3. Call Gemini API
    // FIX: Using "gemini-1.5-flash-001" (Specific version) to resolve 404 errors
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite", 
      contents: fullPrompt,
    });

    // 4. Extract Text
    let generatedCode = response.text; 

    if (!generatedCode) {
      throw new Error("No code returned from Gemini API");
    }

    // 5. Clean the Output (Remove any markdown syntax like ```python)
    const cleanCode = generatedCode
      .replace(/^```(\w+)?\s*/, "") 
      .replace(/```$/, "")          
      .trim();

    // 6. Save to Database
    const insertQuery = `
      INSERT INTO generations (user_id, prompt, language, code)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    
    const savedRecord = await db.query(insertQuery, [activeUserId, prompt, language, cleanCode]);

    // 7. Send Response
    res.status(201).json({
      success: true,
      data: savedRecord.rows[0]
    });

  } catch (error) {
    console.error("❌ Generator Error:", error);
    
    // Provide a clear error message to the frontend
    res.status(500).json({ 
      error: error.message || "Failed to generate code",
      details: error.toString()
    });
  }
};

// GET /api/history
const getHistory = async (req, res) => {
  const { page = 1, limit = 10, userId } = req.query;
  const activeUserId = userId || 1;
  const offset = (page - 1) * limit;

  try {
    const historyQuery = `
      SELECT id, prompt, language, code, created_at
      FROM generations
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    const countQuery = `SELECT COUNT(*) FROM generations WHERE user_id = $1`;

    const [historyResult, countResult] = await Promise.all([
      db.query(historyQuery, [activeUserId, limit, offset]),
      db.query(countQuery, [activeUserId])
    ]);

    res.json({
      success: true,
      data: historyResult.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page)
      }
    });
  } catch (error) {
    console.error("History Error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

module.exports = { generateCode, getHistory };