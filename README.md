# Get Started
```nodemon server```

# DB

### With Docker
``` docker run -d --name dev-mongo -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=secret -p 27017:27017  mongo```

# Arquitecture

![design-architecture](https://static.platzi.com/media/user_upload/diagrama-825e902b-0966-40f0-8231-65b99f7206c1.jpg)

# Notes
- Static files 
    + create folder called 'public'
    + add in server: 
        ``` app.use('/static', express.static('public')) ```

# Dev tools
- nodemon

# Dependencies
- Express
- body-parser (To converter content of request)
- mongoose (To handle comunication to db mongodb)
