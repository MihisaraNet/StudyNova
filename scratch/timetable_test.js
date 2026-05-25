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
      console.log('Connected! Starting Timetable & Notification test flow...');
      
      // Step 1: Trigger Registration
      const uniqueEmail = `testuser_time_${Date.now()}@example.com`;
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
        console.log('Registration complete.');
        
        // Step 2: Add Subject
        console.log('Adding Subject: Software Engineering...');
        const addSubExpr = `
          (async () => {
            return await window.useSubjectStore.getState().addSubject({
              name: "Software Engineering",
              code: "SE301",
              credits: 4,
              semester: "Y1S1",
              grade: "A-"
            });
          })()
        `;
        ws.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: { expression: addSubExpr, awaitPromise: true, returnByValue: true }
        }));
      }
      
      if (data.id === 2) {
        console.log('Subject added.');
        
        // Step 3: Add Study Session
        console.log('Adding scheduled Study Session under Subject...');
        const addSessionExpr = `
          (async () => {
            const subjects = window.useSubjectStore.getState().subjects;
            const sub = subjects.find(s => s.code === 'SE301') || {};
            
            return await window.useTimetableStore.getState().addSession({
              subjectId: sub.id || null,
              subjectName: sub.name || "Software Engineering",
              title: "Scrum Standup & Frontend Dev",
              dayOfWeek: "Monday",
              startTime: "10:00",
              endTime: "11:30",
              location: "Lab 3 (Ground Floor)",
              color: "#10b981", // Emerald tag
              reminderEnabled: true,
              reminderMinutesBefore: 15
            });
          })()
        `;
        ws.send(JSON.stringify({
          id: 3,
          method: 'Runtime.evaluate',
          params: { expression: addSessionExpr, awaitPromise: true, returnByValue: true }
        }));
      }
      
      if (data.id === 3) {
        console.log('Study Session added.');
        
        // Step 4: Navigate to Timetable tab
        console.log('Navigating to Timetable tab...');
        const clickTimetableExpr = `
          (() => {
            const links = [...document.querySelectorAll('a[role="link"]')];
            const timeLink = links.find(el => el.textContent.includes('Timetable'));
            if (timeLink) {
              timeLink.click();
              return 'Timetable Tab Clicked';
            }
            return 'Timetable Tab Not Found';
          })()
        `;
        ws.send(JSON.stringify({
          id: 4,
          method: 'Runtime.evaluate',
          params: { expression: clickTimetableExpr, returnByValue: true }
        }));
      }
      
      if (data.id === 4) {
        console.log('Navigation Result:', data.result.result.value);
        
        console.log('Waiting 3 seconds for Timetable screen to render...');
        setTimeout(() => {
          console.log('Taking Timetable Monday screenshot...');
          ws.send(JSON.stringify({
            id: 5,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 3000);
      }
      
      if (data.id === 5) {
        // Save Timetable screenshot
        const buffer = Buffer.from(data.result.data, 'base64');
        fs.writeFileSync(path.join(__dirname, 'timetable_monday.png'), buffer);
        console.log('Timetable Monday screenshot saved to scratch/timetable_monday.png');
        
        // Step 5: Click FAB to navigate to AddSession form editor
        console.log('Clicking FAB (+) to open Add Session form...');
        const clickFabExpr = `
          (() => {
            const x = window.innerWidth - 52;
            const y = window.innerHeight - 105;
            const el = document.elementFromPoint(x, y);
            if (el) {
              const button = el.closest('div[role="button"]') || el;
              button.click();
              return 'FAB Clicked via Coordinates';
            }
            return 'FAB Not Found at Coordinates';
          })()
        `;
        ws.send(JSON.stringify({
          id: 6,
          method: 'Runtime.evaluate',
          params: { expression: clickFabExpr, returnByValue: true }
        }));
      }
      
      if (data.id === 6) {
        console.log('FAB Click Result:', data.result.result.value);
        
        console.log('Waiting 2 seconds for AddSessionScreen form editor...');
        setTimeout(() => {
          console.log('Taking Add Session Form screenshot...');
          ws.send(JSON.stringify({
            id: 7,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 2000);
      }
      
      if (data.id === 7) {
        // Save Add Session Form screenshot
        const buffer = Buffer.from(data.result.data, 'base64');
        fs.writeFileSync(path.join(__dirname, 'add_session_form.png'), buffer);
        console.log('Add Session Form screenshot saved to scratch/add_session_form.png');
        
        console.log('Timetable scheduling and verification completed successfully!');
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
