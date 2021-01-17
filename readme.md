# Instalation
### Using docker
1. `chmod -x run.sh && sh run.sh`
6. go to `http://localhost:3000/graphql` to test queries  or import `insomnia-workspace,json` into insomnia with prepared queries

### From source
0. install:
    - PostgreSQL
    - Redis
1. `cd api`
2. `yarn install`
3. ensure that postgres and redis are up and running
4. `yarn db:migrate` to create & migrate tables 
5. `yarn start` // starts the js app from dist
    - alternative to run the dev: `yarn run dev-ts`
6. go to `http://localhost:3000/graphql` to test queries
