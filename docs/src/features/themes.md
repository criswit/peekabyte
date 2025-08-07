# Themes

Peeka2 includes a powerful theming system with six built-in themes and the foundation for custom themes.

## Built-in Themes

### Dark Theme (Default)

- High contrast with dark backgrounds
- Easy on the eyes for extended use
- Optimized for low-light environments
- Professional appearance

### Light Theme

- Clean, bright interface
- High readability in well-lit environments
- Familiar feel for light mode users
- Reduced eye strain in daylight

### Synthwave Theme

- Retro 80s aesthetic
- Vibrant neon colors
- Purple and pink highlights
- Perfect for night coding sessions

### Monokai Theme

- Classic code editor theme
- Warm color palette
- Popular among developers
- Excellent syntax highlighting

### GitHub Theme

- Familiar GitHub interface colors
- Clean and minimalist
- Great for documentation
- Professional appearance

### Dracula Theme

- Popular dark theme
- Purple accents
- High contrast elements
- Modern and stylish

## Theme Features

### Comprehensive Styling

Each theme defines colors for:

- Background colors (primary, secondary)
- Text colors (primary, secondary, muted)
- Border and divider colors
- Syntax highlighting colors
- Interactive state colors
- Selection highlights

### Instant Switching

- No reload required
- Smooth transitions
- Persistent selection
- Keyboard shortcut support (planned)

## Using Themes

### Switching Themes

1. Click the theme selector dropdown in the top-right
2. Select your preferred theme
3. Theme changes instantly
4. Selection is saved automatically

### Theme Persistence

- Saved to LocalStorage
- Restored on app launch
- Synced across windows (planned)
- Export/import settings (planned)

## Technical Implementation

### CSS Variables

Themes use CSS custom properties:

```css
--background-primary: #1e1e1e;
--text-primary: #d4d4d4;
--accent-color: #007acc;
```

### Styled Components

Integration with styled-components:

```typescript
background-color: ${props => props.theme.backgroundColor};
color: ${props => props.theme.textColor};
```

### Theme Provider

React Context provides theme to all components:

```typescript
<ThemeProvider theme={currentTheme}>
  <App />
</ThemeProvider>
```

## Creating Custom Themes

### Theme Structure

```typescript
interface Theme {
  name: string;
  backgroundColor: string;
  secondaryBackgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  borderColor: string;
  accentColor: string;
  // ... more properties
}
```

### Adding a Theme

1. Create theme file in `src/renderer/themes/`
2. Define color values
3. Export theme object
4. Add to theme list

## Accessibility

### Contrast Ratios

- All themes meet WCAG AA standards
- Text has 4.5:1 minimum contrast
- Interactive elements clearly visible
- Focus indicators prominent

### Preferences

- Respects system dark mode (planned)
- High contrast mode support (planned)
- Reduced motion support
- Color blind friendly options (planned)

## Future Enhancements

- Custom theme creator
- Theme marketplace
- System theme integration
- Per-file type themes
- Theme scheduling
- Color picker tool
