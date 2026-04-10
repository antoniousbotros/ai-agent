(function() {
  const scriptTag = document.currentScript || document.querySelector('script[src*="widget.js"]');
  const apiKey = scriptTag ? scriptTag.getAttribute('data-key') : 'test_key_123';
  const botId = scriptTag ? scriptTag.getAttribute('data-bot') : 'demo_bot';
  const apiBase = scriptTag && scriptTag.src.includes('localhost') ? 'http://localhost:4000' : (scriptTag ? new URL(scriptTag.src).origin + '/_/backend' : window.location.origin + '/_/backend');

  async function initWidget() {
    let config = {
      name: 'AI Support Assistant',
      primary_color: '#3b82f6',
      logo_url: null,
      position: 'bottom-right',
      theme: 'light'
    };

    // Fetch live config from backend
    try {
      const res = await fetch(`${apiBase}/api/v1/bots/${botId}/public`);
      if (res.ok) {
        const data = await res.json();
        config = { ...config, ...data };
      }
    } catch (e) {
      console.warn("Widget: Failed to fetch live config, using defaults.");
    }

    const { primary_color, position, name, logo_url, theme } = config;
    const isDark = theme === 'dark';
    const isLeft = position === 'bottom-left';

    // 1. Inject Dynamic Styles
    const style = document.createElement('style');
    style.innerHTML = `
      .ai-widget-btn { 
        position: fixed; bottom: 20px; 
        ${isLeft ? 'left: 20px;' : 'right: 20px;'} 
        width: 60px; height: 60px; border-radius: 50%; 
        background: ${primary_color}; color: white; cursor: pointer; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.15); border: none; z-index: 99999; 
        display: flex; justify-content: center; align-items: center; 
        font-size: 24px; transition: transform 0.2s;
      }
      .ai-widget-btn:hover { transform: scale(1.05); }
      .ai-widget-chat { 
        display: none; position: fixed; bottom: 90px; 
        ${isLeft ? 'left: 20px;' : 'right: 20px;'} 
        width: 360px; height: 550px; 
        background: ${isDark ? '#1e293b' : 'white'}; 
        border-radius: 20px; box-shadow: 0 12px 40px rgba(0,0,0,0.15); 
        border: 1px solid ${isDark ? '#334155' : '#f1f5f9'}; 
        z-index: 99999; flex-direction: column; overflow: hidden; 
        font-family: system-ui, -apple-system, sans-serif;
      }
      .ai-widget-header { 
        background: ${primary_color}; color: white; padding: 18px 24px; 
        font-weight: 600; display: flex; justify-content: space-between; 
        align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); z-index: 10 
      }
      .ai-header-info { display: flex; items-center; gap: 10px; }
      .ai-header-logo { width: 24px; height: 24px; border-radius: 50%; background: white; object-fit: cover; }
      .ai-widget-close { cursor: pointer; opacity: 0.8; font-size: 20px; line-height: 1; }
      .ai-widget-close:hover { opacity: 1; }
      
      .ai-widget-body { 
        flex: 1; padding: 20px; overflow-y: auto; display: flex; 
        flex-direction: column; gap: 12px; 
        background: ${isDark ? '#0f172a' : '#fafafa'}; 
      }
      .ai-widget-input-area { 
        display: flex; padding: 16px; 
        border-top: 1px solid ${isDark ? '#334155' : '#f1f5f9'}; 
        background: ${isDark ? '#1e293b' : 'white'}; gap: 8px;
      }
      .ai-widget-input { 
        flex: 1; padding: 12px 16px; 
        background: ${isDark ? '#334155' : 'white'}; 
        color: ${isDark ? 'white' : '#1e293b'}; 
        border: 1px solid ${isDark ? '#475569' : '#e2e8f0'}; 
        border-radius: 20px; outline: none; transition: border 0.2s; font-size: 14px;
      }
      .ai-widget-input:focus { border-color: ${primary_color}; }
      .ai-widget-send { 
        background: ${primary_color}; color: white; border: none; 
        padding: 0 20px; border-radius: 20px; cursor: pointer; 
        font-weight: 600; font-size: 14px; transition: opacity 0.2s; 
      }
      .ai-widget-send:hover { opacity: 0.9; }

      .msg-user { 
        align-self: flex-end; 
        background: ${isDark ? '#334155' : '#e2e8f0'}; 
        color: ${isDark ? 'white' : '#1e293b'}; 
        padding: 12px 16px; border-radius: 16px 16px 2px 16px; 
        font-size: 14px; max-width: 85%; shadow-sm;
      }
      .msg-bot { 
        align-self: flex-start; background: ${primary_color}; color: white; 
        padding: 12px 16px; border-radius: 16px 16px 16px 2px; 
        font-size: 14px; max-width: 85%; line-height: 1.5; shadow-sm;
      }
      .msg-loading { 
        display: flex; gap: 4px; padding: 14px 16px; 
        align-self: flex-start; background: ${primary_color}; 
        border-radius: 16px 16px 16px 2px; opacity: 0.7;
      }
      .dot { width: 6px; height: 6px; background: white; border-radius: 50%; opacity: 0.6; animation: ai-pulse 1.4s infinite; }
      .dot:nth-child(2) { animation-delay: 0.2s; }
      .dot:nth-child(3) { animation-delay: 0.4s; }
      @keyframes ai-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
    `;
    document.head.appendChild(style);

    // 2. Build DOM Elements
    const btn = document.createElement('button');
    btn.className = 'ai-widget-btn';
    btn.innerHTML = logo_url ? `<img src="${logo_url}" class="ai-header-logo" style="width: 32px; height: 32px;" />` : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>`;

    const chatContainer = document.createElement('div');
    chatContainer.className = 'ai-widget-chat';
    
    chatContainer.innerHTML = `
      <div class="ai-widget-header">
        <div class="ai-header-info">
          ${logo_url ? `<img src="${logo_url}" class="ai-header-logo" />` : ''}
          <span>${name}</span>
        </div>
        <span class="ai-widget-close" id="ai-widget-close">×</span>
      </div>
      <div class="ai-widget-body" id="ai-chat-body">
         <div class="msg-bot">Hello! I'm ${name}. How can I help you today?</div>
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
      if (chatContainer.style.display === 'flex') {
        document.getElementById('ai-chat-input').focus();
      }
    };
    
    btn.onclick = toggleChat;
    document.getElementById('ai-widget-close').onclick = toggleChat;

    const sendMessage = async () => {
      const input = document.getElementById('ai-chat-input');
      const body = document.getElementById('ai-chat-body');
      const userMsg = input.value.trim();
      if(!userMsg) return;

      body.innerHTML += `<div class="msg-user">${userMsg.replace(/</g, "&lt;")}</div>`;
      input.value = '';
      body.scrollTop = body.scrollHeight;

      const loadingId = 'loading-' + Date.now();
      body.innerHTML += `<div class="msg-loading" id="${loadingId}"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
      body.scrollTop = body.scrollHeight;

      try {
        const res = await fetch(`${apiBase}/api/v1/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey, botId, message: userMsg })
        });
        const data = await res.json();
        
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();
        
        if(data.error) {
           body.innerHTML += `<div class="msg-bot" style="background:#ef4444">${data.error}</div>`;
        } else {
           let formattedResponse = data.response
             .replace(/</g, "&lt;")
             .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
             .replace(/\*(.*?)\*/g, '<em>$1</em>')
             .replace(/\n/g, '<br/>');
             
           body.innerHTML += `<div class="msg-bot">${formattedResponse}</div>`;
        }
      } catch (e) {
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();
        body.innerHTML += `<div class="msg-bot" style="background:#ef4444">Error connecting to server.</div>`;
      }
      body.scrollTop = body.scrollHeight;
    };

    document.getElementById('ai-chat-send').onclick = sendMessage;
    document.getElementById('ai-chat-input').onkeypress = (e) => { if(e.key === 'Enter') sendMessage(); };
  }

  // Run initialisation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
