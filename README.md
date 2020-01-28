# URL shortener microservice

I created this microservice in fulfillment of [freeCodeCamp](https://freecodecamp.org)'s APIs and Microservices Project [URL Shortener Microservice](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/url-shortener-microservice), using [Node.js](https://nodejs.org/en/), [Express](https://expressjs.com/), [Mongoose](https://mongoosejs.com/), and a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database. The front end API test on the main page also uses [Bootstrap](https://getbootstrap.com/), [jQuery](https://jquery.com/), and [highlight.js](https://highlightjs.org/). The API fulfills the following user stories:

1.  I can POST a URL to `[project_url]/api/shorturl/new` and I will receive a shortened URL in the JSON response.
    - Example: `{"original_url": "www.google.com", "short_url": 1}`
2.  If I pass an invalid URL that doesn't follow the `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{"error": "invalid URL"}`.
    - HINT: to be sure that the submitted url points to a valid site you can use the function `dns.lookup(host, cb)` from the `dns` core module.
3.  When I visit the shortened URL, it will redirect me to my original link.
