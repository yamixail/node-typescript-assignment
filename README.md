# Readme

App requirements
- Node 8.9.3
- NPM 5.5.1

To install dependencies just run
```sh
$ npm install
```

## Run
After dependency installation you able to run application:
```sh
$ npm start
```
This command start two independent processes `app`(express application) and `scraper`(scrapes data from [TVMaze](http://www.tvmaze.com/api)) using tool [PM2](https://github.com/Unitech/pm2).

## Development
If you need to investigate something you can use command:
```sh
npm run dev
```
This command run [nodemon](https://github.com/remy/nodemon) with config `nodemon.json` in root directory.
