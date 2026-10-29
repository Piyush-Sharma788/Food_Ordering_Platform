# GEMINI.md — AI Development Instructions

## 1. Project Overview

This repository contains a Food Ordering Platform that must be modernized into a scalable, secure, maintainable, AI-powered full-stack application.

Repository: https://github.com/Piyush-Sharma788/Food_Ordering_Platform

The objective is to modernize the existing application without unnecessarily rewriting working functionality or losing existing business logic.

Before making changes, inspect the entire repository, identify its existing architecture, understand its features, and create a phased migration plan.

Treat `companyguielsline.md` as the primary reference for product requirements, business rules, and engineering guidelines.

## 2. Mandatory Technology Stack

Use the following target stack:

- Frontend: Next.js, React, TypeScript
- Backend: Node.js and TypeScript
- API: REST APIs
- Database: MongoDB
- AI integration: OpenAI API and Google Generative AI
- File storage: AWS S3
- Browser automation and document generation: Puppeteer
- Version control: Git and GitHub

Use maintained, compatible dependencies and verify their compatibility before upgrading.

Use Next.js Route Handlers for REST APIs where appropriate. Introduce a separate Node.js backend, such as Express, only when the architecture or requirements justify it.

Do not introduce redundant frameworks, databases, or services.

## 3. Mandatory Workflow

Follow this workflow for every significant task:

1. Inspect the existing implementation and related dependencies.
2. Read the relevant requirements in `companyguielsline.md`.
3. Identify the affected files, dependencies, and potential regressions.
4. Prepare a short implementation plan.
5. Implement changes incrementally.
6. Run relevant tests, type checks, linting, and build checks.
7. Review the final diff and update documentation.
8. Report completed work, verification results, and remaining issues.

For the initial migration, create `docs/INITIAL_AUDIT.md` before performing major architectural changes.

Never begin a complete rewrite without understanding the existing application.

## 4. Architecture and Code Organization

Maintain clear separation between:

- Presentation: pages, layouts, components, and UI interactions.
- API layer: HTTP requests, responses, route handlers, and controllers where applicable.
- Business logic: reusable services and domain rules.
- Data access: MongoDB models, queries, indexes, and repositories where useful.
- Validation: request validation and domain-level constraints.
- Authentication: sessions, identity, and authorization.
- AI integration: provider adapters, prompts, and structured outputs.
- Infrastructure: AWS S3, Puppeteer, external APIs, and logging.
- Testing: unit, integration, and end-to-end tests.

Use the existing repository conventions where they are sound. Introduce abstractions only when they improve maintainability or testability.

Avoid duplicated business logic, circular dependencies, oversized components, and unnecessary microservices.

## 5. TypeScript and Coding Standards

- Prefer strict TypeScript and explicit types.
- Avoid `any` and unsafe type assertions.
- Use descriptive names and consistent naming conventions.
- Keep functions focused and reusable.
- Separate business logic from presentation components.
- Use shared utilities where appropriate.
- Handle asynchronous operations and errors correctly.
- Remove unused imports, dead code, and debugging statements.
- Follow the existing formatter and linting configuration.
- Avoid suppressing compiler or lint errors to bypass problems.
- Add comments for non-obvious decisions, not self-explanatory code.

## 6. Frontend Development

Use Next.js App Router and React according to the existing architecture.

Requirements:

- Build reusable and accessible UI components.
- Use Server Components by default where suitable.
- Add `'use client'` only when client-side interactivity requires it.
- Keep secrets and privileged operations on the server.
- Implement loading, empty, error, and success states.
- Use responsive layouts for mobile, tablet, and desktop.
- Optimize image delivery, rendering, and page performance.
- Provide accessible forms, keyboard navigation, and semantic HTML.
- Keep API communication separate from complex UI business logic.
- Avoid unnecessary client-side JavaScript and duplicate data fetching.
- Never present mock data or non-functional controls as completed features.

Preserve useful existing branding and improve the UI consistently rather than redesigning randomly.

## 7. Backend Development

Use Node.js and TypeScript for server-side logic.

Organize the backend into appropriate modules:

- Routes or Route Handlers
- Controllers where useful
- Business services
- Data-access modules
- Database models and schemas
- Request validators
- Authentication and authorization middleware
- Error-handling utilities
- Logging and observability
- External integration services

### Backend requirements

- Validate all untrusted request inputs.
- Use appropriate HTTP methods and status codes.
- Return consistent JSON responses.
- Implement centralized error handling.
- Enforce authorization on every protected operation.
- Verify resource ownership before modifying data.
- Add pagination, filtering, and sorting where appropriate.
- Prevent duplicate order submissions.
- Handle concurrent updates and partial failures.
- Avoid exposing stack traces, credentials, or internal database details.
- Document API contracts.
- Keep controllers thin and business logic in services.

Do not duplicate business rules across the frontend and backend.

## 8. REST API Standards

Use resource-oriented API design.

Potential resource groups include:

- `/api/auth`
- `/api/users`
- `/api/restaurants`
- `/api/categories`
- `/api/menu-items`
- `/api/cart`
- `/api/orders`
- `/api/reviews`
- `/api/ai`
- `/api/uploads`
- `/api/admin`

These are proposed endpoints. Verify existing routes and actual product requirements before introducing them.

Use appropriate HTTP methods:

- `GET`: retrieve resources.
- `POST`: create resources or initiate actions.
- `PUT`: replace resources where appropriate.
- `PATCH`: update selected fields.
- `DELETE`: remove authorized resources.

Requirements:

- Validate request bodies, query parameters, and path parameters.
- Use predictable response structures.
- Return appropriate client and server error codes.
- Add request size limits and rate limiting where needed.
- Document authentication requirements and response schemas.
- Use OpenAPI documentation where practical.
- Never expose internal database fields unnecessarily.

## 9. MongoDB

Use MongoDB with either Mongoose or the native MongoDB driver, following the established project architecture.

Requirements:

- Define schemas and validation rules appropriate to the data.
- Add indexes for common queries.
- Avoid unbounded queries and inefficient database access.
- Validate data at API boundaries.
- Enforce resource ownership.
- Use atomic updates for concurrency-sensitive operations.
- Use transactions where supported and required for multi-document consistency.
- Handle duplicate keys, missing records, and database failures.
- Keep monetary calculations consistent.
- Protect inventory and order processing against race conditions.
- Avoid destructive schema changes without explicit approval.

Potential collections include users, restaurants, menu items, carts, orders, reviews, addresses, and audit records, depending on the actual requirements.

Never expose database credentials or sensitive document fields to the client.

## 10. Authentication and Authorization

Implement secure authentication using an established solution compatible with the application.

Requirements:

- Registration, login, logout, and session invalidation.
- Secure password hashing if password authentication is used.
- Secure cookie and session configuration.
- CSRF protections where applicable.
- Server-side role-based access control.
- Resource ownership verification.
- Rate limiting for sensitive endpoints.
- Protection against privilege escalation and insecure direct object references.

Potential roles include customer, restaurant staff, restaurant manager, delivery partner, and platform administrator. Implement only the roles required by `companyguielsline.md`.

Never trust roles, permissions, prices, or payment statuses supplied by the frontend.

## 11. OpenAI and Google Generative AI

Integrate both providers through reusable server-side adapters.

Requirements:

- Store API keys in environment variables.
- Never expose keys in client-side code.
- Keep prompts and provider-specific logic out of UI components.
- Validate inputs and structured outputs.
- Apply sensible timeouts, token limits, and usage controls.
- Handle rate limits, unavailable providers, and malformed responses.
- Avoid transmitting unnecessary personal data.
- Log operational metadata without exposing secrets.
- Use trusted application services for database access and business operations.
- Prevent AI-generated content from bypassing authentication or business rules.

Potential use cases include conversational food discovery, menu search, recommendations, and customer support.

Do not use both providers for every request without a clear reason. Select the appropriate provider for each task and provide graceful fallbacks.

AI must not independently invent prices, availability, payment confirmations, order statuses, or refund approvals.

## 12. AWS S3

Use AWS S3 for appropriate file storage, such as restaurant and menu-item images.

Requirements:

- Keep AWS credentials server-side.
- Use private storage by default.
- Validate file types and sizes.
- Generate unique object keys.
- Authorize upload, read, and deletion operations.
- Use short-lived presigned URLs when appropriate.
- Never trust user-supplied object keys.
- Handle upload failures and cleanup safely.
- Document required configuration in `.env.example`.

Never expose AWS credentials or grant unrestricted bucket access.

## 13. Puppeteer

Use Puppeteer only for justified browser automation and server-side document generation.

Requirements:

- Apply execution timeouts and resource limits.
- Restrict navigation to authorized destinations.
- Prevent SSRF and access to internal services.
- Clean up browser instances and temporary files.
- Validate generated documents before making them available.
- Handle failed jobs and concurrent execution safely.
- Avoid using browser automation when a normal API call is more appropriate.
- Never expose unrestricted browser debugging endpoints.

## 14. Security and Reliability

Follow secure development practices throughout the application.

- Validate and normalize untrusted inputs.
- Prevent NoSQL injection and mass assignment.
- Configure CORS and security headers appropriately.
- Use secure cookies and authentication controls.
- Apply rate limiting to sensitive endpoints.
- Protect against SSRF and XSS.
- Use CSRF protection where applicable.
- Enforce file-upload restrictions.
- Use least-privilege database and AWS credentials.
- Avoid logging passwords, tokens, API keys, or unnecessary personal information.
- Keep secrets out of Git.
- Do not disable security checks to make features work.

## 15. Testing and Quality Assurance

Use the repository's existing testing framework or introduce a suitable one if required.

Test:

- Authentication and authorization.
- REST API validation and error handling.
- Restaurant and menu management.
- Cart calculations and checkout.
- Order creation and status transitions.
- Pricing, discounts, and inventory constraints.
- Duplicate submissions and concurrent updates.
- AI provider failures and invalid outputs.
- S3 permissions and upload validation.
- Critical customer and administrative workflows.

Before declaring a task complete:

1. Run relevant tests.
2. Run TypeScript checks.
3. Run linting.
4. Run the production build where feasible.
5. Review the Git diff.
6. Report actual results.

Never claim that a test or build passed if it was not executed successfully.

## 16. Environment Configuration

Maintain `.env.example` with the actual environment variable names required by the implementation.

Potential variables include:

- `MONGODB_URI`
- `OPENAI_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET`
- Appropriate AWS credential configuration
- Authentication secrets
- Application base URL

These are examples. Verify the variable names expected by the application.

Never overwrite `.env`, reveal secret values, or commit production credentials.

Document local setup, development, testing, and deployment commands.

## 17. Git and Change Management

- Inspect `git status` before making significant changes.
- Preserve unrelated user modifications.
- Do not discard uncommitted changes without permission.
- Never force-push or rewrite shared history without explicit approval.
- Avoid destructive Git commands.
- Review diffs before completing a task.
- Keep changes focused and testable.
- Never commit secrets or local environment files.

## 18. Documentation

Maintain the following documentation where applicable:

- `GEMINI.md`: AI coding-agent instructions.
- `companyguielsline.md`: product and engineering guidelines.
- `docs/INITIAL_AUDIT.md`: existing architecture and migration plan.
- `README.md`: project setup and usage.
- `.env.example`: environment configuration.
- API documentation: endpoint contracts and examples.

Keep documentation synchronized with the implementation. Clearly distinguish implemented, partially implemented, and planned features.

## 19. Definition of Done

A task is complete only when:

- Requirements have been implemented.
- Existing functionality has been preserved unless explicitly changed.
- Validation and authorization are implemented.
- Errors and failure cases are handled.
- Relevant tests and checks have been executed.
- Documentation has been updated where needed.
- Security implications have been considered.
- Remaining limitations are documented.

## Golden Rule

Understand the existing code before changing it. Follow `companyguielsline.md`, plan significant changes, implement incrementally, verify results, and document accurately.

Prioritize working functionality, security, maintainability, and production readiness over unnecessary complexity.