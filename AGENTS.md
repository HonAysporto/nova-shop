# AGENTS.md

## Project Overview

This project is a modern Todo application built with Next.js, TypeScript, React, and Tailwind CSS.

The application allows users to create, manage, edit, complete, filter, and delete tasks.

Tasks are stored in the browser using localStorage so that they remain available after refreshing the page.

---

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Browser localStorage

---

## Project Structure


app/
├── page.tsx
└── ...

components/
├── ConfirmModal.tsx
├── TodoForm.tsx
├── TodoItem.tsx
├── TodoList.tsx
└── TodoStats.tsx


app/page.tsx

The main application page.

It is responsible for:

Managing Todo state
Adding tasks
Editing tasks
Deleting tasks
Toggling task completion
Filtering tasks
Persisting tasks to localStorage
Displaying confirmation modals
components/TodoForm.tsx

Responsible for:

Creating tasks
Editing existing tasks
Collecting task title
Collecting description
Selecting priority
Selecting time
components/TodoItem.tsx

Responsible for displaying an individual Todo.

It provides actions for:

Completing/uncompleting a task
Editing a task
Deleting a task
components/TodoList.tsx

Responsible for rendering the list of Todo items.

components/TodoStats.tsx

Displays:

Total tasks
Active tasks
Completed tasks
Overall completion percentage
components/ConfirmModal.tsx

Reusable confirmation dialog used before important actions such as:

Deleting a task
Saving changes to an existing task


Development Commands

Install dependencies:

npm install

Start the development server:

npm run dev

Build the application:

npm run build

Start the production server:

npm start

Run linting:

npm run lint


Coding Guidelines
TypeScript

Use TypeScript for all application code.

Avoid using any unless there is a specific reason.

Define interfaces or types for application data.

For example:

interface Todo {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  time: string;
  completed: boolean;
  createdAt: string;
}
React

Use functional components.

Use React hooks such as:

useState
useEffect

Keep reusable UI components inside the components directory.

Styling

Use Tailwind CSS for styling.

The application should maintain a modern, colorful, professional, and responsive design.

Avoid introducing unnecessary UI libraries when Tailwind CSS can handle the requirement.

State Management

Keep Todo state in app/page.tsx unless there is a clear reason to introduce another state management solution.

Use immutable state updates.

For example:

setTodos((currentTodos) =>
  currentTodos.map((todo) =>
    todo.id === id
      ? { ...todo, completed: !todo.completed }
      : todo
  )
);
Todo Data Rules

Every Todo should contain:

id
title
description
priority
time
completed
createdAt

Priority must be one of:

Low
Medium
High

New Todo items should start with:

completed: false
localStorage

Todo data is persisted using the browser's localStorage.

The localStorage key is:

todos

Do not access localStorage during server rendering.

Use client-side React effects for localStorage operations.

User Experience Rules

Important actions should require confirmation where appropriate.

Deleting a Todo must show a confirmation dialog.

Saving changes to an existing Todo must show a confirmation dialog.

The application should remain usable on mobile, tablet, and desktop screen sizes.

Avoid horizontal overflow.

Component Rules

When modifying an existing feature:

Check whether an existing component already handles the feature.
Reuse existing components where possible.
Avoid duplicating UI logic.
Keep components focused on a single responsibility.

Before creating a new component, check whether an existing component can reasonably be extended.

Before Completing Changes

After making changes:

Check TypeScript errors.
Run the linter.
Run the production build when appropriate.
Verify that existing Todo functionality still works.
Check the UI on both desktop and mobile layouts.

Do not remove existing functionality when adding a new feature unless explicitly requested.


