if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  // Capture synchronous/compilation/runtime script errors
  window.addEventListener('error', function(event) {
    console.error('Captured global error:', event.error || event.message);
    
    const errorDiv = document.createElement('div');
    errorDiv.id = 'global-error-display';
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.width = '100%';
    errorDiv.style.height = '100%';
    errorDiv.style.backgroundColor = '#fff0f0';
    errorDiv.style.color = '#cc0000';
    errorDiv.style.padding = '20px';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.overflow = 'auto';
    errorDiv.style.boxSizing = 'border-box';
    
    errorDiv.innerHTML = `
      <h2 style="margin: 0 0 10px 0;">Global Script Error</h2>
      <p style="font-weight: bold; margin: 0 0 10px 0;">Message: ${event.message}</p>
      <p style="margin: 0 0 5px 0;"><strong>Source:</strong> ${event.filename}</p>
      <p style="margin: 0 0 15px 0;"><strong>Line:</strong> ${event.lineno}, <strong>Column:</strong> ${event.colno}</p>
      <pre style="white-space: pre-wrap; background-color: #ffe0e0; padding: 10px; border-radius: 4px;">${event.error ? event.error.stack : 'No stack trace available'}</pre>
    `;
    
    document.body.appendChild(errorDiv);
  });
  
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    console.error('Captured unhandled promise rejection:', event.reason);
    
    const errorDiv = document.createElement('div');
    errorDiv.id = 'global-rejection-display';
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.width = '100%';
    errorDiv.style.height = '100%';
    errorDiv.style.backgroundColor = '#fffae0';
    errorDiv.style.color = '#a05000';
    errorDiv.style.padding = '20px';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.style.zIndex = '999999';
    errorDiv.style.overflow = 'auto';
    errorDiv.style.boxSizing = 'border-box';
    
    const stack = (event.reason && event.reason.stack) || 'No stack trace available';
    const reasonStr = event.reason ? (event.reason.message || String(event.reason)) : 'Unknown rejection reason';
    
    errorDiv.innerHTML = `
      <h2 style="margin: 0 0 10px 0;">Unhandled Promise Rejection</h2>
      <p style="font-weight: bold; margin: 0 0 15px 0;">Reason: ${reasonStr}</p>
      <pre style="white-space: pre-wrap; background-color: #ffe0e0; padding: 10px; border-radius: 4px;">${stack}</pre>
    `;
    
    document.body.appendChild(errorDiv);
  });
}
