---
id: task-6
title: Add Vim normal mode navigation
status: To Do
assignee: []
created_date: '2025-08-02'
labels: []
dependencies:
  - task-5
---

## Description

Implement core Vim navigation commands in normal mode to enable efficient keyboard-based movement through documents

## Acceptance Criteria

- [ ] h/j/k/l keys move cursor left/down/up/right
- [ ] gg jumps to document start and G jumps to end
- [ ] 0 moves to line start and $ to line end
- [ ] w/b move forward/backward by word
- [ ] Ctrl+d/Ctrl+u scroll half page down/up
- [ ] Number prefixes work (5j moves 5 lines down)
- [ ] Cursor position displays in status bar
