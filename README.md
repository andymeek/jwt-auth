# JWT Auth with TypeORM & GraphQL

## Note: install PostgreSQL

```bash
brew install postgresql
brew services start postgresql
```

1. Create database called `jwt-auth`
2. [Add a user](https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e) with the username `postgres` and and no password. (You can change what these values are in the [ormconfig.json]()
