'use strict';
// 3scale Configuration Enricher Proxy
//4ead17e192709148fcb8b0e614b58ea00ac38c909d0c127ea15700f5919e73f7
// read the env containing the config file
var logger = require('logger').createLogger();
var configFile = process.env.ENRICHER_CONFIG_FILE || '/enricher/config/config.json';
var environment = process.env.ENVIRONMENT || 'staging';
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

var cm = require('./classes/configManager');
let ConfigManager = cm.ConfigManager;
let ServiceConfig = cm.ServiceConfig;

let lm = require('./classes/LogManager');
let LogManager = lm.LogManager;


const util = require('util');
const http = require('request');
Object.assign = require('object-assign');

// initialize express runtime
var express = require('express'),
    app = express(),
    morgan = require('morgan');
app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))
// populate configs

let config = new ConfigManager(configFile, environment);

logger.info('3Scale admin config url:' + config.threeScaleAdminServiceUrl);


function call3Scale(threeScaleUrl, res, callback) {

    http(threeScaleUrl, { json: true }, (threeScaleErr, threeScaleRes, threeScaleBody) => {
        logger.info('called ' + threeScaleUrl + "...");
        if (threeScaleErr) {
            res.statusCode = 500;
            res.send(threeScaleErr);

            logger.info(threeScaleErr);
            return
        }

        logger.info(threeScaleRes.body);
;
        callback(threeScaleRes.body)
    });

}

app.get('/*', function (req, res) {

    let threeScaleConfig;
    
    //received a new call 
    //proxy it
    http(threeScaleConfigURL + req.originalUrl, { json: true }, (err, res, body) => {
        if (err) { return logger.info(err); }
        threeScaleConfig = body;


    });
    logger.info('retrieved configuration from 3scale....');
    logger.info(util.inspect(threeScaleConfig, { depth: null }));

    res.body = threeScaleConfig;
    res.statusCode = 200;
});


// error handling
app.use(function (err, req, res, next) {
    logger.error(err.stack);
    res.status(500).send('Something bad happened!');
});


app.listen(config.port, config.ip);
logger.info('Server running on http://%s:%s', config.ip, config.port);

module.exports = app;





