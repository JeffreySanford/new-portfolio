# Angular Project Coding Standards

This document outlines the coding standards and best practices for Angular projects within this repository. These guidelines aim to ensure consistency, maintainability, and high-quality code across the entire codebase.

## 1. General Angular Coding Standards

### 1.1 Project Structure
- Follow the Angular CLI’s default structure for organizing modules, components, services, and other assets.
- Group related files together, keeping a clear separation of concerns (e.g., `components`, `services`, `models`, etc.).
- **Why Use Modules?**: 
  - **Encapsulation**: Modules allow you to encapsulate and manage specific functionalities of the application. This makes the codebase easier to maintain and understand, especially as the application grows.
  - **Scalability**: In enterprise applications, features tend to evolve independently. Modules allow for clear separation of concerns, enabling teams to work on different parts of the application without causing conflicts.
  - **Lazy Loading**: Angular modules can be lazily loaded, meaning that parts of the application are only loaded when needed. This improves the application's performance by reducing the initial load time.
  - **Reusability**: Modules can be easily reused across different parts of the application or even in different projects. This promotes DRY (Don't Repeat Yourself) principles and code reusability.

### 1.2 Naming Conventions
- **Components**: Use `PascalCase` for component class names and `kebab-case` for filenames (e.g., `UserProfileComponent` class in `user-profile.component.ts`).
- **Services**: Use `PascalCase` for service class names and append `Service` to the name (e.g., `AuthService` in `auth.service.ts`).
- **Modules**: Use `PascalCase` for module names and append `Module` to the name (e.g., `UserModule`).
- **Directives & Pipes**: Use `PascalCase` for directive and pipe class names, and `kebab-case` for filenames (e.g., `HighlightDirective` in `highlight.directive.ts`).

### 1.3 Component Design
- Keep components small and focused on a single responsibility.
- Use Angular’s `OnPush` change detection strategy wherever possible for better performance.
- Prefer using `@Input()` and `@Output()` decorators for component communication over service-based approaches unless necessary.

## 2. RxJS and Observables

### 2.1 Usage
- Prefer using `Observables` over `Promises` for asynchronous operations.
- Use the `async` pipe in templates to handle subscription management for simple subscriptions (cold observables).
- For hot observables, explicitly handle subscriptions using the `next`, `error`, and `complete` methods in the component to gain more control over debugging and to handle complex scenarios.
- Developers must be diligent in managing subscriptions for hot observables to avoid memory leaks.

### 2.2 Why Use Observables Over Promises/Async?
- **Multiple Values**: Unlike Promises, which handle only a single value, Observables can handle a stream of multiple values over time. This makes them ideal for scenarios like handling user input, web socket data, or any event-based data streams.
- **Composability**: Observables are composable and can be combined, transformed, and filtered using operators like `map`, `filter`, `reduce`, and more. This allows for more powerful and expressive asynchronous code.
- **Cancellation**: Observables allow for easy cancellation of ongoing asynchronous operations through the use of subscriptions. With Promises, cancellation is not natively supported, which can lead to memory leaks if not handled properly.
- **Consistency with Angular**: Angular's HttpClient, Forms, and many other APIs are built on top of Observables. Using Observables consistently across the application aligns with Angular’s design principles and makes the code more coherent and maintainable.
- **Error Handling**: Observables provide more flexible error handling mechanisms with operators like `catchError` and `retry`, allowing developers to handle errors more gracefully and according to different scenarios.
- **Cold vs. Hot Observables**:
  - For **cold observables**, the `async` pipe in the template is preferred because it handles the subscription and unsubscription automatically, simplifying the component code.
  - For **hot observables**, using the `next`, `error`, and `complete` methods within the component is beneficial for debugging and managing more complex data streams. Developers should ensure that these subscriptions are properly managed and unsubscribed to prevent memory leaks.

## 3. Material Design Guidelines

### 3.1 Usage of Angular Material
- Prefer Angular Material components over custom CSS for UI elements whenev
