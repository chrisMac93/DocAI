const axios = require("axios");
const config = require("../docai.config");

// Function to generate documentation using OpenAI API
async function generateDocumentation(changes) {
  const apiKey = config.openaiApiKey;
  if (!apiKey) {
    throw new Error("API key is missing. Please set it in the .env file.");
  }

  try {
    // Send request to OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions", // OpenAI API endpoint
      {
        model: "gpt-4o-mini", // Model to use
        messages: [
          {
            role: "system",
            content:
              "You are a technical writer that generates clear, concise, and organized documentation for a developer's project.",
          },
          {
            role: "user",
            content: `Analyze the following code and generate a professional README that explains the project, its purpose, installation instructions, usage, and any other relevant details. Emphasize the importance of clear function/class definitions and comments to ensure the tool works optimally. Avoid phrases like "Here are some changes" or "Changes detected" and focus on explaining the tool in a clean, organized manner:\n${changes}`,
          },
        ],
        max_tokens: 1500, // Maximum tokens for the response
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`, // Authorization header with API key
        },
      }
    );
    // Return the generated documentation content
    return response.data.choices[0].message.content;
  } catch (error) {
    // Log and rethrow error
    console.error(
      "Error from OpenAI API:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

module.exports = { generateDocumentation };
