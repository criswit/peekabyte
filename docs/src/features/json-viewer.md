# JSON Viewer

The JSON Viewer provides a formatted, syntax-highlighted view of JSON files with helpful features for exploring data.

## Features

### Core Functionality

- **Syntax highlighting**: Color-coded JSON elements
- **Pretty formatting**: Automatic indentation and spacing
- **Error handling**: Clear error messages for invalid JSON
- **Large file support**: Handles files up to 10MB efficiently

### Visual Features

- **Collapsible sections**: Expand/collapse objects and arrays
- **Line numbers**: Easy reference to specific lines
- **Type indicators**: Visual distinction for different data types
- **Bracket matching**: Highlight matching brackets

## Data Type Support

### Supported Types

- **Objects**: `{}`
- **Arrays**: `[]`
- **Strings**: `"text"`
- **Numbers**: `123`, `12.34`
- **Booleans**: `true`, `false`
- **Null**: `null`

### Special Handling

- **Long strings**: Truncated with expand option
- **Large arrays**: Pagination for arrays > 1000 items
- **Nested objects**: Indentation up to 10 levels
- **Special characters**: Proper escaping displayed

## User Interface

### Interactive Elements

- **Click to collapse**: Click on objects/arrays to toggle
- **Copy button**: Copy entire JSON or sections
- **Search**: Find text within JSON (planned)
- **Path display**: Show path to selected element (planned)

### Theme Integration

Each theme provides optimized colors for:

- Property names
- String values
- Number values
- Boolean values
- Null values
- Brackets and punctuation

## Performance Features

### Optimizations

- **Virtual scrolling**: For large files
- **Lazy parsing**: Parse visible content first
- **Memoization**: Cache formatted output
- **Web worker**: Parse in background (planned)

### File Size Guidelines

- **Instant**: < 100KB
- **Fast**: < 1MB
- **Acceptable**: < 5MB
- **Slow**: > 10MB

## Usage Tips

1. **Navigate large files**: Use collapse all/expand all
2. **Find specific data**: Use Ctrl+F browser search
3. **Copy sections**: Click on values to select
4. **Validate JSON**: Errors show line and column

## Error Messages

Common errors and their meanings:

- **Unexpected token**: Syntax error in JSON
- **Unexpected end**: Missing closing bracket
- **Invalid character**: Non-JSON characters present
- **Duplicate key**: Same key used twice in object

## Keyboard Shortcuts

- `Ctrl/Cmd + A`: Select all
- `Ctrl/Cmd + C`: Copy selected
- `+/-`: Expand/collapse focused node (planned)
- `*`: Expand all (planned)

## Limitations

- No JSON Schema validation
- No editing capabilities
- Limited to UTF-8 encoding
- No JSONP support

## Future Enhancements

- JSON Schema validation
- Edit mode with validation
- Export formatted JSON
- Diff view for comparing
- JSONPath query support
- Tree view alternative
