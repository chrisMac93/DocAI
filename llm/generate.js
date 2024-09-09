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
              "You are a helpful assistant that generates documentation.",
          },
          {
            role: "user",
            content: `Analyze the following code changes and generate documentation updates for the README file. Only include significant changes that affect the documentation:\n${changes}`,
          },
        ],
        max_tokens: 1500, // You can adjust this value as needed
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
