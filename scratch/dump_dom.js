async function dumpDom() {
  try {
    const res = await fetch('http://localhost:9222/json');
    const targets = await res.json();
    const pageTarget = targets.find(t => t.type === 'page');
    
    if (!pageTarget) {
      console.error('No page target found!');
      process.exit(1);
    }
    
    const wsUrl = pageTarget.webSocketDebuggerUrl;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      const expr = `
        (() => {
          try {
            const elements = document.querySelectorAll('*');
            const buttons = [];
            for (let i = 0; i < elements.length; i++) {
              const el = elements[i];
              const role = el.getAttribute('role');
              const text = el.textContent || '';
              
              if (role === 'button' || el.tagName === 'BUTTON' || text.includes('GPA') || text.includes('Subjects')) {
                buttons.push({
                  tag: el.tagName,
                  role: role,
                  text: text.trim().substring(0, 40),
                  html: el.outerHTML.substring(0, 100)
                });
              }
            }
            return buttons;
          } catch (e) {
            return { error: e.message, stack: e.stack };
          }
        })()
      `;
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: { expression: expr, returnByValue: true }
      }));
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Result:', JSON.stringify(data.result || data, null, 2));
      ws.close();
      process.exit(0);
    };
    
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

dumpDom();
