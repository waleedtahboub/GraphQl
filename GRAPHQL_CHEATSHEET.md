# 🚀 GraphQL & Apollo Server: Beginner's Guide & Cheat Sheet

Welcome! If you are learning GraphQL for the first time, this guide is designed to make your life easier. It covers all the core concepts, common pitfalls, and code snippets you need to build your first GraphQL API using Node.js and Apollo Server.

---

## 📖 1. What is GraphQL?
GraphQL is a query language for your API. Unlike traditional REST APIs where you have multiple endpoints (e.g., `/api/games`, `/api/authors`), GraphQL exposes a **single endpoint**. 

The client (like a web browser or mobile app) sends a query asking for *exactly* the data it needs, and the server responds with *only* that data. No more over-fetching or under-fetching!

An Apollo Server needs two main things to work:
1. **`typeDefs` (Schema)**: The blueprint of your data.
2. **`resolvers`**: The functions that actually fetch the data to fulfill that blueprint.

---

## 🛠️ 2. Quick Setup

If you are starting a project from scratch, here is how to set up your environment:

```bash
# 1. Initialize a new Node.js project
npm init -y

# 2. Install Apollo Server and GraphQL
npm install @apollo/server graphql

# 3. Install TypeScript execution tools (optional but recommended)
npm install -D tsx typescript @types/node
```

*Note: Make sure to add `"type": "module"` to your `package.json` to use modern `import` syntax!*

---

## 🏗️ 3. The Schema (`typeDefs`)

Your schema is defined using a GraphQL string (`` `#graphql ...` ``). It outlines all the types of data in your application.

### Object Types
These represent the custom objects in your database. Let's use a Video Game Review app as an example:
```graphql
type Game {
    id: ID!
    title: String!
    platform: [String!]!
    reviews: [Review!]
}
```
*   **`!` (Exclamation Mark)**: Means the field is **required** (cannot be null).
*   **`[ ]` (Brackets)**: Means the field is an **array** (list). So `[String!]!` means a required list of required strings.

### The `Query` Type
This is a mandatory type. It defines the entry points for **reading** data.
```graphql
type Query {
    games: [Game]              # Get all games
    game(id: ID!): Game        # Get a single game by its ID
}
```

### The `Mutation` Type
This defines the entry points for **changing** data (Create, Read, Update, Delete).
```graphql
type Mutation {
    addGame(game: AddGameInput!): Game
    deleteGame(id: ID!): [Game]
    updateGame(id: ID!, edit: UpdateGameInput): Game
}
```

### `input` Types
When mutations require multiple arguments, group them into an `input` type to keep your schema clean.
```graphql
input UpdateGameInput {
    title: String
    platform: [String!]
}
```

---

## ⚙️ 4. Resolvers

Resolvers are the JavaScript/TypeScript functions that fetch the data. **Crucial Rule:** The structure of your `resolvers` object must *exactly match* the structure of your `typeDefs`.

### Query Resolvers
Used to fetch lists or individual items.
```typescript
const resolvers = {
    Query: {
        // Return the whole list
        games() {
            return db.games;
        },
        // The second argument (args) contains the variables passed in the query
        game(_: any, args: { id: string }) {
            return db.games.find((game) => game.id === args.id);
        }
    },
    // ...
```

### Mutation Resolvers
Used to modify data. Remember to return the data exactly as specified in your schema!
```typescript
    Mutation: {
        deleteGame(_: any, args: { id: string }) {
            // Overwrite the array with a filtered version
            db.games = db.games.filter((game) => game.id !== args.id);
            return db.games; 
        }
    },
```

### Relationship (Nested) Resolvers
This is where GraphQL truly shines. If a `Game` has `reviews`, you create a resolver specifically for `Game.reviews`.
*   The first argument (`parent`) is the parent object (in this case, the specific Game).
```typescript
    Game: {
        reviews(parent: any) {
            // Find all reviews where the game_id matches this Game's id
            return db.reviews.filter((review) => review.game_id === parent.id);
        }
    }
}
```

---

## 🚀 5. Starting Apollo Server

To bring it all together, create an instance of Apollo Server and pass it your schema and resolvers.

```typescript
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Import your schema and resolvers here...

const server = new ApolloServer({
  typeDefs, 
  resolvers,
});

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`Server ready at ${url}`);
```

---

## ⚠️ 6. Common Gotchas & Pro-Tips

### 1. Naming Must Match Exactly
If your schema has `reviews: [Review!]` (plural), your resolver **must** be named `reviews(parent) { ... }`. If one is singular and the other is plural, your server will crash on startup.

### 2. Imports are Read-Only (JavaScript Rule)
If you try to import an array and modify it like this: `import { games } from './db.js'`, you **cannot** reassign it (`games = games.filter(...)`). 
*   **The Fix**: Export a single object from your database (`export default { games }`) and import it as `import db from './db.js'`. Then you can reassign properties: `db.games = db.games.filter(...)`.

### 3. Apollo Sandbox Variables
When testing mutations in Apollo Sandbox, if your query requires variables (like `$id: ID!`), you must provide them in the **Variables JSON tab** at the bottom of the screen.
```json
{
  "id": "2",
  "edit": {
    "title": "New Title"
  }
}
```
