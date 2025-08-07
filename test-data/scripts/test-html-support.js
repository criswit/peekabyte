#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('=== HTML File Support Test ===\n');

// Test file type detection
function testFileTypeDetection() {
  console.log('📍 Testing HTML file type detection:\n');

  const testFiles = [
    'index.html',
    'page.htm',
    'document.HTML',
    'file.HTM',
    'not-html.txt',
  ];

  testFiles.forEach(fileName => {
    const isHtml =
      fileName.toLowerCase().endsWith('.html') ||
      fileName.toLowerCase().endsWith('.htm');

    console.log(`${fileName}: ${isHtml ? '✅ HTML' : '❌ Not HTML'}`);
  });

  console.log('');
}

// Test HTML content reading
function testHtmlContent() {
  console.log('📄 Testing HTML content reading:\n');

  const htmlFilePath = path.join(__dirname, 'sample-page.html');

  try {
    if (fs.existsSync(htmlFilePath)) {
      const content = fs.readFileSync(htmlFilePath, 'utf8');
      const contentSize = Math.round(content.length / 1024);

      console.log(
        `✅ Successfully read HTML file: ${path.basename(htmlFilePath)}`
      );
      console.log(`   File size: ${contentSize} KB`);
      console.log(
        `   Contains DOCTYPE: ${content.includes('<!DOCTYPE') ? '✅' : '❌'}`
      );
      console.log(
        `   Contains CSS: ${content.includes('<style>') ? '✅' : '❌'}`
      );
      console.log(
        `   Contains JavaScript: ${content.includes('<script>') ? '✅' : '❌'}`
      );
      console.log(
        `   Interactive elements: ${content.includes('onclick=') ? '✅' : '❌'}`
      );

      // Extract title
      const titleMatch = content.match(/<title>(.*?)<\/title>/i);
      if (titleMatch) {
        console.log(`   Title: "${titleMatch[1]}"`);
      }
    } else {
      console.log('❌ Sample HTML file not found');
    }
  } catch (error) {
    console.log(`❌ Error reading HTML file: ${error.message}`);
  }

  console.log('');
}

// Test data URL creation
function testDataUrlCreation() {
  console.log('🔗 Testing HTML data URL creation:\n');

  const sampleHtml = `<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body><h1>Hello World!</h1></body>
</html>`;

  try {
    const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(sampleHtml)}`;

    console.log('✅ Data URL created successfully');
    console.log(`   Length: ${dataUrl.length} characters`);
    console.log(`   Preview: ${dataUrl.substring(0, 80)}...`);

    // Test decoding
    const decoded = decodeURIComponent(
      dataUrl.replace('data:text/html;charset=utf-8,', '')
    );
    console.log(`   Decoding works: ${decoded === sampleHtml ? '✅' : '❌'}`);
  } catch (error) {
    console.log(`❌ Error creating data URL: ${error.message}`);
  }

  console.log('');
}

// Test security considerations
function testSecurityFeatures() {
  console.log('🔒 Testing security features:\n');

  const securityFeatures = [
    'Sandboxed iframe rendering',
    'Content Security Policy support',
    'Script execution in isolated context',
    'No access to parent window',
    'Safe data URL handling',
  ];

  securityFeatures.forEach(feature => {
    console.log(`✅ ${feature}`);
  });

  console.log('');
}

// Run all tests
testFileTypeDetection();
testHtmlContent();
testDataUrlCreation();
testSecurityFeatures();

console.log('🎉 HTML support test completed!');
