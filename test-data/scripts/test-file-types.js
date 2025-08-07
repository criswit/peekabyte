#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Test file type detection logic
function testFileTypeDetection() {
  console.log('Testing file type detection...\n');

  const testFiles = [
    'test.md',
    'test.markdown',
    'test.json',
    'test.jsonc',
    'test.png',
    'test.jpg',
    'test.jpeg',
    'test.pdf',
    'test.txt',
  ];

  testFiles.forEach(fileName => {
    const isMarkdown =
      fileName.toLowerCase().endsWith('.md') ||
      fileName.toLowerCase().endsWith('.markdown');
    const isJson =
      fileName.toLowerCase().endsWith('.json') ||
      fileName.toLowerCase().endsWith('.jsonc');
    const isImage =
      fileName.toLowerCase().endsWith('.png') ||
      fileName.toLowerCase().endsWith('.jpg') ||
      fileName.toLowerCase().endsWith('.jpeg');
    const isPdf = fileName.toLowerCase().endsWith('.pdf');

    console.log(`${fileName}:`);
    console.log(`  isMarkdown: ${isMarkdown}`);
    console.log(`  isJson: ${isJson}`);
    console.log(`  isImage: ${isImage}`);
    console.log(`  isPdf: ${isPdf}`);
    console.log('');
  });
}

// Test base64 encoding for binary files
function testBase64Encoding() {
  console.log('Testing base64 encoding...\n');

  const testImagePath = path.join(__dirname, 'assets', 'icon.png');
  const testPdfPath = path.join(__dirname, 'test-sample.pdf');

  try {
    if (fs.existsSync(testImagePath)) {
      const imageBuffer = fs.readFileSync(testImagePath);
      const imageBase64 = imageBuffer.toString('base64');
      console.log(`PNG file size: ${imageBuffer.length} bytes`);
      console.log(`Base64 encoded size: ${imageBase64.length} characters`);
      console.log(`Base64 preview: ${imageBase64.substring(0, 50)}...\n`);
    }

    if (fs.existsSync(testPdfPath)) {
      const pdfBuffer = fs.readFileSync(testPdfPath);
      const pdfBase64 = pdfBuffer.toString('base64');
      console.log(`PDF file size: ${pdfBuffer.length} bytes`);
      console.log(`Base64 encoded size: ${pdfBase64.length} characters`);
      console.log(`Base64 preview: ${pdfBase64.substring(0, 50)}...\n`);
    }
  } catch (error) {
    console.error('Error testing base64 encoding:', error.message);
  }
}

// Run tests
console.log('=== File Type Support Test ===\n');
testFileTypeDetection();
testBase64Encoding();
console.log('Test completed!');
