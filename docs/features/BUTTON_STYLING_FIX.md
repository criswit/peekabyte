# CSV Viewer Button Styling Fix

## 🎯 **Issue Resolved**

Fixed the button coloring issue where the text on `Table View`, `Query View`, and `Source View` buttons was unreadable when not actively selected.

## 🔧 **Root Cause**

The CSV components were using theme colors that don't exist in the current theme system:

- `theme.colors.primary` ❌ (doesn't exist)
- `theme.colors.primaryForeground` ❌ (doesn't exist)
- `theme.colors.surface` ❌ (doesn't exist)
- `theme.colors.hover` ❌ (doesn't exist)

## ✅ **Solution**

Updated the `ToggleButton` styling in both components to use existing theme colors:

### Files Modified:

1. **`src/renderer/components/CsvViewer/CsvViewer.tsx`** - Main view toggle buttons
2. **`src/renderer/components/CsvViewer/ColumnStats.tsx`** - Summary/Detailed toggle buttons

### Color Mapping:

- **Active button background**: `theme.colors.linkColor` (blue)
- **Active button text**: `#ffffff` (white)
- **Inactive button background**: `theme.colors.background` (dark)
- **Inactive button text**: `theme.colors.foreground` (light)
- **Hover background**: `theme.colors.fileHover` (subtle highlight)
- **Border colors**: `theme.colors.linkColor` for active, `theme.colors.border` for inactive

### Improvements Added:

- ✅ **Better contrast** - White text on blue background for active buttons
- ✅ **Readable inactive state** - Light text on dark background for inactive buttons
- ✅ **Visual feedback** - Hover effects and focus outlines
- ✅ **Font weight** - Bold text for active buttons, medium for inactive
- ✅ **Accessibility** - Focus outlines for keyboard navigation

## 🧪 **Testing**

1. **Start the application**: `npm run electron:dev`
2. **Open any CSV file** (e.g., `sample-data.csv`, `test-basic.csv`)
3. **Check the toggle buttons** at the top right:
   - Active button should have **blue background with white text**
   - Inactive buttons should have **dark background with light text**
   - All text should be **clearly readable**
   - Hover effects should work smoothly

## 🎨 **Visual Result**

- **Before**: Unreadable text on inactive buttons
- **After**: Clear, readable text on all buttons with proper contrast

## 📁 **Affected Components**

- Main CSV viewer toggle buttons (Table View / Query View / Source View)
- Column statistics toggle buttons (Summary / Detailed)

The buttons now follow proper accessibility guidelines with sufficient color contrast and are fully readable in both active and inactive states.
