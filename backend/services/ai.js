export async function generateGemmaResponse(model, systemPrompt, userMessage) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  // PRODUCTION: Use Groq (Cloud API)
  if (GROQ_API_KEY) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gemma2-9b-it', // High-performance production alternative to gemma:2b
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Groq API error');
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Groq Cloud AI Error:", error.message);
      return "Service temporarily unavailable. Our engineers are on it!";
    }
  }

  // DEVELOPMENT: Use Local Ollama
  const url = 'http://localhost:11434/api/generate';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || 'gemma:2b',
        system: systemPrompt,
        prompt: userMessage,
        stream: false,
        options: { num_ctx: 2048, temperature: 0.7 }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Ollama Error: ${response.statusText}. Make sure local instance is running.`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Local AI Generation Error:", error.message);
    return "Error: Could not connect to local AI layer. For production, please configure GROQ_API_KEY.";
  }
}
