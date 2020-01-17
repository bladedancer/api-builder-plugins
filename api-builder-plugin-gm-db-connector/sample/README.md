# Run the demo
Start the sample database containers.

## Sample Postgres DB

```docker run --rm -it -p 5432:5432 -e POSTGRES_PASSWORD=postgres -v `pwd`/databases/postgres/docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d postgres```

## Sample Mysql DB

```docker run --rm -it -p 3306:3306 -e MYSQL_ROOT_PASSWORD=mysql-pw -e MYSQL_DATABASE=demo -e MYSQL_USER=mysql -e MYSQL_PASSWORD=mysql -v `pwd`/databases/mysql/docker-entrypoint-initdb.d:/docker-entrypoint-initdb.d mysql:5```

## Start API Builder
```node .```
