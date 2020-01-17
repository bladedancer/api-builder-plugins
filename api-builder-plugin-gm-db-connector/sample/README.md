
## Sample Postgres DB

```docker run --rm -it -p 5432:5432 -e POSTGRES_PASSWORD=postgres -v `pwd`/postgres/docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d postgres```

User: postgres
Password: postgres