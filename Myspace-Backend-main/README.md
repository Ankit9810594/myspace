# MySpace-Backend-API

# Deployment Guide

# 1. Instal Dependencies
```
npm i
```

# 2. Set Environment Variables


MYSPACE_API_JWT_PRIVATE_KEY <br />
MYSPACE_API_DB <br />
MYSPACE_API_PORT <br />
MYSPACE_API_REQUIRES_AUTH <br />
MYSPACE_API_MAX_USERS <br />
MYSPACE_API_TOKEN_EXPIRY <br />
MYSPACE_API_EMAIL <br />
MYSPACE_API_MAIL_PASSWORD <br />
MYSPACE_API_CLIENT_URL <br />


### Example (For windows)
```
set MYSPACE_API_JWT_PRIVATE_KEY=abc12345
set MYSPACE_API_DB=mongodb://localhost/myspace
set MYSPACE_API_PORT=5000
set MYSPACE_API_REQUIRES_AUTH=true
set MYSPACE_API_MAX_USERS=1000
```

# 3. Run Test

```
npm run test
```

# 4. Run (in development mode)
```
npm run dev
```

# 5. Run (in development mode)
```
npm run start
``