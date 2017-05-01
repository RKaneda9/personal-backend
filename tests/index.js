let https = require('https'),
    http  = require('http');

function get(url) {
    return new Promise((resolve, reject) => {
        (url.includes("https://") ? https : http).get(url, res => {

            let body = '';

            res.on('data', chunk => body += chunk);
            res.on('end', () => { resolve(body); });

        }).on('error', e => {
            //throw e;
            reject(e, {
                message: "Error in http request.",
                url:     url
            });
        });
    });
}

// function send(method, url, cb) {
//     var xhr, now, diff;

//     now = new Date();
//     xhr = new XMLHttpRequest();
//     xhr.open(method.toUpperCase(), url, true);
//     xhr.setRequestHeader("Accept", "*/*");

//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === 4) {

//             if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {

//                 diff = new Date() - now;
//                 cb(diff);
//             }
//             else { cb(-1); }
//         }
//     };
     
//     xhr.send(null);
// }

function send (method, url, callback) {
    var now = new Date();

    get(url)
        .then(() => { callback(new Date() - now); })
        .catch((e, params) => { callback(-1); });
}

function test (method, url, length, parallel) {
    var requests = [], func, received = 0;

    func = function (diff) {

        if (diff >= 0) {
            requests.push(diff);
        }

        if (++received >= length) {
            var avg = 0;

            requests.forEach(function (v) { avg += v; });

            avg /= requests.length;

            console.log(requests.length + " requests took an average of " + avg + " ms");
        }
        else if (!parallel) { send(method, url, func); }
    }

    if (parallel) {
        for (var i = 0; i < length; i++) {
            send(method, url, func);
        }
    }
    else { send(method,url, func); }
}

test("GET", "http://localhost:3000/ping", 500, true);