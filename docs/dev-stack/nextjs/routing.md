# Routing

## [Layouts and Templates](getting-started.md#layouts-and-pages)

## Linking and Navigating

- Link component
    - Client-side navigation
    - extends &lt;a&gt; element
    - href attribute
- useRouter hook
    - change routes from Client Components
- redirect function
    - for server components
    - returns 307 by default in server components and 303 in server actions
    - can be called in Client Components during the rendering process but not in event handlers
    - internally throws an error?? should be called outside `try/catch` block
    - accept absolute URL for external links
- native History API??

- How Routing and Navigation works
    - Code Splitting
    - Prefetching
    - Caching
    - Partial Rendering
    - Soft Navigation
    - Back and Forward Navigation
    - Routing between `/page` and `/app`...
