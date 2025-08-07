# Markdown Viewer

A powerful desktop application for browsing and viewing rendered markdown files, images, PDFs, and CSV data with advanced analysis capabilities.

## Project Structure

```
peekabyte/
├── src/                    # Source code
│   ├── main/              # Electron main process
│   ├── preload/           # Electron preload scripts
│   ├── renderer/          # React renderer process
│   └── shared/            # Shared types and utilities
├── test-data/             # Test files organized by type
│   ├── csv/              # CSV test files
│   ├── html/             # HTML test files
│   ├── json/             # JSON test files
│   ├── pdf/              # PDF test files
│   └── scripts/          # Test scripts
├── docs/                  # Documentation
│   └── features/         # Feature documentation
├── dist/                  # Built application
├── assets/               # Application assets
└── README.md             # This file
```

## Features

- File browser navigation pane on the left
- Rendered markdown display on the right
- Toggle between rendered markdown and source view
- **Image viewer with zoom controls for PNG, JPG, and JPEG files**
- **PDF viewer with download functionality**
- **JSON viewer with JSONPath and jq query capabilities**
- **Advanced CSV viewer with SQL querying and data analysis**
- Syntax highlighting for code blocks
- Support for GitHub Flavored Markdown
- Home directory as default root
- Favorites feature to bookmark frequently accessed directories

## Supported File Types

- **Markdown files**: `.md`, `.markdown` - Full rendering with syntax highlighting
- **JSON files**: `.json`, `.jsonc` - Interactive JSON viewer with query capabilities
  - **JSONPath queries**: Query JSON data using JSONPath expressions (e.g., `$.store.book[*].title`)
  - **jq expressions**: Filter and transform JSON data using jq syntax (e.g., `.store.book[] | .title`)
- **HTML files**: `.html`, `.htm` - Browser-like rendering with CSS and JavaScript support
- **Image files**: `.png`, `.jpg`, `.jpeg` - Image viewer with zoom and pan controls
- **PDF files**: `.pdf` - Embedded PDF viewer with download option
- **CSV files**: `.csv`, `.tsv`, `.psv`, `.txt` (with CSV content) - Advanced CSV viewer with comprehensive analysis tools

## CSV Viewer Features

### 🔍 **Smart Data Detection & Parsing**

- **Auto-delimiter detection**: Automatically detects comma, semicolon, tab, pipe, and colon delimiters
- **Data type inference**: Automatically identifies string, number, date, and boolean columns
- **Encoding support**: UTF-8, UTF-16, and ISO-8859-1 encoding detection
- **Error handling**: Graceful handling of malformed CSV data with detailed error reporting

### 📊 **Interactive Data Table**

- **Virtual scrolling**: Handle large datasets (thousands of rows) with smooth performance
- **Column sorting**: Click column headers to sort data (supports all data types)
- **Resizable columns**: Drag column borders to adjust width
- **Type-aware formatting**: Numbers, dates, and booleans are formatted appropriately
- **Row highlighting**: Alternating row colors with hover effects

### 🔎 **Advanced Filtering System**

- **Column-specific filters**: Different filter types based on data type
  - **Text columns**: Search and unique value selection
  - **Number columns**: Range filters (min/max)
  - **Date columns**: Date range selection
  - **Boolean columns**: True/False dropdown
- **Multi-column filtering**: Apply multiple filters simultaneously
- **Unique value chips**: Click on common values to filter quickly
- **Filter statistics**: See filter impact in real-time

### 🗄️ **SQL Query Interface**

- **Full SQL support**: Execute SELECT queries on your CSV data
- **Query editor**: Syntax highlighting and formatting
- **Sample queries**: Pre-built queries based on your data structure
- **Query validation**: Real-time syntax checking and error reporting
- **Execution metrics**: Query performance timing
- **Keyboard shortcuts**: Ctrl+Enter (Cmd+Enter on Mac) to execute queries

#### SQL Query Examples:

```sql
-- Basic data exploration
SELECT * FROM data LIMIT 10;
SELECT COUNT(*) FROM data;

-- Filtering and sorting
SELECT * FROM data WHERE age > 30 ORDER BY salary DESC;

-- Aggregations
SELECT department, AVG(salary) as avg_salary, COUNT(*) as count
FROM data GROUP BY department;

-- Complex queries
SELECT category,
       COUNT(*) as total_products,
       AVG(price) as avg_price,
       MAX(quantity_sold) as best_seller
FROM data
WHERE discontinued = false
GROUP BY category
HAVING COUNT(*) > 5
ORDER BY avg_price DESC;
```

### 💾 **Query Management**

- **Save queries**: Save frequently used queries with names and descriptions
- **Query history**: Access recently executed queries
- **Favorites**: Star important queries for quick access
- **Query sharing**: Export and import query collections

### 📈 **Data Profiling & Statistics**

- **Column statistics**: Count, unique values, null values, min/max, average, median
- **Data quality indicators**: Visual indicators for data completeness
- **Top values analysis**: Most common values with frequency counts
- **Data type distribution**: Overview of column types in your dataset
- **Missing data visualization**: Identify and quantify missing values

### 📤 **Export & Sharing**

- **Multiple formats**: Export to CSV, JSON, Excel, or plain text
- **Filtered exports**: Export only the data that matches your current filters
- **Query result exports**: Export the results of SQL queries
- **Custom delimiters**: Choose output delimiter (comma, semicolon, tab, pipe)
- **Encoding options**: Select output encoding
- **Copy to clipboard**: Quick copy for pasting into other applications

### ⚡ **Performance Optimizations**

- **Streaming parser**: Handle large files without memory issues
- **Lazy loading**: Load data on-demand for better responsiveness
- **Virtual scrolling**: Smooth scrolling through thousands of rows
- **Web Workers**: Background processing to keep UI responsive
- **Efficient filtering**: Fast filter operations on large datasets

### 🎨 **User Experience**

- **Three view modes**:
  - **Table View**: Interactive data table with filtering
  - **Query View**: SQL interface with result display
  - **Source View**: Raw CSV content
- **Collapsible panels**: Hide/show analysis panels as needed
- **Responsive design**: Adapts to different window sizes
- **Keyboard navigation**: Full keyboard support for power users
- **Progress indicators**: Visual feedback for long operations

## JSON Query Features

### JSONPath Support

- Query JSON data using JSONPath expressions
- Examples:
  - `$.*` - Get all top-level values
  - `$.store.book[*].title` - Get all book titles
  - `$.store.book[?(@.price < 10)]` - Filter books by price
  - `$..price` - Get all price values recursively

### jq Expression Support

- Transform and filter JSON data using jq syntax
- Examples:
  - `.` - Return the entire JSON
  - `.store.book[] | .title` - Extract all book titles
  - `[.store.book[].price, .store.bicycle.price]` - Collect all prices

### Query Interface

- Radio buttons to switch between JSONPath and jq modes
- Real-time query execution with error handling
- Sample queries provided for reference
- Keyboard shortcut: Ctrl+Enter (Cmd+Enter on Mac) to execute queries
- Clear button to reset and show original JSON

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Usage

1. Navigate through the file browser on the left panel
2. Click on any supported file to view it:
   - **Markdown files**: View rendered content or source code
   - **JSON files**: View with interactive query capabilities
   - **HTML files**: View with browser-like rendering or source code
   - **Images**: View with zoom controls and image information
   - **PDFs**: View in embedded viewer or download
   - **CSV files**: Comprehensive data analysis and querying
3. Use the "Show Source" / "Show Rendered" button to toggle between views (markdown only)
4. For JSON files, use the query interface to filter and transform data
5. For HTML files, toggle between rendered and source views, with refresh capability
6. For CSV files, explore data using the table view, apply filters, or write SQL queries

## Test Files

The application includes comprehensive test files in the `test-data/` directory:

- **CSV files**: Various formats (CSV, TSV, PSV) with different data types and edge cases
- **Sample data**: Employee data, product catalogs, and large datasets for performance testing
- **HTML files**: Simple and complex HTML pages for testing the HTML viewer
- **JSON files**: Sample data for testing JSONPath and jq queries
- **PDF files**: Sample PDFs for testing the PDF viewer

See `test-data/README.md` for detailed information about available test files.

## CSV Usage Examples

### Basic Data Exploration

1. Open any CSV file in the application
2. The data will be automatically parsed and displayed in a table
3. Use the column statistics panel to understand your data structure
4. Apply filters to focus on specific subsets of data

### Advanced Analysis with SQL

1. Switch to "Query View" mode
2. Try sample queries or write your own
3. Use aggregation functions to summarize data
4. Export query results for further analysis

### Data Quality Assessment

1. Check the data quality indicators in the column statistics
2. Identify columns with missing values
3. Review the top values for each column to spot anomalies
4. Use filters to investigate data quality issues

## Technologies Used

- React
- Vite
- react-markdown
- styled-components
- react-syntax-highlighter
- Electron (for file system access)
- jsonpath (for JSONPath queries)
- jq-in-the-browser (for jq expressions)
- papaparse (for CSV parsing)
- alasql (for SQL queries on CSV data)
- react-window (for virtual scrolling)
- sql-formatter (for SQL formatting)

## License

MIT
