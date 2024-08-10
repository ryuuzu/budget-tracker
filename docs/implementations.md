# Implementations

## Table of Contents

- [Overview](#overview)
- [Context API](#context-api)
- [ShadCN UI Library](#shadcn-ui-library)

## Overview

The application is implemented using React, a JavaScript library for building user interfaces. The application uses functional components, hooks, and context API to manage the state and logic of the application. The application uses the ShadCN UI Library to create the user interface components. The application is responsive and accessible, and it supports light and dark themes.

The application uses Vite as the build tool to bundle the application code and assets. Vite is a fast build tool that provides instant server start and hot module replacement. The application uses TypeScript to provide type checking and code completion. The application uses ESLint and Prettier to enforce code quality and formatting rules.

## Context API

The application utilized the Context API to manage the global state of the application and communicate the updates to the localstorage for persistence. The context provider is used to wrap the application components and provide the state and actions to the components. The context consumer is used to access the state and actions in the components. A total of three context providers have been used in the application.

1. Local Storage Context Provider

   The Local Storage Context Provider has been used to manage the local storage data in the application. It provides the local storage state and actions to the components. The local storage context is used to store the user data, the transactions, the user authentication state, the theme state in the local storage.

2. Auth Context Provider

   The Auth Context Provider has been used to manage the user authentication state in the application. It uses the data from the local storage context to check if the user is already authenticated. The provider provides the user authentication state and actions to the components.

3. Theme Context Provider

   The Theme Context Provider has been used to manage the theme state in the application. It provides the theme state and actions to the components. The theme context is used to store the current theme of the application. The user can switch between the light and dark themes using the theme context.

## ShadCN UI Library

The application utilized the ShadCN UI Library to create the user interface components. The UI library provides a set of reusable components that can be used to build the application interface. The components are designed to be responsive and accessible. The UI library includes components such as buttons, inputs, modals, alerts, and more.
