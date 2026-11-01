# GEMINI.md — AI Development Instructions

## 1. Project Overview

This repository contains a Food Ordering Platform that must be modernized into a scalable, secure, maintainable, AI-powered full-stack application.

Repository: https://github.com/Piyush-Sharma788/Food_Ordering_Platform

The objective is to modernize the existing application without unnecessarily rewriting working functionality or losing existing business logic.

Before making changes, inspect the entire repository, identify its existing architecture, understand its features, and create a phased migration plan.

Treat `companyguielsline.md` as the primary reference for product requirements, business rules, and engineering guidelines.

## 2. Mandatory Technology Stack

Per user directive, the modernized technology stack is:

- **Framework & Backend**: Django 5.1+ and Python 3.11+
- **Frontend / Presentation**: Django Templates, HTML5, CSS3, JavaScript (preserving monochrome aesthetic)
- **API Layer**: Django REST Framework (DRF) resource-oriented REST APIs
- **Database & ORM**: SQLite via Django ORM (with transactions and atomic updates)
- **AI Integration**: OpenAI API (`gpt-4o-mini`) and Google Generative AI (`gemini-1.5-flash`) via reusable server-side Python adapters
- **File Storage**: AWS S3 (`boto3`) with automatic local fallback
- **Document & Receipt Generation**: ReportLab vector PDF generator (with printable HTML fallback)
- **Authentication**: Django Authentication & Sessions with RBAC (`customer`, `canteen_owner`, `admin`)
- **Version Control**: Git and GitHub

Use maintained, compatible dependencies and verify their compatibility before upgrading.

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

## 5. Python and Coding Standards

- Prefer clean, idiomatic Python 3 (PEP 8) with type annotations.
- Use descriptive names and consistent naming conventions.
- Keep functions and methods focused, modular, and reusable.
- Separate business logic from Django views and presentation templates.
- Use shared utilities and service classes where appropriate.
- Handle exceptions, external API failures, and edge cases gracefully.
- Remove unused imports, dead code, and debugging statements.
- Avoid suppressing exceptions to hide underlying issues.
- Add comments and docstrings for non-obvious business decisions.

## 6. Frontend Development

Use Django Templates, HTML5, CSS3, and JavaScript adhering to the platform's visual design.

Requirements:

- Build modular, maintainable Django templates extending `base.html`.
- Preserve the signature monochrome high-contrast aesthetic (`#000000`, `#ffffff`, `#0d9488`).
- Keep secrets, API tokens, and privileged operations strictly on the server.
- Implement loading, empty, error, and success states in the UI.
- Use responsive layouts for mobile, tablet, and desktop viewports.
- Optimize asset loading, image delivery, and rendering performance.
- Provide accessible forms, CSRF protection, and semantic HTML.
- Keep client-side interactions cleanly organized in `static/js/zaika.js`.
- Never present mock data or non-functional controls as completed features.

Preserve useful existing branding and improve the UI consistently rather than redesigning randomly.

## 7. Backend Development

Use Django 5 and Python 3 for server-side logic and REST APIs.

Organize the backend into appropriate modules:

- `zaika/urls.py` — URL routing and dispatchers
- `zaika/views_ui.py` — Template rendering views
- `zaika/views_api.py` — DRF API views and action handlers
- `zaika/services/` — Business services (AI, PDF receipts, S3 storage)
- `zaika/models.py` — Django ORM models, relations, and indexes
- `zaika/serializers.py` — DRF request/response serializers
- `zaika/admin.py` — Django administration registrations
- `zaika/tests.py` — Automated test suite

### Backend requirements

- Validate all untrusted request inputs via DRF serializers or Django forms.
- Use appropriate HTTP methods and status codes.
- Return consistent JSON responses from API endpoints.
- Enforce authorization and RBAC on every protected operation.
- Verify resource ownership before modifying data.
- Prevent duplicate order submissions and race conditions.
- Handle concurrent updates, stock availability, and partial failures.
- Avoid exposing stack traces, credentials, or internal details in responses.
- Keep view handlers thin and domain logic in models or services.

Do not duplicate business rules across the frontend and backend.

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

## 9. SQLite and Django ORM

Use SQLite via Django's object-relational mapping (ORM) for persistent data storage.

Requirements:

- Define clean Django models with field validation, choices, and default values.
- Add database indexes (`db_index=True`, `indexes = [...]`) on frequently filtered columns (e.g., `status`, `student_id`, `category`).
- Use atomic transactions (`@transaction.atomic`) for multi-step order placement and balance/inventory modifications.
- Handle model constraints and duplicate errors gracefully.
- Keep monetary calculations consistent using Decimal fields or precision floats.
- Protect order processing against race conditions and concurrent modifications.
- Manage database schema changes strictly via versioned Django migrations (`python manage.py makemigrations`).

Collections/tables include Users, Restaurants, MenuItems, Orders, OrderItems, OrderStatusHistory, and Reviews.

Never expose database credentials or sensitive model attributes to the client.

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

## 13. Document and Receipt Generation

Use ReportLab for server-side generation of high-resolution vector PDF receipts and order invoices.

Requirements:

- Generate byte-stream PDFs dynamically without disk leaks.
- Ensure proper PDF headers (`%PDF-`) and printable layout standards.
- Include order metadata, itemized breakdowns, subtotal, 5% campus tax, and total.
- Provide a printable HTML receipt fallback at `/orders/<order_number>/receipt/html/`.
- Validate user ownership or kitchen staff authorization before serving receipts.

## 14. Security and Reliability

Follow secure development practices throughout the application.

- Validate and normalize untrusted inputs.
- Prevent SQL injection via Django ORM parameterized queries.
- Configure security headers, CSRF middleware, and XSS protection.
- Use secure cookies and session controls.
- Apply rate limiting to sensitive endpoints.
- Protect against SSRF and unauthorized file uploads.
- Enforce file-upload restrictions and MIME validation.
- Use least-privilege AWS credentials.
- Avoid logging passwords, tokens, API keys, or sensitive personal data.
- Keep secrets out of Git.
- Do not disable security checks to make features work.

## 15. Testing and Quality Assurance

Use Django's automated test framework (`python manage.py test`).

Test:

- Authentication and authorization with Student ID and roles.
- REST API validation and error handling via DRF.
- Restaurant and menu item retrieval and filtering.
- Dynamic preparation time algorithm calculations:
  $$\text{PrepTime} = \begin{cases} \text{baseTime}, & \text{if } \text{qty} = 1 \\ \text{baseTime} + \text{baseTime} \times 0.35 \times (\text{qty} - 1), & \text{if } \text{qty} > 1 \end{cases}$$
- Order subtotal, 5% tax, delivery fee, and grand total verification.
- Order creation and status transitions.
- ReportLab PDF generation byte integrity.
- AI chat provider fallback logic.
- Template rendering and response status codes.

Before declaring a task complete:

1. Run `python manage.py check`.
2. Run `python manage.py test`.
3. Review the Git diff.
4. Report actual results.

Never claim that a test or build passed if it was not executed successfully.

## 16. Environment Configuration

Maintain `.env.example` with the actual environment variable names required by the Django implementation.

Variables include:

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `OPENAI_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Never overwrite `.env`, reveal secret values, or commit production credentials.

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