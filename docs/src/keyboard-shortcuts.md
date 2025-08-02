# Keyboard Shortcuts

Peeka2 supports various keyboard shortcuts to improve productivity and navigation.

## Global Shortcuts

### Application Control
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Q` | Quit application |
| `Ctrl/Cmd + W` | Close window |
| `Ctrl/Cmd + M` | Minimize window |
| `F11` | Toggle fullscreen |

### Developer Tools
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Shift + I` | Toggle DevTools |
| `Ctrl/Cmd + R` | Reload window |
| `Ctrl/Cmd + Shift + R` | Force reload |

## File Browser Shortcuts

### Navigation
| Shortcut | Action |
|----------|--------|
| `↑` / `↓` | Navigate up/down |
| `←` / `→` | Collapse/expand folders |
| `Enter` | Open file/folder |
| `Space` | Preview file |
| `Home` | Go to first item |
| `End` | Go to last item |

### Actions
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + D` | Add to favorites |
| `Ctrl/Cmd + O` | Open file dialog |
| `Ctrl/Cmd + Shift + O` | Open folder dialog |
| `Backspace` | Go to parent directory |

## Viewer Shortcuts

### General Viewing
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + F` | Find in file (planned) |
| `Ctrl/Cmd + +` | Zoom in (planned) |
| `Ctrl/Cmd + -` | Zoom out (planned) |
| `Ctrl/Cmd + 0` | Reset zoom (planned) |

### Text Navigation
| Shortcut | Action |
|----------|--------|
| `Page Up` | Scroll up one page |
| `Page Down` | Scroll down one page |
| `Ctrl/Cmd + Home` | Go to beginning |
| `Ctrl/Cmd + End` | Go to end |

## Theme Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + T` | Open theme selector (planned) |
| `Ctrl/Cmd + Shift + D` | Toggle dark mode (planned) |

## Panel Management

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + B` | Toggle file browser (planned) |
| `Ctrl/Cmd + \` | Split panel (planned) |
| `Ctrl/Cmd + Shift + \` | Close panel (planned) |

## Platform-Specific Notes

### macOS
- Use `Cmd` instead of `Ctrl`
- Additional gestures supported:
  - Pinch to zoom
  - Swipe to navigate

### Windows/Linux
- Use `Ctrl` for shortcuts
- `Alt` key for menu navigation
- Right-click for context menus

## Customization

### Future: Custom Shortcuts
```json
{
  "keybindings": {
    "file.open": "ctrl+o",
    "file.save": "ctrl+s",
    "view.zoomIn": "ctrl+plus",
    "view.zoomOut": "ctrl+minus"
  }
}
```

### Vim Mode (Planned)
Enable Vim-style navigation:
- `h`, `j`, `k`, `l` for movement
- `/` for search
- `g` for go-to commands

## Accessibility Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Navigate focusable elements |
| `Shift + Tab` | Navigate backwards |
| `Ctrl/Cmd + L` | Focus file browser |
| `Ctrl/Cmd + K` | Open command palette (planned) |

## Quick Actions (Planned)

### Command Palette
`Ctrl/Cmd + Shift + P` opens command palette:
- Search commands
- Execute actions
- Change settings
- Open files

### Quick Open
`Ctrl/Cmd + P` for quick file open:
- Fuzzy file search
- Recent files
- Favorite locations

## Tips

1. **Learn gradually**: Start with basic navigation
2. **Use what helps**: Not all shortcuts needed
3. **Platform consistency**: Follow OS conventions
4. **Accessibility**: All features keyboard accessible

## Shortcut Conflicts

Common conflicts and solutions:
- Browser shortcuts: Electron intercepts first
- OS shortcuts: Some reserved by system
- Custom apps: May override global shortcuts

## Future Enhancements

- Customizable keybindings
- Shortcut cheat sheet overlay
- Context-sensitive shortcuts
- Macro recording
- Command sequences