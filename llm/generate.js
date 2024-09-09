const axios = require("axios");
const config = require("../docai.config");

async function generateDocumentation(changes) {
  const apiKey = config.openaiApiKey;
  if (!apiKey) {
    throw new Error("API key is missing. Please set it in the .env file.");
  }

  try {
    console.log("Sending request to OpenAI API..."); // Debugging statement
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions", // GPT-4o mini endpoint
      {
        model: "gpt-4o-mini", // Use GPT-4o mini
        messages: [
          {
            role: "system",
            content:
              "You are a technical writer that generates clear, concise, and organized documentation for a developer's project.",
          },
          {
            role: "user",
            content: `Analyze the following code and generate a professional README that explains the project, its purpose, installation instructions, usage, and any other relevant details. The README should be written for developers who want to use, contribute to, or clone the project. Focus on explaining what the tool, project, app, website, etc. does, how it works, how to install it, and how it helps developers save time. Avoid phrases like "Here are some changes" or "Changes detected" and avoid any unnecessary details:\n${changes}`,
          },
        ],
        max_tokens: 1500, // Adjust based on your needs
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    console.log("Received response from OpenAI API."); // Debugging statement
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(
      "Error from OpenAI API:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

module.exports = { generateDocumentation };
