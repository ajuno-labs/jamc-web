## Part 1: Supercharge ORM

- Extends Prisma ORM

### 0. Prisma Crash Course

- "schema-first" ORM
- Domain-Specific Language
- Prisma Client and Prisma Migrate 

### 1. ZModel Language

- Why ZModel?
    - Custom attributes
        - @password: auto hashing 
        - @omit: auto omit fields from queries
    - Other language features
        - import syntax: breaks down the schema into smaller, more manageable files
        - extends syntax: inherit from other models
    - A better plugin system
        - custom generators??? 
        - most ZenStack's features are plugins
- ZModel Structure
    - Prisma Schema Language superset -> all Prisma syntax is valid
    - `import`
        - zenstack merges all imports into a single file
    - prisma generators: the same
    - plugins???
    - @allow: ?
    - comments: `//` or `/* */`, `///` is documentation
    
### 2. ZenStack CLI

- `npx zenstack generate`
- having many packages provide plugins or runtime functionalities

### 3. Enhanced Prisma Client

- Enforcing access policies
- Data validation
- Hashing passwords
- Omitting fields from query results
    
- `enhance` is usually called with extra context arguments

```ts
import { getSessionUser } from './auth';

// the `getSessionUser` implementation depends on your authentication solution
const db = enhance(prisma, { user: getSessionUser() });
```


