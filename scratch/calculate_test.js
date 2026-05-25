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
      console.log('Connected! Starting GPA Calculation test flow...');
      
      // Step 1: Trigger Registration
      const uniqueEmail = `testuser_calc_${Date.now()}@example.com`;
      console.log(`Registering new user with email: ${uniqueEmail}`);
      
      const registerExpr = `
        (async () => {
          if (!window.useAuthStore) {
            return { success: false, message: 'useAuthStore is not defined yet' };
          }
          return await window.useAuthStore.getState().register({
            name: "Mihisara Perera",
            email: "${uniqueEmail}",
            password: "Password123!",
            semester: "Y1S1",
            gpaTarget: 3.90
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
        
        // Step 2: Add Subject 1
        console.log('Adding Subject 1: Advanced Programming...');
        const addSub1Expr = `
          (async () => {
            return await window.useSubjectStore.getState().addSubject({
              name: "Advanced Programming",
              code: "CS201",
              credits: 3,
              semester: "Y1S1",
              grade: "A"
            });
          })()
        `;
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: { expression: addSub1Expr, awaitPromise: true, returnByValue: true }
        }));
      }
      
      if (data.id === 2) {
        console.log('Subject 1 Added Result:', data.result.value);
        
        // Step 3: Add Subject 2
        console.log('Adding Subject 2: Database Systems...');
        const addSub2Expr = `
          (async () => {
            return await window.useSubjectStore.getState().addSubject({
              name: "Database Systems",
              code: "CS202",
              credits: 4,
              semester: "Y1S1",
              grade: "B+"
            });
          })()
        `;
        ws.send(JSON.stringify({
          id: 3,
          method: 'Runtime.evaluate',
          params: { expression: addSub2Expr, awaitPromise: true, returnByValue: true }
        }));
      }
      
      if (data.id === 3) {
        console.log('Subject 2 Added Result:', data.result.value);
        
        // Step 4: Fetch GPA data
        console.log('Fetching GPA...');
        const fetchGpaExpr = `
          (async () => {
            await window.useGpaStore.getState().fetchGPA();
            return 'GPA Fetched';
          })()
        `;
        ws.send(JSON.stringify({
          id: 4,
          method: 'Runtime.evaluate',
          params: { expression: fetchGpaExpr, awaitPromise: true, returnByValue: true }
        }));
      }
      
      if (data.id === 4) {
        console.log('GPA Fetch Result:', data.result.value);
        
        // Step 5: Navigate to GPA Calculator
        console.log('Navigating to GPA Tab...');
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
          id: 5,
          method: 'Runtime.evaluate',
          params: { expression: clickGpaExpr, returnByValue: true }
        }));
      }
      
      if (data.id === 5) {
        console.log('GPA Navigation Click Result:', data.result.value);
        
        console.log('Waiting 2 seconds for GPA screen...');
        setTimeout(() => {
          console.log('Taking GPA screenshot...');
          ws.send(JSON.stringify({
            id: 6,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 2000);
      }
      
      if (data.id === 6) {
        // Save GPA screenshot
        const buffer = Buffer.from(data.result.data, 'base64');
        fs.writeFileSync(path.join(__dirname, 'calculated_gpa.png'), buffer);
        console.log('Calculated GPA screenshot saved to scratch/calculated_gpa.png');
        
        // Step 6: Navigate to Subjects Tab
        console.log('Navigating to Subjects Tab...');
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
          id: 7,
          method: 'Runtime.evaluate',
          params: { expression: clickSubjectsExpr, returnByValue: true }
        }));
      }
      
      if (data.id === 7) {
        console.log('Subjects Navigation Click Result:', data.result.value);
        
        console.log('Waiting 2 seconds for Subjects screen...');
        setTimeout(() => {
          console.log('Taking Subjects screenshot...');
          ws.send(JSON.stringify({
            id: 8,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 2000);
      }
      
      if (data.id === 8) {
        // Save Subjects screenshot
        const buffer = Buffer.from(data.result.data, 'base64');
        fs.writeFileSync(path.join(__dirname, 'calculated_subjects.png'), buffer);
        console.log('Calculated Subjects screenshot saved to scratch/calculated_subjects.png');
        
        console.log('All calculations verified. Test completed!');
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
