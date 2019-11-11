[1mdiff --git a/routes/index.js b/routes/index.js[m
[1mindex e69de29..1929996 100644[m
[1m--- a/routes/index.js[m
[1m+++ b/routes/index.js[m
[36m@@ -0,0 +1,27 @@[m
[32m+[m[32m// Import router package[m
[32m+[m
[32m+[m[32mconst router = require('express').Router();[m
[32m+[m
[32m+[m[32m/* Hand get requests for '/'[m
[32m+[m
[32m+[m[32m/* this is the index or home page[m
[32m+[m
[32m+[m[32m*/[m
[32m+[m
[32m+[m[32mrouter.get('/', function (req, res) {[m
[32m+[m
[32m+[m[32m// set content type of response body in the headers[m
[32m+[m
[32m+[m[32mres.setHeader('Content-Type', 'application/json');[m
[32m+[m
[32m+[m[32m// Send a JSON response - this app will be a web api so no need to send HTML[m
[32m+[m
[32m+[m[32m//res.end(JSON.stringify({message: 'This is the home page'}));[m
[32m+[m
[32m+[m[32mres.json({content: 'This is the default route.'});[m
[32m+[m
[32m+[m[32m});[m
[32m+[m
[32m+[m[32m// export[m
[32m+[m
[32m+[m[32mmodule.exports = router;[m
\ No newline at end of file[m
