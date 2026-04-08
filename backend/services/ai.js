export async function generateGemmaResponse(model, systemPrompt, userMessage) {
  const url = 'http://localhost:11434/api/generate';
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model, // 'gemma:2b'
        system: systemPrompt,
        prompt: userMessage,
        stream: false, 
        options: {
          num_ctx: 2048, // Optimize memory for MVP
          temperature: 0.7 
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`Ollama Error: ${response.statusText}. Make sure Ollama is running and model ${model} is pulled.`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("AI Generation Error:", error.message);
    return "Error: Could not connect to local AI layer. Make sure Ollama is installed and running.";
  }
}
