(function() {
  const scriptTag = document.currentScript;
  const apiKey = scriptTag.getAttribute('data-key');
  const botId = scriptTag.getAttribute('data-bot');

  // 1. Inject Styles
  const style = document.createElement('style');
  style.innerHTML = `
    .ai-widget-btn { position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; border-radius: 50%; background: #3b82f6; color: white; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.15); border: none; z-index: 99999; display: flex; justify-content: center; align-items: center; font-size: 24px; transition: transform 0.2s;}
    .ai-widget-btn:hover { transform: scale(1.05); }
    .ai-widget-chat { display: none; position: fixed; bottom: 90px; right: 20px; width: 360px; height: 500px; background: white; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.12); border: 1px solid #f1f5f9; z-index: 99999; flex-direction: column; overflow: hidden; font-family: system-ui, -apple-system, sans-serif;}
    .ai-widget-header { background: #3b82f6; color: white; padding: 18px 20px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); z-index: 10 }
    .ai-widget-close { cursor: pointer; opacity: 0.8; font-size: 20px; line-height: 1; }
    .ai-widget-close:hover { opacity: 1; }
    .ai-widget-body { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background: #fafafa; }
    .ai-widget-input-area { display: flex; padding: 15px; border-top: 1px solid #f1f5f9; background: white; gap: 8px;}
    .ai-widget-input { flex: 1; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 20px; outline: none; transition: border 0.2s; font-size: 14px;}
    .ai-widget-input:focus { border-color: #3b82f6; }
    .ai-widget-send { background: #3b82f6; color: white; border: none; padding: 0 20px; border-radius: 20px; cursor: pointer; font-weight: 600; font-size: 14px; transition: background 0.2s; }
    .ai-widget-send:hover { background: #2563eb; }
    .msg-user { align-self: flex-end; background: #e2e8f0; color: #1e293b; padding: 12px 16px; border-radius: 16px 16px 2px 16px; font-size: 14px; max-width: 85%; }
    .msg-bot { align-self: flex-start; background: #3b82f6; color: white; padding: 12px 16px; border-radius: 16px 16px 16px 2px; font-size: 14px; max-width: 85%; line-height: 1.5; }
    .msg-loading { display: flex; gap: 4px; padding: 14px 16px; align-self: flex-start; background: #3b82f6; border-radius: 16px 16px 16px 2px;}
    .dot { width: 6px; height: 6px; background: white; border-radius: 50%; opacity: 0.6; animation: ai-pulse 1.4s infinite; }
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes ai-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
  `;
  document.head.appendChild(style);

  // 2. Build DOM Elements
  const btn = document.createElement('button');
  btn.className = 'ai-widget-btn';
  btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`;

  const chatContainer = document.createElement('div');
  chatContainer.className = 'ai-widget-chat';
  
  chatContainer.innerHTML = `
    <div class="ai-widget-header">
      <span>AI Support Assistant</span>
      <span class="ai-widget-close" id="ai-widget-close">×</span>
    </div>
    <div class="ai-widget-body" id="ai-chat-body">
       <div class="msg-bot">Hello! I'm powered by Gemma. How can I help you today?</div>
    </div>
    <div class="ai-widget-input-area">
      <input type="text" id="ai-chat-input" class="ai-widget-input" placeholder="Type a message..." />
      <button id="ai-chat-send" class="ai-widget-send">Send</button>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(chatContainer);

  // 3. Logic & API Calls
  const toggleChat = () => {
    chatContainer.style.display = chatContainer.style.display === 'flex' ? 'none' : 'flex';
  };
  
  btn.onclick = toggleChat;
  document.getElementById('ai-widget-close').onclick = toggleChat;

  const sendMessage = async () => {
    const input = document.getElementById('ai-chat-input');
    const body = document.getElementById('ai-chat-body');
    const userMsg = input.value.trim();
    if(!userMsg) return;

    // Append User message
    body.innerHTML += \`<div class="msg-user">\${userMsg.replace(/</g, "&lt;")}</div>\`;
    input.value = '';
    body.scrollTop = body.scrollHeight;

    // Loading indicator
    const loadingId = 'loading-' + Date.now();
    body.innerHTML += \`<div class="msg-loading" id="\${loadingId}"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>\`;
    body.scrollTop = body.scrollHeight;

    // Call Fastify Backend API
    try {
      const res = await fetch('http://localhost:4000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey || 'test_key_123', botId: botId || 'demo_bot', message: userMsg })
      });
      const data = await res.json();
      
      document.getElementById(loadingId).remove();
      
      if(data.error) {
         body.innerHTML += \`<div class="msg-bot" style="background:#ef4444">\${data.error}</div>\`;
      } else {
         body.innerHTML += \`<div class="msg-bot">\${data.response.replace(/</g, "&lt;").replace(/\\n/g, '<br/>')}</div>\`;
      }
    } catch (e) {
      document.getElementById(loadingId).remove();
      body.innerHTML += \`<div class="msg-bot" style="background:#ef4444">Error connecting to server. Is Fastify running on port 4000?</div>\`;
    }
    body.scrollTop = body.scrollHeight;
  };

  document.getElementById('ai-chat-send').onclick = sendMessage;
  document.getElementById('ai-chat-input').onkeypress = (e) => { if(e.key === 'Enter') sendMessage(); };
})();
