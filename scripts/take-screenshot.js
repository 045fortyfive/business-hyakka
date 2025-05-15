const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function takeScreenshot() {
  console.log('Starting browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    console.log('Opening new page...');
    const page = await browser.newPage();
    
    // Set viewport size
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navigate to the page
    console.log('Navigating to the page...');
    await page.goto('http://localhost:3003/simple-card-samples', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for the carousel to be visible
    console.log('Waiting for carousel to load...');
    await page.waitForSelector('.relative.h-\\[400px\\]', { timeout: 10000 });
    
    // Wait a bit more to ensure all images are loaded
    await page.waitForTimeout(2000);
    
    // Take screenshot
    console.log('Taking screenshot...');
    const screenshotPath = path.join(process.cwd(), 'public', 'screenshots', 'carousel-screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    
    console.log(`Screenshot saved to ${screenshotPath}`);
  } catch (error) {
    console.error('Error taking screenshot:', error);
  } finally {
    await browser.close();
    console.log('Browser closed');
  }
}

takeScreenshot();
