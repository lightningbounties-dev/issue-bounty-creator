const functions = require('@google-cloud/functions-framework');
const fetch = require('node-fetch');

// Retrieve the API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

// Register an HTTP function
functions.http('getAiSuggestions', async (req, res) => {
  // Set CORS headers to allow requests from your website
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight CORS requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Ensure it's a POST request
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Extract data from the incoming request
  const { repoUrl, userContext, scanTodos } = req.body;

  if (!repoUrl) {
    return res.status(400).send('Missing repoUrl parameter.');
  }
   if (typeof GEMINI_API_KEY === 'undefined' || !GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY environment variable not set.");
    return res.status(500).send("Server configuration error.");
  }


  // Construct the prompts and payload for the Gemini API
  const systemPrompt = `You are an expert software developer creating a public bounty for an open-source project. Your tone should be professional, clear, and encouraging to attract contributors. Your task is to analyze a public GitHub repository and identify potential areas for improvement that can be turned into actionable tasks.`;
  let userQuery = `Analyze the GitHub repository at this URL: ${repoUrl}. Based on the repository's README, file structure, and overall purpose, generate up to 5 concrete suggestions for improvement.`;

  if (scanTodos) {
      userQuery += `\n\nAdditionally, scan the codebase for comments like "// TODO:" or "// FIXME:" and convert them into formal issues. Prioritize these TODO-based issues in the list.`;
  }
  if (userContext) {
      userQuery += `\n\nPay special attention to the following user goal: "${userContext}". The suggestions should be tailored to help achieve this goal.`;
  }
  userQuery += `\n\nFor each suggestion, provide a clear title and a detailed description. The description must be in Markdown and formatted exactly like this:\n\n### Problem\nA clear and concise explanation of the problem...\n\n### Proposed Solution\nA detailed, step-by-step guide...\n\n### Required Technologies\nA list of technologies...\n\nFinally, provide a 'type' ('improvement', 'vulnerability', 'feature', 'todo') and an array of 2-3 relevant 'tags' (e.g., 'Refactor', 'Frontend', 'Security').`;

  const payload = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userQuery }] }],
      generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
              type: "ARRAY",
              items: {
                  type: "OBJECT",
                  properties: { "title": { "type": "STRING" }, "description": { "type": "STRING" }, "tags": { "type": "ARRAY", "items": { "type": "STRING" } }, "type": { "type": "STRING" } },
                  required: ["title", "description", "tags", "type"]
              }
          }
      }
  };

  try {
    const apiResponse = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.json();
      console.error("Gemini API Error:", errorBody);
      throw new Error(`API request failed with status ${apiResponse.status}`);
    }

    const result = await apiResponse.json();
    const jsonText = result.candidates[0].content.parts[0].text;
    
    // Send the successful response back to the client
    res.status(200).send(jsonText);

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).send('An error occurred while fetching AI suggestions.');
  }
});
