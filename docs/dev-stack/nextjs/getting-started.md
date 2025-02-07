# Getting Started

## Layouts and Pages

- Next.js uses file-system based routing
- Creating a page
    - Add a `page` file and export default a React component
- Creating a layout
    - shared between multiple pages
        - on navigation, layouts preserve state, remain interactive, and do not rerender
    - default exporting a React component in the `layout` file
    - root layout is required and must contain html and body
        - Why no head element?
- Creating a nested route
    - Create new folder as a route segment
- Nesting layouts
    - By default, layouts are nested in the folder hierarchy
- Linking between pages
    - Link component in next/link
        - The primary and recommended way to navigate between pages
        - you might use useRouter hook for advanced navigation

