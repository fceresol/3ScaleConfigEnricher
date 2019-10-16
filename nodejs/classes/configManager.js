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
        this._defaultClaimName = 'jwt_claim_with_client_id';
        this._defaultClaimType = 'jwt_claim_with_client_id_type';
        this._defaultClaimName_value = '{{aud | first}}';
        this._defaultClaimType_value = 'liquid';;
        this._threeScaleMasterConfigUrl = this._config.threeScaleMasterConfigUrl;
        this._threeScaleAdminServiceUrl = this._config.threeScaleAdminServiceUrl;
        this._threeScaleServiceAuthToken = this._config.threeScaleServiceAuthToken;

    };
    get defaultClaimName() {
        return this._defaultClaimName;
    };
    get defaultClaimType() {
        return this._defaultClaimType;
    };
    get defaultClaimName_value() {
        return this._defaultClaimName_value;
    };
    get defaultClaimType_value() {
        return this._defaultClaimType_value;
    };
    get threeScaleMasterConfigUrl() {
        return this._threeScaleMasterConfigUrl;
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
    parseOIDCDefaults(config, environment) {
        this._defaultOIDCClaimName = undefined;
        this._defaultOIDCClaimType = undefined;
        let serviceConfig = config.serviceConfigs.find(x => x.name === environment);
        if (serviceConfig && serviceConfig.defaults) {
            this._defaultOIDCClaimName = serviceConfig.defaults.claimName;
            this._defaultOIDCClaimType = serviceConfig.defaults.claimType;
        }
    }

    extractServiceConfigFromJson(config, environment) {
        let serviceConfigs = config.serviceConfigs.find(x => x.name === environment)
        let serviceConfig = serviceConfigs != undefined ? serviceConfigs.services : null;
        return serviceConfig;
    }


    getServiceConfig(service_id, tenant_id, environment) {

        let serviceConfig = this.extractServiceConfigFromJson(this._config, environment);
        this.parseOIDCDefaults(this._config, environment);
        let ret = new ServiceConfig(this);

        if (serviceConfig == undefined && (this._defaultOIDCClaimName != undefined && this._defaultOIDCClaimType != undefined)) {
            this.logger.warn('no services configured for', environment, 'using defaults');
            ret.jwt_claim_name_value = this._defaultOIDCClaimName;
            ret.jwt_claim_type_value = this._defaultOIDCClaimType;
        }
        else if (serviceConfig == undefined) {
            this.logger.warn('no services configured for', environment, '!');
            ret = null;
        }
        else {

            ret.jwt_claim_name_value = this._defaultOIDCClaimName;
            ret.jwt_claim_type_value = this._defaultOIDCClaimType;
            Array.prototype.forEach.call(serviceConfig, service => {
                if (service_id == service.id && (tenant_id == service.tenant_id || service.tenant_id == undefined)) {
                    this.logger.info("config for service " + service.id + " found... adding new parameters");
                    ret.jwt_claim_name_value = service.token;
                    ret.jwt_claim_type_value = service.type;

                }
            })

        };
        if (ret.jwt_claim_name_value == undefined || ret.jwt_claim_type_value == undefined ) 
        {
            ret = null;
        }
        return ret;
    }
}

class ServiceConfig {
    constructor(config) {


        this.config = config;
        this._jwt_claim_name = config.defaultClaimName;
        this._jwt_claim_type = config.defaultClaimType;
        this._jwt_claim_name_value = config.defaultOIDCClaimName;
        this._jwt_claim_type_value = config.defaultOIDCClaimType;
    }
    set jwt_claim_name(claimName) {
        this._jwt_claim_name = claimName || config.defaultClaimName;
    }
    get jwt_claim_name() {
        return this._jwt_claim_name;
    }
    set jwt_claim_type(claimType) {
        this._jwt_claim_type = claimType || config.defaultClaimType;
    }
    get jwt_claim_type() {
        return this._jwt_claim_type;
    }
    set jwt_claim_name_value(claimName_value) {
        this._jwt_claim_name_value = claimName_value || config.defaultClaimName_value;
    }
    get jwt_claim_name_value() {
        return this._jwt_claim_name_value;
    }
    set jwt_claim_type_value(claimType_value) {
        this._jwt_claim_type_value = claimType_value || config.defaultClaimType_value;
    }
    get jwt_claim_type_value() {
        return this._jwt_claim_type_value;
    }
}

module.exports = { ServiceConfig, ConfigManager };