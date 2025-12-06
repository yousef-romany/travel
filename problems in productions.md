1- avalabilty not found in front-end okey 
2- program avalabilty has error when add one (Validation error: Invalid status)


3- improve /program/[title] okey not good 

4- we have error in /me page "[2025-12-05 16:40:09.298] http: GET /api/bookings?populate[program][populate]=images&populate[plan_trip][populate]=destinations&populate[event][populate]=images&populate[user]=*&sort[0]=createdAt:desc&filters[user][documentId][$eq]=c34t9o7uj5lsr9w2j04yn1qn (4 ms) 400
[2025-12-05 16:40:10.318] http: GET /api/bookings?populate[program][populate]=images&populate[plan_trip][populate]=destinations&populate[event][populate]=images&populate[user]=*&sort[0]=createdAt:desc&filters[user][documentId][$eq]=c34t9o7uj5lsr9w2j04yn1qn (10 ms) 400
[2025-12-05 16:40:12.338] http: GET /api/bookings?populate[program][populate]=images&populate[plan_trip][populate]=destinations&populate[event][populate]=images&populate[user]=*&sort[0]=createdAt:desc&filters[user][documentId][$eq]=c34t9o7uj5lsr9w2j04yn1qn (8 ms) 400
[2025-12-05 16:40:16.354] http: GET /api/bookings?populate[program][populate]=images&populate[plan_trip][populate]=destinations&populate[event][populate]=images&populate[user]=*&sort[0]=createdAt:desc&filters[user][documentId][$eq]=c34t9o7uj5lsr9w2j04yn1qn (9 ms) 400"
when loading booking tab
5- not work good "Recently Viewed"
6- understanding "Gift Cards" and not found in /me page why ?
7- exclusive deals button not work
8- /programs when click for program redirection is wrong okey 
9- why in home page and program page return one programs ?
10- No Programs to Compare Start adding programs to comparison to see them side by side here ?



-----------------

1- when click explore the program in home page using title redirect to /programs/[title] but the logic want document id like /programs page direction
2- days not used in the app please at /programs/[title] and in program card
3- overview in preview not preform the html tag please handle this errors
4- when go to "/programs/2%2520Abu%2520Simbel%2520Private%2520Day%2520Trip%2520from%2520Aswan/book" that redirct to /me page 
5- booking tab in /me page not work solve it the message is "{
    "data": null,
    "error": {
        "status": 400,
        "name": "ValidationError",
        "message": "Invalid key destinations at plan_trip.populate.destinations",
        "details": {
            "key": "destinations",
            "path": "plan_trip.populate.destinations",
            "source": "query",
            "param": "populate"
        }
    }
}" when call back-end
6- the path of project back-end strapi  v5 "/home/yousefx00/Documents/Programing Projects/ZoeHolidays/travel-backend"
7- solve this aslo please "bun start
$ next start
   ▲ Next.js 15.1.6
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.29:3000

 ✓ Starting...
 ✓ Ready in 288ms
Error fetching program by title or ID: Error [AxiosError]: Request failed with status code 404
    at eO (.next/server/chunks/5859.js:1:47998)
    at IncomingMessage.<anonymous> (.next/server/chunks/5859.js:3:9448)
    at aN.request (.next/server/chunks/5859.js:3:21242)
    at async o (.next/server/app/(app)/programs/[title]/page.js:6:2483)
    at async Module.d (.next/server/app/(app)/programs/[title]/page.js:6:2816) {
  code: 'ERR_BAD_REQUEST',
  config: [Object],
  request: [ClientRequest],
  response: [Object],
  status: 404,
  constructor: [Function],
  toJSON: [Function: toJSON]
}
Error generating metadata: Error [AxiosError]: Request failed with status code 404
    at eO (.next/server/chunks/5859.js:1:47998)
    at IncomingMessage.<anonymous> (.next/server/chunks/5859.js:3:9448)
    at aN.request (.next/server/chunks/5859.js:3:21242)
    at async o (.next/server/app/(app)/programs/[title]/page.js:6:2483)
    at async Module.d (.next/server/app/(app)/programs/[title]/page.js:6:2816) {
  code: 'ERR_BAD_REQUEST',
  config: [Object],
  request: [ClientRequest],
  response: [Object],
  status: 404,
  constructor: [Function],
  toJSON: [Function: toJSON]
}
Error fetching program by title or ID: Error [AxiosError]: Request failed with status code 404
    at eO (.next/server/chunks/5859.js:1:47998)
    at IncomingMessage.<anonymous> (.next/server/chunks/5859.js:3:9448)
    at aN.request (.next/server/chunks/5859.js:3:21242)
    at async o (.next/server/app/(app)/programs/[title]/page.js:6:2483)
    at async Module.d (.next/server/app/(app)/programs/[title]/page.js:6:2816) {
  code: 'ERR_BAD_REQUEST',
  config: [Object],
  request: [ClientRequest],
  response: [Object],
  status: 404,
  constructor: [Function],
  toJSON: [Function: toJSON]
}
Error generating metadata: Error [AxiosError]: Request failed with status code 404
    at eO (.next/server/chunks/5859.js:1:47998)
    at IncomingMessage.<anonymous> (.next/server/chunks/5859.js:3:9448)
    at aN.request (.next/server/chunks/5859.js:3:21242)
    at async o (.next/server/app/(app)/programs/[title]/page.js:6:2483)
    at async Module.d (.next/server/app/(app)/programs/[title]/page.js:6:2816) {
  code: 'ERR_BAD_REQUEST',
  config: [Object],
  request: [ClientRequest],
  response: [Object],
  status: 404,
  constructor: [Function],
  toJSON: [Function: toJSON]
}"
8- compare page have a problem please handle it and at home page when select 2 program or more than 2 redirect to compare page and apppear "No Programs to Compare
Start adding programs to comparison to see them side by side here."
9- why you create dashboard page you have /me page and add real data 