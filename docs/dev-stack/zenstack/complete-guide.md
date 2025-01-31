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



### 4. Access Policy

- Introduction
    - Row-level and field-level access control
    - Accessing current user in rules
    - Accessing relations in rules
    - Pre and post-update rules
    - Functions that help you write advanced rules
    - block all operations by default
- ZenStack Access Policy vs Postgres Row-Level Security??

#### 4.1 Model-level policies

- @@allow, @@deny: take two arguments: operation and condition
- evaluation of model-level policies:
    - write as much as you want, order doesn't matter
    - **Each of the CRUD operation types governs a set of Prisma Client methods** [Link](https://zenstack.dev/docs/the-complete-guide/part1/access-policy/model-level)    
- relation manipulation and policies
- How Do Policies Affect Prisma Client's Behavior?
    - Read, Bulk update and bulk delete methods behave as if the rows that don't satisfy the policies don't exist
    - Nested read can filter out parent records
    - A write can imply a read
    - npx zenstack repl

#### 4.2 Authentication and Authorization

- Authentication: 

