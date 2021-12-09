'use strict';
let LogManager = require('./LogManager');
let Logger = LogManager.Logger;
class ConfigManager {

    constructor(configFilePath, environment) {
        this.logger = new Logger().getLogger();
        this._port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
        this._ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
        this.logger.info('reading config');
        this._config = require(configFilePath);
        this.logger.info('config file read success!');
        this.logger.info(this._config);
        this._threeScaleAdminServiceUrl = this._config.threeScaleAdminServiceUrl;
        this._threeScaleServiceAuthToken = this._config.threeScaleServiceAuthToken;

    };
    get threeScaleAdminServiceUrl() {
        return this._threeScaleAdminServiceUrl;
    };
    get threeScaleServiceAuthToken() {
        return this._threeScaleServiceAuthToken;
    };
    /*get environment()
    {
        return this._environment;
     };*/
    get port() {
        return this._port;
    }
    get ip() {
        return this._ip;
    }
}

module.exports = {  ConfigManager };