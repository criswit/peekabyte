---
id: task-12
title: Implement synchronized scrolling
status: To Do
assignee: []
created_date: '2025-08-02'
labels: []
dependencies:
  - task-10
---

## Description

Add optional synchronized scrolling between split panes to enable side-by-side comparison of related content at the same scroll position

## Acceptance Criteria

- [ ] Toggle button enables/disables synchronized scrolling
- [ ] When enabled scrolling one pane scrolls the other
- [ ] Scroll position calculated proportionally by document height
- [ ] Sync works for both mouse wheel and scrollbar dragging
- [ ] Setting persists across sessions
- [ ] Visual indicator shows when sync is active
