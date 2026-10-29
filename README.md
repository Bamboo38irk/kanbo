# Kanbo

> **Disclaimer:** this is a starter version of the project, made to show my skills with React, Redux and TypeScript. It is a demo, not a finished product.

A task manager for everyday life: home, shopping, repairs, the car and anything else that needs to get done. Every area of life is a board, and all boards live on one page.

**Demo:** [vedernikov.site/kanbo](https://vedernikov.site/kanbo/). Log in as `user` with the password `user123`. The demo account already has four boards shared with five other people: some boards belong to them, some tasks are assigned to you by them, and some you have given to them.

## About

Features:

- one page with boards side by side, scrolled horizontally, and a column to add a new board
- drag and drop of tasks between boards and inside a board, and of the boards themselves
- list view grouped by board and a month calendar by due date
- task details in a side panel: status, assignees, due date, subtasks and comments
- your own comments can be edited and deleted
- board members: invite people to a board and assign tasks to them
- search, filters by status or your own tasks, and sorting by creation date, due date or title
- notifications about new tasks and comments from other people
- profile settings: name and your own photo instead of initials

The app has no server. Login is checked against one demo account, all data lives in the Redux store and is saved to the browser's localStorage, so changes are only visible in the browser where they were made. The build is plain static files and runs on any regular hosting: it is served from `/kanbo/`, and `public/.htaccess` sends every route to `index.html`. To serve it from another path, change `base` in `vite.config.ts` and the paths in `.htaccess`.

## Stack

- React 19, TypeScript
- Redux Toolkit, React Redux
- React Router
- dnd-kit
- Vite, SCSS modules
- lucide-react

---

<sub>© 2026 Alexey Vedernikov. All rights reserved. This code is published only so that it can be reviewed as part of my portfolio. You may not copy, modify, distribute or use it, in whole or in part, in any personal or commercial project without my written permission.</sub>
