#!/usr/bin/env node

const jsonpath = require('jsonpath');
const jq = require('jq-in-the-browser').default;
const fs = require('fs');
const path = require('path');

// Load sample data
const sampleDataPath = path.join(__dirname, 'sample-data.json');
const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));

console.log('=== JSONPath and jq Query Test ===\n');

// Test JSONPath queries
console.log('📍 Testing JSONPath queries:\n');

const jsonpathQueries = [
  '$.*',
  '$.store.book[*].title',
  '$.store.book[?(@.price < 10)]',
  '$.users[?(@.active == true)].name',
  '$..price',
];

jsonpathQueries.forEach(query => {
  try {
    const result = jsonpath.query(sampleData, query);
    console.log(`Query: ${query}`);
    console.log(`Result: ${JSON.stringify(result, null, 2)}`);
    console.log('---');
  } catch (error) {
    console.log(`Query: ${query}`);
    console.log(`Error: ${error.message}`);
    console.log('---');
  }
});

// Test jq queries
console.log('\n🔍 Testing jq queries:\n');

const jqQueries = [
  '.',
  '.store.book[] | .title',
  '.store.book[] | select(.price < 10)',
  '.users[] | select(.active == true) | .name',
  '[.store.book[].price, .store.bicycle.price]',
];

jqQueries.forEach(query => {
  try {
    const result = jq(query)(sampleData);
    console.log(`Query: ${query}`);
    console.log(`Result: ${JSON.stringify(result, null, 2)}`);
    console.log('---');
  } catch (error) {
    console.log(`Query: ${query}`);
    console.log(`Error: ${error.message}`);
    console.log('---');
  }
});

console.log('✅ Test completed!');
