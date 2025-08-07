# Test Data Directory

This directory contains test files for the Markdown Viewer application, organized by file type.

## Directory Structure

```
test-data/
├── csv/          # CSV test files for the CSV viewer
├── html/         # HTML test files for the HTML viewer
├── json/         # JSON test files for the JSON viewer
├── pdf/          # PDF test files for the PDF viewer
├── scripts/      # Test scripts and utilities
└── README.md     # This file
```

## CSV Test Files (`csv/`)

### Basic Test Files

- `test-basic.csv` - Simple CSV with mixed data types (3 rows, 7 columns)
- `test-types.csv` - Various data types for type detection testing
- `test-missing.csv` - CSV with missing values and edge cases
- `test-special.csv` - Special characters and quoted fields

### Delimiter Testing

- `sample-data.tsv` - Tab-separated values
- `test-data.tsv` - Additional TSV test data
- `test-semicolon.csv` - Semicolon-delimited data
- `test-pipe.psv` - Pipe-separated values

### Sample Data

- `sample-data.csv` - Employee data sample (20 rows)
- `complex-sample.csv` - Product catalog with descriptions (20 rows)

### Performance Testing

- `test-large.csv` - Large dataset with 1000 rows for performance testing

## HTML Test Files (`html/`)

- `test.html` - Basic HTML test file
- `sample-page.html` - Complex HTML page with CSS and JavaScript
- `simple-demo.html` - Simple HTML demonstration

## JSON Test Files (`json/`)

- `sample-data.json` - JSON data for JSONPath and jq testing

## PDF Test Files (`pdf/`)

- `test-sample.pdf` - Sample PDF for PDF viewer testing

## Scripts (`scripts/`)

Test scripts and utilities for development and testing.

## Usage

These test files are used to:

1. **Test file type detection** - Ensure the application correctly identifies different file formats
2. **Test parsing capabilities** - Verify CSV parsing, delimiter detection, and data type inference
3. **Test performance** - Use large datasets to test virtual scrolling and performance optimizations
4. **Test edge cases** - Handle malformed data, special characters, and missing values
5. **Test UI components** - Verify that all viewers work correctly with different data types

## Adding New Test Files

When adding new test files:

1. Place them in the appropriate subdirectory based on file type
2. Use descriptive names that indicate the test purpose
3. Update this README if adding new categories or important test cases
4. Keep file sizes reasonable (except for performance testing files)

## File Naming Convention

- `test-{purpose}.{ext}` - For specific test cases
- `sample-{description}.{ext}` - For sample data
- `{description}-sample.{ext}` - For complex sample data

Examples:

- `test-basic.csv` - Basic CSV functionality test
- `sample-data.json` - Sample JSON data
- `complex-sample.csv` - Complex CSV sample data
