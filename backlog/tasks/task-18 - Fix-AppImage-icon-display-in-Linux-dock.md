---
id: task-18
title: Fix AppImage icon display in Linux dock
status: To Do
assignee: []
created_date: '2025-08-02'
updated_date: '2025-08-02'
labels: []
dependencies: []
priority: high
---

## Description

The AppImage currently shows a generic/blue diamond icon in the Linux dock instead of the custom application icon from the assets folder. The icon files exist in assets/ directory but are not properly bundled or configured for the AppImage build.

## Acceptance Criteria

- [ ] AppImage shows correct icon (assets/icon.png) in Linux dock/launcher
- [ ] Icon persists correctly after installation
- [ ] Icon displays at all required sizes (16x16 to 256x256)
- [ ] No regression in Windows/macOS icon display
