'use strict';

var isString = require('wsk-utils/var/is/string');
var urlData = require('wsk-utils/uri/add-query');
var noop = require('wsk-utils/var/noop');

var querystring = require('querystring');
var url = require('url');
var http = require('http');
var https = require('https');
var zlib = require('zlib');

module.exports = function(url, callback, request_data, type, opts) {
    callback = callback || noop;

    var config = {
        url: url,
        method: type,
        timeout: ~~(opts && opts.timeout)
    };

    var request = function() {
        send(config, function(data, error, code) {
            if (error) {
                callback(data, code || -1, error + '', false, request);
            } else {
                callback(data);
            }
        }, request_data);
    };
    request();
};

function send(config, complete, data) {

    if (data) {
        if (config.method === 'GET') {
            config.url = urlData(data, config.url);
            data = '';

        } else if (!isString(data)) {
            data = querystring.stringify(data) || '';
        }
    }

    var opts = config;
    if (opts.url) {
        opts = Object.assign(url.parse(opts.url), config);
        delete opts.url;
    }

    if (opts.method === 'POST' && data) {
        opts.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        };
    }

    var module = http;
    if (opts.protocol === 'https:') {
        module = https;
    }
    delete opts.protocol;

    var gzip;
    var req = module.request(opts, function(res) {
        var output = res;
        if (res.headers['content-encoding'] === 'gzip') {
            output = zlib.createGunzip();
            res.pipe(output);
        }
        
        output.setEncoding('utf8');

        var body = '', json;
        output.on('data', function(chunk) {
            body += chunk;
        });
        output.on('end', function() {
            if (res.statusCode !== 200 && res.statusCode !== 302) {
                return complete(false, 'http code: ' + res.statusCode, res.statusCode);
            }
            try {
                json = JSON.parse(body);
            } catch(err) {
                return complete(false, err);
            }
            complete(json);
        });

    }).on('error', function(err) {
        complete(false, err);
    });

    if (opts.method === 'POST' && data) {
        req.write(data);
    }

    req.end();
};
