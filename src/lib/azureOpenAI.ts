import axios from 'axios';

const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const apiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY;

export const rewriteContent = async (content: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${endpoint}/openai/deployments/diary_gpt4/chat/completions?api-version=2024-02-15-preview`,
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "少しポジティブに書き換えてください。",
          },
          {
            role: "user",
            content: content,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
      }
    );

    const newContent = response.data.choices[0].message.content.trim();
    return newContent;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data && error.response.data.error) {
        const errorMessage = error.response.data.error.message;
        console.error('OpenAI API Error:', errorMessage);
        console.log('Response:', error.response.data);
      } else {
        console.error('An unexpected Axios error occurred:', error.message);
      }
    } else {
      console.error('An unexpected error occurred:', String(error));
    }
    throw error;
  }
};
