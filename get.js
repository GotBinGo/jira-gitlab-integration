var http = require('http');

var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
};

function startup() {
    return new Promise(function (resolve, reject) {
        var opts = {
            method: 'GET',
            host: 'gitlab.ads.sagem.hu',
            path: '/bordakt?limit=20&offset=0',
            headers: { 
                'Cookie': '_gitlab_session='+ require('./sess.js'),
                'Accept': 'application/json',
                'x-requested-with': "XMLHttpRequest",
            }
        };
        var results = '';    
        var req = http.request(opts, function(res) {
            res.on('data', function (chunk) {
                results = results + chunk;
            }); 
            res.on('end', function () {
                try {
                    if(results.length < 30) {
                        console.log('Invalid sessionID')
                        console.log('Invalid sessionID')
                        console.log('Invalid sessionID')
                        console.log('Invalid sessionID')
                    } else {
                        console.log('Login seems ok')
                    }
                    resolve()
                    // resolve(rows);
                } catch (e) {
                    reject('parse error')
                }
            }); 
        });    
        req.on('error', function(e) {
            console.log(e)
            reject('request error');
        });    
        req.end();
    });
}

function scrape(date) {
    return new Promise(function (resolve, reject) {
        var opts = {
            method: 'GET',
            host: 'gitlab.ads.sagem.hu',
            path: '/users/bordakt/calendar_activities?date=' + date,
            headers: { 'Cookie': '_gitlab_session='+ require('./sess.js')}
        };
        var results = '';    
        var req = http.request(opts, function(res) {
            res.on('data', function (chunk) {
                results = results + chunk;
            }); 
            res.on('end', function () {
                try {
                    if(results.split('<ul').length == 1) {
                        resolve([[0,0,'Empty']]);
                    }
                    console.log(results.split('<ul').length)
                    const table = results.split('<ul')[1].split('/ul')[0];
                    rows = table.split('<li').map(x => x.split('strong').map(x => x.split('\n').join('')).filter((x, i) => [0, 1, 3].includes(i)))
                    rows.shift()
                    rows = rows.map(x => {
                        return x.map((x, i) => {
                            if (i == 0) 
                                return x.split('>')[5].split('<')[0]
                            if (i == 1) 
                                return x.split('</')[0].split('>')[x.split('</')[0].split('>').length-1]
                            if (i == 2) 
                                return x.split('title="')[1].split('"')[0]
                        });
                    });
                    resolve(rows);
                } catch (e) {
                    reject('parse error')
                }
            }); 
        });    
        req.on('error', function(e) {
            console.log(e)
            reject('request error');
        });    
        req.end();
    })

}
async function main() {
    scrape().then(x => {
        // console.log(JSON.stringify(x));
        console.log(groupBy(x, '2'));
    }).catch(x => {
        console.log(x);
    }) ;
}

// main();


const port = 3000

const requestHandler = (request, response) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000, // 30 days
        /** add other headers as per requirement */
    };
    month = 99
    year = 99
    day = 99
    response.writeHead(200, headers);
    try {
    date = request.url.split('=')[1];
    day = date.split('/')[0];
    month = date.split('/')[1];
    year = date.split('/')[2].split('&')[0];
    } catch {
        response.end();
    }
    if(month == 'Jun') {
        month = 6
    }
    if(month == 'Jul') {
        month = 7
    }
    if(month == 'Aug') {
        month = 8
    }
    console.log(year+'-'+month + '-' + day)
    scrape(year+'-'+month + '-' + day).then(x => {
        var groups = groupBy(x, '2')
        var keys = Object.keys(groups)
        var vals = keys.map(x => groups[x])
        response.end(JSON.stringify({keys, vals}))
    }).catch(x => {
        console.log(x);
    }) ;
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

startup();
