## Dev
Initiliaze the project:
```bash
npm i
npm run generate
npm run dev:migrate
```

Add your own models in the `prisma/schema.prisma` file:

```ts
// for example
model User {
  id       String @id @default(cuid())
  name     String
  password String
  posts    Post[]
}

model Post {
  id String @id @default(cuid())
  User   User   @relation(fields: [authorId], references: [id])
  authorId String
}
```
After updating the schema, run the generate script for new graphql types and resolvers in the node modules. Of course, you should also migrate the new schema to the database.

To add icons, put a 'logo.png' image in the public folder and run
```bash
npx pwa-asset-generator public/logo.png public/icons
```

When ready to dev:
```bash
npm run dev
```
Explore the api at [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql)

### Test PWA
Run
```bash
npm run build && npm start
```
and generate a report with lighthouse - it should report as a valid, installabe, pwa. Remember to have added icons.
