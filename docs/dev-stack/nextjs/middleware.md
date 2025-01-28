- [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Matching Paths](https://nextjs.org/docs/app/building-your-application/routing/middleware#matching-paths)

- Use cases
    - run on Edge runtime
- Convention: root level
- Matching paths: be invoked for every route
    - Execution order?
    - Two ways to define the matching paths
        - matcher: filter out the paths specified
            - `missing` and `has`?
        - conditional statements
- NextResponse
    - redirect: explicitly redirect to a different URL
    - rewrite the response by displaying a given URL
        - rewrite the URL internally without the user knowing
    - set cookies, headers

