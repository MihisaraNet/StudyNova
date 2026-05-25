const wsUrl = 'ws://localhost:9222/devtools/page/588030B9A1B9C3E1029876F0E1C56C57';

console.log('Connecting to Chrome DevTools Protocol at:', wsUrl);
const ws = new WebSocket(wsUrl);

ws.onopen = () => {
  console.log('Connected! Enabling Console and Runtime domains...');
  
  // Enable Console logging
  ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
  
  // Enable Runtime domain to receive exceptions
  ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
  
  // Enable Page domain to reload
  ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
  
  setTimeout(() => {
    console.log('Reloading the page to capture initial load logs...');
    ws.send(JSON.stringify({ id: 4, method: 'Page.reload', params: { ignoreCache: true } }));
  }, 1000);
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.method === 'Console.messageAdded') {
    const msg = data.params.message;
    console.log(`[BROWSER CONSOLE] [${msg.level.toUpperCase()}] ${msg.text} (URL: ${msg.url || 'none'})`);
  }
  
  if (data.method === 'Runtime.exceptionThrown') {
    const details = data.params.exceptionDetails;
    console.error('==================================================');
    console.error('BROWSER RUNTIME EXCEPTION DETECTED:');
    console.error(`Description: ${details.exception ? details.exception.description : details.text}`);
    console.error(`URL: ${details.url}`);
    console.error(`Line: ${details.lineNumber}, Col: ${details.columnNumber}`);
    console.error('==================================================');
  }
  
  // Log other interesting messages if needed
  if (data.error) {
    console.error('CDP Protocol Error:', data.error);
  }
};

ws.onerror = (err) => {
  console.error('WebSocket error:', err);
};

ws.onclose = () => {
  console.log('WebSocket closed.');
};

// Quit after 8 seconds
setTimeout(() => {
  console.log('Finished capturing. Closing connection...');
  ws.close();
  process.exit(0);
}, 8000);
