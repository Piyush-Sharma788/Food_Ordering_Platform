# Company Guidelines — Food Ordering Platform

## 1. Purpose

This document defines the product vision, business requirements, engineering principles, security expectations, and development standards for the Food Ordering Platform.

All developers and AI coding agents must follow these guidelines when implementing or modifying the application.

The goal is to build a reliable, secure, scalable, user-friendly food ordering platform using modern web technologies and carefully integrated AI capabilities.

## 2. Product Vision

Create a platform that connects customers with restaurants through a smooth food discovery, ordering, and order-management experience.

The platform should support:

- Restaurant discovery.
- Menu browsing.
- Search and filtering.
- Cart management.
- Secure checkout.
- Order tracking and history.
- Restaurant-side order management.
- Administrative oversight.
- AI-assisted discovery and customer support.

The implementation must reflect actual business requirements. Features that have not been approved or implemented must not be presented as completed functionality.

## 3. Technology Standards

The target technology stack is:

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Backend | Node.js, TypeScript |
| API | REST APIs |
| Database | MongoDB |
| AI | OpenAI API, Google Generative AI |
| File storage | AWS S3 |
| Browser automation | Puppeteer |
| Version control | Git and GitHub |

Use compatible, maintained dependencies.

Prefer a modular monolithic architecture unless actual scale or product requirements justify separating services.

Next.js Route Handlers may provide the REST API layer. A separate Node.js backend may be introduced when it provides a clear architectural benefit.

## 4. Core Engineering Principles

All development must follow these principles:

1. Correctness before speed.
2. Security before convenience.
3. Maintainability before unnecessary complexity.
4. Reuse existing functionality before replacing it.
5. Validate data at system boundaries.
6. Keep business logic on the server.
7. Make failures observable and recoverable.
8. Test important workflows.
9. Document architectural and business decisions.
10. Never claim completion without verification.

Every change must have a clear purpose and must not introduce unrelated modifications.

## 5. User Roles and Permissions

The application may support the following roles, subject to the actual product scope.

### Customer

- Manage their own profile and addresses.
- Browse restaurants and menus.
- Manage their cart.
- Place orders.
- View their own orders and order history.
- Cancel eligible orders according to business rules.
- Submit reviews where permitted.

### Restaurant Owner or Manager

- Manage authorized restaurant information.
- Manage menus, categories, prices, and item availability.
- View orders belonging to their restaurant.
- Accept or reject orders according to permitted rules.
- Update preparation and fulfillment statuses.
- Access authorized restaurant reports.

### Restaurant Staff

- Access only the operational functions granted to them.
- Process permitted orders.
- Update allowed order statuses.
- Avoid access to administrative or financial information unless authorized.

### Delivery Partner

If delivery management is in scope:

- View assigned deliveries.
- Access the information required for assigned deliveries.
- Update permitted delivery statuses.

### Platform Administrator

- Manage users and restaurants.
- Review platform orders.
- Manage platform-level settings and permissions.
- Access authorized reports and audit records.

### Authorization rules

- Enforce all permissions on the server.
- Verify ownership for private resources.
- Deny access by default when permissions are unclear.
- Never rely on frontend route guards alone.
- Do not allow users to assign themselves privileged roles.
- Keep administrative operations auditable.

Do not implement unnecessary roles if they are outside the approved product scope.

## 6. Customer Experience Requirements

### Account management

Support registration, login, logout, profile management, and secure session handling.

Validate user input and protect account information.

### Restaurant discovery

Provide restaurant listings, restaurant details, menu browsing, and useful search and filtering capabilities.

Display only verified restaurant information and availability.

### Menu management

Menu items may include:

- Name and description.
- Price.
- Category.
- Image.
- Availability.
- Customization options, if supported.

Restaurant managers may modify only restaurants and menus they are authorized to manage.

### Cart management

Support adding, removing, and updating items.

The server must verify menu-item availability, quantities, customizations, and current prices during checkout.

The client-side cart is not an authoritative source for prices or inventory.

### Checkout

Validate the customer's address, restaurant eligibility, item availability, quantities, and order totals before accepting an order.

Display a clear order summary with applicable fees, taxes, and discounts.

Never invent fees or apply undocumented pricing rules.

### Orders

Customers should be able to view their order history and current order status.

Implement only valid order-state transitions.

Prevent unauthorized access to another customer's orders.

### Reviews

If reviews are supported, validate review submissions, associate them with the correct user and restaurant, and enforce the approved review policy.

## 7. Restaurant Operations

Restaurant management features should include, where applicable:

- Restaurant profile and operating hours.
- Menu categories and items.
- Pricing and item availability.
- Order acceptance and rejection.
- Preparation and fulfillment statuses.
- Restaurant-specific reporting.

Changes to menu availability must be reflected in subsequent order validation.

Restaurant staff must not access another restaurant's private operational information.

## 8. Administration

Administrative features may include:

- User and restaurant management.
- Order oversight.
- Role and permission management.
- Audit logs.
- Platform configuration.
- Operational reporting.

Restrict administrative operations to authorized roles.

Record important administrative changes without storing unnecessary sensitive information.

## 9. Order and Pricing Rules

All order calculations must be performed or verified by the server.

The server must validate:

- Item prices and quantities.
- Restaurant and menu availability.
- Discounts and eligibility.
- Taxes and delivery charges.
- Customization charges, where applicable.
- Final order totals.
- Order cancellation eligibility.

Use a consistent monetary representation and rounding policy.

Never trust a total calculated only by the frontend.

### Order status

Define an explicit order-state machine based on the approved workflow.

Potential states include:

- Pending
- Confirmed
- Preparing
- Ready for pickup
- Out for delivery, if delivery is supported
- Completed
- Cancelled
- Rejected

Not every state applies to every fulfillment model.

Enforce valid transitions on the server. Prevent unauthorized status changes and retain relevant timestamps and audit information.

### Duplicate orders and concurrent updates

Use appropriate idempotency controls for order creation and payment-related operations.

Protect inventory and availability updates against race conditions.

Use database transactions or atomic operations where necessary and supported.

## 10. Payments and Refunds

Payment processing must be integrated only through an explicitly selected, supported payment provider.

If payments are implemented:

- Verify payment results server-side.
- Validate signed webhooks.
- Prevent duplicate payment processing.
- Never store raw card details.
- Keep payment status separate from order status where appropriate.
- Handle failed payments, retries, cancellations, and refunds safely.
- Never treat a browser redirect as proof of payment.

Refund eligibility and approval must follow documented business rules.

If no payment provider has been configured, clearly document the payment flow as incomplete rather than simulating successful real payments.

## 11. AI Product Guidelines

Use OpenAI API and Google Generative AI to improve customer experience and operational efficiency.

Potential use cases:

- Conversational food discovery.
- Natural-language menu search.
- Personalized recommendations based on permitted data.
- Menu-description assistance.
- Customer-support assistance based on verified platform information.

### AI safety and correctness

- Retrieve menu information and prices from trusted application data.
- Validate model-generated outputs.
- Avoid unnecessary personal data sharing.
- Apply rate limits and usage controls.
- Handle provider failures gracefully.
- Prevent prompt injection from overriding system permissions.
- Do not let AI independently authorize refunds, payments, or privileged operations.
- Require authenticated application services for all state-changing operations.
- Do not present AI-generated assumptions as verified facts.

AI must remain an assistance layer, not the authority for critical business decisions.

## 12. Backend and API Guidelines

All backend operations must follow secure, consistent REST API practices.

- Validate all request inputs.
- Use appropriate HTTP methods and status codes.
- Return predictable response formats.
- Apply authentication and authorization where required.
- Handle errors centrally.
- Add pagination and filtering where needed.
- Avoid exposing internal implementation details.
- Prevent injection and unauthorized data access.
- Document API contracts.
- Test critical endpoints.

Business rules must be enforced on the server even when equivalent frontend validation exists.

## 13. Database Guidelines

Use MongoDB schemas and indexes that match the application's actual data requirements.

Potential entities include users, restaurants, menu items, carts, orders, reviews, and addresses.

- Define appropriate validation and indexes.
- Maintain consistent data ownership.
- Avoid unnecessary duplication.
- Handle concurrency-sensitive updates safely.
- Protect private information.
- Use transactions where appropriate.
- Document significant schema changes.
- Never modify or delete production data without authorization.

Do not create collections or fields merely because they are listed as examples in this document.

## 14. AWS S3 and File Management

Use AWS S3 for authorized image and document storage.

- Keep buckets private by default.
- Validate uploaded files.
- Apply file-size limits.
- Use unique storage keys.
- Restrict upload and deletion permissions.
- Use short-lived presigned URLs when suitable.
- Keep AWS credentials on the server.
- Handle failed uploads and cleanup.
- Avoid exposing private files through unrestricted public URLs.

## 15. Puppeteer and Automation

Use Puppeteer for approved browser automation, PDF generation, and document rendering where needed.

Automation must:

- Use explicit execution limits.
- Restrict access to authorized destinations.
- Prevent SSRF and internal network access.
- Clean up browser resources.
- Validate generated output.
- Avoid unnecessary automation when a normal API is more appropriate.

Do not introduce browser automation solely to make the architecture appear more sophisticated.

## 16. UI/UX Standards

The application should provide a polished, consistent, accessible experience.

- Use a consistent design system.
- Maintain responsive layouts.
- Provide meaningful loading and error states.
- Use clear navigation and forms.
- Ensure important actions are accessible.
- Optimize images and rendering performance.
- Maintain consistent typography, spacing, and visual hierarchy.
- Avoid misleading UI states.
- Ensure every implemented control performs its intended action.

Preserve useful existing functionality and branding unless an improvement is justified.

## 17. Security and Privacy

Security is mandatory across the entire application.

- Keep secrets out of source control.
- Use secure authentication and authorization.
- Validate untrusted input.
- Apply least-privilege access.
- Protect against injection, XSS, CSRF where applicable, and SSRF.
- Configure cookies, CORS, and security headers appropriately.
- Apply rate limits to sensitive operations.
- Protect private user and order data.
- Avoid logging credentials or unnecessary personal information.
- Review dependencies for security and compatibility.
- Require authorization for sensitive administrative operations.

Never disable security controls merely to make a feature function.

## 18. Testing and Release Standards

Every significant feature must be verified.

Test relevant scenarios, including:

- Successful operations.
- Invalid input.
- Unauthorized access.
- Missing resources.
- External service failures.
- Database failures.
- Concurrent updates.
- Duplicate submissions.
- Edge cases in pricing and order processing.

Before merging or releasing changes:

- Run relevant automated tests.
- Run TypeScript checks.
- Run linting.
- Run the production build where feasible.
- Review the diff.
- Update documentation.
- Record unresolved issues.

Report test results honestly.

## 19. Environment and Deployment

Maintain an accurate `.env.example` containing the variables required by the implementation.

Never commit production secrets or overwrite existing environment configuration without approval.

Document:

- Prerequisites.
- Installation.
- Local development.
- Database configuration.
- AI provider setup.
- AWS S3 configuration.
- Testing.
- Production build.
- Deployment configuration.

Do not assume that external accounts, API keys, payment integrations, or cloud infrastructure already exist.

## 20. Code Review and Change Management

Before making substantial changes, inspect the current Git status.

- Preserve unrelated local changes.
- Avoid destructive commands.
- Never force-push or rewrite shared history without explicit approval.
- Keep changes focused.
- Review modified files.
- Update affected documentation.
- Explain significant architectural decisions.

Ask for confirmation before destructive operations or actions that could affect production systems.

## 21. Documentation and Feature Status

Maintain accurate documentation.

Every feature must be clearly identified as one of the following:

- **Implemented:** Functionality exists and has been verified.
- **Partially implemented:** Some required behavior remains incomplete.
- **Planned:** Requirements exist, but implementation is pending.
- **Blocked:** Implementation depends on unresolved decisions or external requirements.

Do not represent planned features as completed.

## 22. AI Coding Agent Responsibilities

AI coding agents must:

1. Read `GEMINI.md` and this document before making substantial changes.
2. Inspect the actual repository rather than assuming its structure.
3. Preserve working functionality.
4. Follow the approved architecture and business rules.
5. Avoid unnecessary rewrites.
6. Never fabricate test results.
7. Never expose secrets.
8. Ask for clarification when business-critical requirements are ambiguous.
9. Document meaningful changes.
10. Provide a concise implementation and verification report.

## 23. Definition of Done

A feature is complete only when it satisfies its requirements, has appropriate validation and authorization, handles important failure cases, passes the relevant verification checks, and is documented accurately.

The overall platform must prioritize reliability, security, maintainability, usability, and verified functionality over superficial completeness.

## Final Principle

Build a food ordering platform that works reliably in real-world conditions. Make decisions based on actual requirements, enforce business rules on the server, preserve existing functionality, and verify every meaningful change.