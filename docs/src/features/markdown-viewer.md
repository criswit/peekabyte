# Markdown Viewer

The Markdown Viewer provides a rich rendering experience for Markdown files with syntax highlighting and live updates.

## Features

### Markdown Support

- **CommonMark compliant**: Full support for standard Markdown
- **GitHub Flavored Markdown**: Tables, task lists, strikethrough
- **Code highlighting**: Syntax highlighting for code blocks
- **Live preview**: Updates automatically when files change

### Supported Elements

#### Basic Formatting

- Headers (h1-h6)
- Bold and italic text
- Links and images
- Lists (ordered and unordered)
- Blockquotes
- Horizontal rules

#### Extended Features

- Tables with alignment
- Task lists with checkboxes
- Fenced code blocks
- Inline code
- Strikethrough text
- Line breaks

### Code Highlighting

```javascript
// Automatic language detection
function example() {
  return 'Syntax highlighted!';
}
```

Supported languages:

- JavaScript/TypeScript
- Python
- Java
- C/C++
- HTML/CSS
- JSON
- YAML
- And many more...

## User Interface

### Display Options

- **Scrollable content**: Smooth scrolling for long documents
- **Responsive images**: Images scale to fit
- **Readable typography**: Optimized for reading
- **Theme integration**: Follows app theme

### Interactive Elements

- **Clickable links**: Opens in default browser
- **Copy code blocks**: One-click code copying
- **Image zoom**: Click to view full size (planned)
- **Table of contents**: Jump to sections (planned)

## Performance

### Optimizations

- **Incremental rendering**: Large files render progressively
- **Memoized parsing**: Cached parsing results
- **Debounced updates**: Prevents excessive re-renders
- **Lazy image loading**: Images load on demand

### File Size Limits

- **Optimal**: Files under 1MB
- **Good**: Files up to 5MB
- **Slow**: Files over 10MB
- **Maximum**: 50MB (configurable)

## Tips for Best Experience

1. **Use proper headings**: Structure documents with heading hierarchy
2. **Optimize images**: Use appropriate image sizes
3. **Code fence languages**: Specify language for better highlighting
4. **Break up content**: Use sections for better readability

## Keyboard Shortcuts

- `Ctrl/Cmd + F`: Search in document (planned)
- `Ctrl/Cmd + +/-`: Zoom in/out (planned)
- `Space/Shift+Space`: Page down/up
- `Home/End`: Jump to start/end

## Known Limitations

- No support for HTML in Markdown
- Math equations not yet supported
- Mermaid diagrams not rendered
- Custom CSS not supported

## Future Enhancements

- Print support
- Export to PDF
- Custom CSS themes
- Mermaid diagram support
- Math equation rendering
- Document outline panel
