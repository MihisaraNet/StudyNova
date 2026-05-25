const fs = require('fs');
const path = require('path');

async function capture() {
  try {
    const res = await fetch('http://localhost:9222/json');
    const targets = await res.json();
    const pageTarget = targets.find(t => t.type === 'page');
    
    if (!pageTarget) {
      console.error('No page target found!');
      process.exit(1);
    }
    
    const wsUrl = pageTarget.webSocketDebuggerUrl;
    console.log('Connecting to page target:', pageTarget.title, 'at', wsUrl);
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('Connected. Taking screenshot...');
      ws.send(JSON.stringify({
        id: 1,
        method: 'Page.captureScreenshot',
        params: { format: 'png' }
      }));
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 1 && data.result && data.result.data) {
        const buffer = Buffer.from(data.result.data, 'base64');
        const outputPath = path.join(__dirname, 'login_screen.png');
        fs.writeFileSync(outputPath, buffer);
        console.log('Screenshot successfully saved to:', outputPath);
        ws.close();
        process.exit(0);
      }
    };
    
    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      process.exit(1);
    };
    
  } catch (error) {
    console.error('Error in capture:', error);
    process.exit(1);
  }
}

capture();
