/* Copyright 2013 PayPal */
"use strict";

var http = require('http');
var https = require('https');
var querystring = require('querystring');
var uuid = require('node-uuid');

module.exports = function () {

    var sdk_version = '0.6.4';
    var user_agent = 'PayPalSDK/rest-sdk-nodejs ' + sdk_version + ' (node ' + process.version + '-' + process.arch + '-' + process.platform  + ')';
    var default_options = {
        'schema': 'https',
        'host': 'api.sandbox.paypal.com',
        'port': '',
        'openid_connect_schema': 'https',
        'openid_connect_host': 'api.paypal.com',
        'openid_connect_port': '',
        'authorize_url': 'https://www.paypal.com/webapps/auth/protocol/openidconnect/v1/authorize',
        'logout_url': 'https://www.paypal.com/webapps/auth/protocol/openidconnect/v1/endsession',
        'headers': {}
    };

    /* Merge Two Objects */

    function merge(obj1, obj2) {
        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor === Object) {
                    obj1[p] = merge(obj1[p], obj2[p]);

                } else {
                    obj1[p] = obj2[p];
                }
            } catch (e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    }

    function copy_missing(obj1, obj2) {
        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if (obj2[p].constructor === Object) {
                    if (!obj1[p]) {
                        obj1[p] = {};
                    }

                } else if (!obj1[p]) {
                    obj1[p] = obj2[p];

                }
            } catch (e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];
            }
        }
        return obj1;
    }

    function configure(options) {
        default_options = merge(default_options, options);
    }

    function generate_token(config, cb) {

        if (typeof config === "function") {
            cb = config;
            config = default_options;
        } else if (!config) {
            config = default_options;
        }

        var basicAuthString = 'Basic ' + new Buffer(config.client_id + ':' + config.client_secret).toString('base64');

        var http_options = {
            schema: config.schema || default_options.schema,
            host: config.host || default_options.host,
            port: config.port || default_options.port,
            headers: {
                'Authorization': basicAuthString,
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        invoke('POST', '/v1/oauth2/token', 'grant_type=client_credentials', http_options, function (err, res) {
            var token = null;
            if (res) {
                token = res.token_type + ' ' + res.access_token;
            }
            cb(err, token);
        });

    }

    function update_token(http_options, error_callback, callback) {
        generate_token(http_options, function (error, token) {
            if (error) {
                error_callback(error, token);
            } else {
                http_options.headers.Authorization = token;
                callback();
            }
        });
    }


    function executeHttp(http_method, path, data, http_options, cb) {
        if (typeof http_options === "function") {
            cb = http_options;
            http_options = null;
        }
        if (!http_options) {
            http_options = default_options;
        } else {
            http_options = copy_missing(http_options, default_options);
        }

        function retry_invoke() {
            invoke(http_method, path, data, http_options, cb);
        }

        if (http_options.headers.Authorization) {
            invoke(http_method, path, data, http_options, function (error, response) {
                if (error && error.httpStatusCode === 401 && http_options.client_id && http_options.headers.Authorization) {
                    http_options.headers.Authorization = null;
                    update_token(http_options, cb, retry_invoke);
                } else {
                    cb(error, response);
                }
            });
        } else {
            update_token(http_options, cb, retry_invoke);
        }
    }

    function invoke(http_method, path, data, http_options_param, cb) {
        var client = (http_options_param['schema'] === 'http') ? http : https;

        var request_data = data;

        if ( http_method === 'GET' ) {
            if (typeof request_data !== 'string') {
                request_data = querystring.stringify(request_data);
            }
            if (request_data) {
                path = path + "?" + request_data;
                request_data = "";
            }
        } else if (typeof request_data !== 'string') {
            request_data = JSON.stringify(request_data);
        }

        var http_options = {};

        if (http_options_param) {

            http_options = JSON.parse(JSON.stringify(http_options_param));

            if (!http_options.headers) {
                http_options.headers = {};
            }
            http_options.path = path;
            http_options.method = http_method;
            if (request_data) {
                http_options.headers['Content-Length'] = Buffer.byteLength(request_data, 'utf-8');
            }

            if (!http_options.headers.Accept) {
                http_options.headers.Accept = 'application/json';
            }

            if (!http_options.headers['Content-Type']) {
                http_options.headers['Content-Type'] = 'application/json';
            }

            if (http_method === 'POST' && !http_options.headers['PayPal-Request-Id']) {
                http_options.headers['PayPal-Request-Id'] = uuid.v4();
            }

            http_options.headers['User-Agent'] = user_agent;
        }

        var req = client.request(http_options);

        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
            cb(e, null);
        });

        req.on('response', function (res) {
            var response = '';
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                response += chunk;
            });

            res.on('end', function () {
                var err = null;

                response.httpStatusCode = res.statusCode;

                try {

                    if (res.headers['content-type'] === "application/json") {
                        response = JSON.parse(response);
                    }

                } catch (e) {
                    err = new Error('Invalid JSON Response Received');
                    err.error = {
                        name: 'Invalid JSON Response Received, JSON Parse Error'
                    };
                    err.response = response;
                    err.httpStatusCode = res.statusCode;
                    response = null;
                }

                if (!err && (res.statusCode < 200 || res.statusCode >= 300) ) {
                    err = new Error('Response Status : ' + res.statusCode);
                    err.response = response;
                    err.httpStatusCode = res.statusCode;
                    response = null;
                }
                cb(err, response);
            });
        });

        if (request_data) {
            req.write(request_data);
        }
        req.end();
    }

    function openid_connect_request(path, data, config, cb) {

        var http_options = {
            schema: config.openid_connect_schema || default_options.openid_connect_schema,
            host: config.openid_connect_host || default_options.openid_connect_host,
            port: config.openid_connect_port || default_options.openid_connect_port,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        invoke('POST', path, querystring.stringify(data), http_options, cb);
    }

    function get_openid_client_id(config) {
        return config.openid_client_id || config.client_id ||
            default_options.openid_client_id || default_options.client_id;
    }
    function get_openid_client_secret(config) {
        return config.openid_client_secret || config.client_secret ||
            default_options.openid_client_secret || default_options.client_secret;
    }
    function get_openid_redirect_uri(config) {
        return config.openid_redirect_uri || default_options.openid_redirect_uri;
    }

    function authorize_url(data, config) {
        config = config || default_options;
        data   = data || {};

        var url = config.authorize_url || default_options.authorize_url;

        data = merge({
            'client_id': get_openid_client_id(config),
            'scope': 'openid',
            'response_type': 'code',
            'redirect_uri': get_openid_redirect_uri(config) }, data);

        return url + '?' + querystring.stringify(data);
    }

    function logout_url(data, config) {
        config = config || default_options;
        data   = data || {};

        var url = config.logout_url || default_options.logout_url;

        if (typeof data === 'string') {
            data = { 'id_token': data };
        }

        data = merge({
            'logout': 'true',
            'redirect_uri': get_openid_redirect_uri(config) }, data);

        return url + '?' + querystring.stringify(data);
    }

    function tokeninfo_request(data, config, cb) {

        if (typeof config === 'function') {
            cb = config;
            config = default_options;
        } else if (!config) {
            config = default_options;
        }

        data = merge({
            'client_id': get_openid_client_id(config),
            'client_secret': get_openid_client_secret(config) }, data);

        openid_connect_request('/v1/identity/openidconnect/tokenservice', data, config, cb);
    }

    function userinfo_request(data, config, cb) {
        if (typeof config === 'function') {
            cb = config;
            config = default_options;
        } else if (!config) {
            config = default_options;
        }

        if (typeof data === 'string') {
            data = { 'access_token': data };
        }

        data = merge({
            'schema': 'openid',
            'client_id': get_openid_client_id(config) }, data);

        openid_connect_request('/v1/identity/openidconnect/userinfo', data, config, cb);
    }

    return {
        version: sdk_version,
        configure: function (options) {
            configure(options);
        },
        generate_token: function (config, cb) {
            generate_token(config, cb);
        },
        payment: {
            create: function (data, config, cb) {
                executeHttp('POST', '/v1/payments/payment/', data, config, cb);
            },
            get: function (payment_id, config, cb) {
                executeHttp('GET', '/v1/payments/payment/' + payment_id, {}, config, cb);
            },
            list: function (data, config, cb) {
                executeHttp('GET', '/v1/payments/payment', data, config, cb);
            },
            execute: function (payment_id, data, config, cb) {
                executeHttp('POST', '/v1/payments/payment/' + payment_id + '/execute', data, config, cb);
            }
        },
        sale: {
            refund: function (sale_id, data, config, cb) {
                executeHttp('POST', '/v1/payments/sale/' + sale_id + '/refund', data, config, cb);
            },
            get: function (sale_id, config, cb) {
                executeHttp('GET', '/v1/payments/sale/' + sale_id, {}, config, cb);
            }
        },
        refund: {
            get: function (refund_id, config, cb) {
                executeHttp('GET', '/v1/payments/refund/' + refund_id, {}, config, cb);
            }
        },
        authorization: {
            get: function (authorization_id, config, cb) {
                executeHttp('GET', '/v1/payments/authorization/' + authorization_id, {}, config, cb);
            },
            capture: function (authorization_id, data, config, cb) {
                executeHttp('POST', '/v1/payments/authorization/' + authorization_id + '/capture', data, config, cb);
            },
            void: function (authorization_id, config, cb) {
                executeHttp('POST', '/v1/payments/authorization/' + authorization_id + '/void', {}, config, cb);
            },
            reauthorize: function (authorization_id, data, config, cb) {
                executeHttp('POST', '/v1/payments/authorization/' + authorization_id + '/reauthorize', data, config, cb);
            }
        },
        capture: {
            refund: function (capture_id, data, config, cb) {
                executeHttp('POST', '/v1/payments/capture/' + capture_id + '/refund', data, config, cb);
            },
            get: function (capture_id, config, cb) {
                executeHttp('GET', '/v1/payments/capture/' + capture_id, {}, config, cb);
            }
        },
        credit_card: {
            create: function (data, config, cb) {
                executeHttp('POST', '/v1/vault/credit-card/', data, config, cb);
            },
            get: function (credit_card_id, config, cb) {
                executeHttp('GET', '/v1/vault/credit-card/' + credit_card_id, {}, config, cb);
            },
            delete: function (credit_card_id, config, cb) {
                executeHttp('DELETE', '/v1/vault/credit-card/' + credit_card_id, {}, config, cb);
            }
        },
        openid_connect: {
            tokeninfo: {
                create: function (data, config, cb) {
                    if (typeof data === 'string') {
                        data = { 'code': data };
                    }
                    data.grant_type = 'authorization_code';
                    tokeninfo_request(data, config, cb);
                },
                refresh: function (data, config, cb) {
                    if (typeof data === 'string') {
                        data = { 'refresh_token': data };
                    }
                    data.grant_type = 'refresh_token';
                    tokeninfo_request(data, config, cb);
                }
            },
            authorize_url: authorize_url,
            logout_url: logout_url,
            userinfo: {
                get: userinfo_request
            }
        }
    };

};
