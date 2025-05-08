
# Test 1 and Test 2 consolidated
Basic React Typescript and Node fetch with error handling and loading

TEST 1 and TEST 2 of React Typescript and Node.JS

reactype - folder:
```
npm install 
npm run dev
```

server - folder:
```
npm install
npx tsx src/server.ts
```

Seed - Database:
ensure credentials are correct in /server/.env
```
npx tsx src/seeds/projectseed.ts
```

Features:
Backend-> API endpoint search filtering and pagination support, CORS support for decoupling (separate frontend/backend server)
Frontend-> Debouncer for rate limiting purposes (1.5seconds)
