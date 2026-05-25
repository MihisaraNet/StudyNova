const fs = require('fs');
const path = require('path');

async function runTest() {
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
    
    ws.onopen = async () => {
      console.log('Connected! Starting test flow...');
      
      // Step 1: Trigger Registration
      const uniqueEmail = `testuser_${Date.now()}@example.com`;
      console.log(`Registering new user with email: ${uniqueEmail}`);
      
      const registerExpr = `
        (async () => {
          if (!window.useAuthStore) {
            return { success: false, message: 'useAuthStore is not defined yet' };
          }
          return await window.useAuthStore.getState().register({
            name: "John Doe",
            email: "${uniqueEmail}",
            password: "Password123!",
            semester: "Y1S1",
            gpaTarget: 3.85
          });
        })()
      `;
      
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: {
          expression: registerExpr,
          awaitPromise: true,
          returnByValue: true
        }
      }));
    };
    
    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      
      if (data.id === 1) {
        console.log('Registration response:', data.result.value);
        
        console.log('Waiting 4 seconds for transition to Dashboard...');
        setTimeout(() => {
          console.log('Taking Dashboard screenshot...');
          ws.send(JSON.stringify({
            id: 2,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 4000);
      }
      
      if (data.id === 2) {
        // Save Dashboard screenshot
        const buffer = Buffer.from(data.result.data, 'base64');
        fs.writeFileSync(path.join(__dirname, 'dashboard.png'), buffer);
        console.log('Dashboard screenshot saved to scratch/dashboard.png');
        
        // Navigate to GPA Calculator
        console.log('Navigating to GPA Calculator tab...');
        const clickGpaExpr = `
          (() => {
            const links = [...document.querySelectorAll('a[role="link"]')];
            const gpaLink = links.find(el => el.textContent.includes('GPA'));
            if (gpaLink) {
              gpaLink.click();
              return 'GPA Tab Clicked';
            }
            return 'GPA Tab Not Found';
          })()
        `;
        ws.send(JSON.stringify({
          id: 3,
          method: 'Runtime.evaluate',
          params: { expression: clickGpaExpr, returnByValue: true }
        }));
      }
      
      if (data.id === 3) {
        console.log('GPA Navigation Click Result:', data.result.value);
        
        console.log('Waiting 2 seconds for GPA screen...');
        setTimeout(() => {
          console.log('Taking GPA screenshot...');
          ws.send(JSON.stringify({
            id: 4,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 2000);
      }
      
      if (data.id === 4) {
        // Save GPA screenshot
        const buffer = Buffer.from(data.result.data, 'base64');
        fs.writeFileSync(path.join(__dirname, 'gpa_calculator.png'), buffer);
        console.log('GPA Calculator screenshot saved to scratch/gpa_calculator.png');
        
        // Navigate to Subjects
        console.log('Navigating to Subjects tab...');
        const clickSubjectsExpr = `
          (() => {
            const links = [...document.querySelectorAll('a[role="link"]')];
            const subLink = links.find(el => el.textContent.includes('Subjects'));
            if (subLink) {
              subLink.click();
              return 'Subjects Tab Clicked';
            }
            return 'Subjects Tab Not Found';
          })()
        `;
        ws.send(JSON.stringify({
          id: 5,
          method: 'Runtime.evaluate',
          params: { expression: clickSubjectsExpr, returnByValue: true }
        }));
      }
      
      if (data.id === 5) {
        console.log('Subjects Navigation Click Result:', data.result.value);
        
        console.log('Waiting 2 seconds for Subjects screen...');
        setTimeout(() => {
          console.log('Taking Subjects screenshot...');
          ws.send(JSON.stringify({
            id: 6,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 2000);
      }
      
      if (data.id === 6) {
        // Save Subjects screenshot
        const buffer = Buffer.from(data.result.data, 'base64');
        fs.writeFileSync(path.join(__dirname, 'subjects.png'), buffer);
        console.log('Subjects screenshot saved to scratch/subjects.png');
        
        // Navigate to Profile
        console.log('Navigating to Profile tab...');
        const clickProfileExpr = `
          (() => {
            const links = [...document.querySelectorAll('a[role="link"]')];
            const profileLink = links.find(el => el.textContent.includes('Profile'));
            if (profileLink) {
              profileLink.click();
              return 'Profile Tab Clicked';
            }
            return 'Profile Tab Not Found';
          })()
        `;
        ws.send(JSON.stringify({
          id: 7,
          method: 'Runtime.evaluate',
          params: { expression: clickProfileExpr, returnByValue: true }
        }));
      }
      
      if (data.id === 7) {
        console.log('Profile Navigation Click Result:', data.result.value);
        
        console.log('Waiting 2 seconds for Profile screen...');
        setTimeout(() => {
          console.log('Taking Profile screenshot...');
          ws.send(JSON.stringify({
            id: 8,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 2000);
      }
      
      if (data.id === 8) {
        // Save Profile screenshot
        const buffer = Buffer.from(data.result.data, 'base64');
        fs.writeFileSync(path.join(__dirname, 'profile.png'), buffer);
        console.log('Profile screenshot saved to scratch/profile.png');
        
        console.log('All screenshots captured successfully. Test completed!');
        ws.close();
        process.exit(0);
      }
    };
    
    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      process.exit(1);
    };
    
  } catch (error) {
    console.error('Error running test:', error);
    process.exit(1);
  }
}

runTest();
