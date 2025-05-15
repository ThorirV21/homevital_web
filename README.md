![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
[![Lint](https://github.com/ThorirV21/homevital_web/actions/workflows/main.yml/badge.svg)](https://github.com/ThorirV21/homevital_web/actions/workflows/main.yml)
[![Playwright Tests](https://github.com/ThorirV21/homevital_web/actions/workflows/playwright.yml/badge.svg)](https://github.com/ThorirV21/homevital_web/actions/workflows/playwright.yml)


# HomeVital Harmony - Web application

## Description
This project is part of a final project in computer science at Reykjavík University.
This is the web application part that Heimahjúkrun would use to manage and observe patient vital measurements.

Other parts of this project are the API, and the mobile application for patients.

The teck stack used was mainly choosen because it was known by the group members from other classes.

### Group Members
Aron Ingi Jónsson   |  aronj22@ru.is

Jakub Ingvar Pitak  |   jakub22@ru.is

Sindri Guðmundsson  |   sindrig23@ru.is

Þórir Gunnar Valgeirsson    |   thorirv21@ru.is |   Guarantor for Web application

## Prerequisites
- node ^v22.13.0

## Installation for progress view
1. Fork the repository to your machine

2. Create .env file in the root folder and add the following
``` 
API_URL=[Your-API-URL]

SESSION_SECRET=[Your-random-session-secret]
```

> We have a running API on https://homevitaldev-app.azurewebsites.net/api but there are no guranties that the service is working at all times. 
For stable local setup fork the repository for the API and run it on your local machine.

3. Run 
``` bash
npm install
# and then
npm run dev
```



You should have the web page running on localhost, port 3000

We have a running demo of the project at: https://homevital-web.vercel.app/

Allowed login ssn's are

|                       |                       |
|:---------------------:|:---------------------:|
| 1234123412            | 4321432143            |
| 1234567890            | 1234561234            |
| 6543214321            | 0987654321            |
| 9090909090            | 1010101011            |
| 1111111113            | 1212121213            |
| 1313131314            | 1414141415            |
| 1515151516            | 1616161617            |
| 1717171718            | 1818181819            |
| 1919191920            | 2020202021            |
| 2121212122            | 2222222223            |

If you run into any trouble, please contact us and let us know of the trouble.