'use strict';
let LogManager = require('../classes/LogManager')
let Logger = LogManager.Logger;
let logger = new Logger().getLogger();
function enrichMasterJsonConfig(masterConfig, config, environment) {
    let output = masterConfig;

    Array.prototype.forEach.call(masterConfig.proxy_configs, proxy_conf => {
        let proxy_config = proxy_conf.proxy_config;
        logger.info("proxy_conf ID: ", proxy_config.id);
        logger.info("proxy_conf version: ", proxy_config.version);
        logger.info("proxy_conf environment: ", proxy_config.environment);
        logger.info("processing content...");

        let proxy = proxy_config.content.proxy;
        if (proxy.authentication_method != "oidc") {
            logger.warn("the service authentication method is", proxy.authentication_method, "skipping");
        }
        else {
            let enricherConfig = config.getServiceConfig(proxy.service_id, proxy.tenant_id, environment)
            if (enricherConfig != undefined) {
                logger.info("config for service " + proxy.service_id + " found... adding new parameters");
                logger.error  (enricherConfig.jwt_claim_name, " = ", enricherConfig.jwt_claim_name_value);
                logger.error  (enricherConfig.jwt_claim_type, " = ", enricherConfig.jwt_claim_type_value);

                proxy[enricherConfig.jwt_claim_name] = enricherConfig.jwt_claim_name_value;
                proxy[enricherConfig.jwt_claim_type] = enricherConfig.jwt_claim_type_value;

            };
        };
    });

    return output;
}

function enrichServiceJsonConfig(jsonConfig, serviceConfig) {
    let output = jsonConfig;
    Array.prototype.forEach.call(serviceConfig, service => {
        let proxyConf = output.services.find(x => x.id === service.id);
        logger.info("processing service with ID: " + service.id);
        logger.info("proxyConf --> " + proxyConf);
        if (proxyConf == undefined) {
            logger.warn("configuration for service with ID " + service.id + " not found... maybe a misconfiguration?");
        }
        else {
            logger.info("config for service " + service.id + " found... adding new parameters");
            proxyConf[jsonClaimName] = service.token;
            proxyConf[jsonClaimType] = service.type;
            // output.find(x => x.id === service.id).proxy = proxyConf;
        }
    });

    return output;
}


module.exports = { enrichMasterJsonConfig };