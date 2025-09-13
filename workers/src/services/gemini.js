
export const shortenTextWithGemini = async (text, charLimit, apiKey) => {
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  const prompt = `Shorten the following text to be under ${charLimit} characters, while retaining the original meaning and tone. Do not add any extra commentary. Just provide the shortened text. Original text: "${text}"`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }],
        }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API Error:', errorBody);
      throw new Error(`Gemini API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const shortenedText = data.candidates[0].content.parts[0].text.trim();
    
    // Fallback if Gemini fails or gives a long response
    if (shortenedText.length > charLimit) {
        return text.substring(0, charLimit - 3) + '...';
    }
    
    return shortenedText;

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fallback to simple truncation on error
    return text.substring(0, charLimit - 3) + '...';
  }
};
