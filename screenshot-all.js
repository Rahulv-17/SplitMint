const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function captureAllPages() {
  console.log('Starting automated browser testing...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const outputDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  try {
    // 1. Register via API to get valid token
    console.log('Registering test user via API...');
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alex Rivera',
        email: `alex_${Date.now()}@example.com`,
        password: 'password123'
      })
    });
    const regData = await regRes.json();
    const token = regData.token;

    // 2. Go to Auth Page & set token in localStorage
    console.log('Setting auth token in browser localStorage...');
    await page.goto('http://localhost:5173/auth', { waitUntil: 'networkidle0' });
    await page.evaluate((tok, usr) => {
      localStorage.setItem('token', tok);
      localStorage.setItem('user', JSON.stringify(usr));
    }, token, regData);

    await page.screenshot({ path: path.join(outputDir, '1_auth.png') });

    // 3. Go to Dashboard
    console.log('Navigating to Dashboard...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(outputDir, '2_dashboard.png') });

    // 3. Navigate to Expenses
    console.log('Navigating to Expenses...');
    await page.goto('http://localhost:5173/expenses', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outputDir, '3_expenses.png') });

    // 4. Navigate to Groups
    console.log('Navigating to Groups...');
    await page.goto('http://localhost:5173/groups', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outputDir, '4_groups.png') });

    // 5. Navigate to Budgets
    console.log('Navigating to Budgets...');
    await page.goto('http://localhost:5173/budgets', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outputDir, '5_budgets.png') });

    // 6. Navigate to Analytics
    console.log('Navigating to Analytics...');
    await page.goto('http://localhost:5173/analytics', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outputDir, '6_analytics.png') });

    // 7. Navigate to Recurring
    console.log('Navigating to Recurring...');
    await page.goto('http://localhost:5173/recurring', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outputDir, '7_recurring.png') });

    // 8. Navigate to Activity
    console.log('Navigating to Activity...');
    await page.goto('http://localhost:5173/activity', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outputDir, '8_activity.png') });

    // 9. Navigate to Settings
    console.log('Navigating to Settings...');
    await page.goto('http://localhost:5173/settings', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(outputDir, '9_settings.png') });

    console.log('All screenshots captured successfully in /screenshots folder!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

captureAllPages();
