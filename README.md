# 3ScaleConfigEnricher

Simple NodeJS proxy for enriching / testing 3Scale Configuration which aren't available to portal.

## Setup

- create the required openshift objects (samples for everything are provided in openshift_samples folder)
- deploy on openshift
- change the enricher-config configmap
- change the APIcast THREESCALE_PORTAL_ENDPOINT environment variable in order to point to 3ScaleConfigEnricher service in format http://mytoken@enricher-proxy:8080 (there's a small workaround to be applied in order to avoid errors on APIcast gateway: a token must be provided even if not used by the Proxy)

## Configuration

the configuration is stored in a json file inside a config map, the file is structured as follows

```json
{
    "threeScaleMasterConfigUrl": "http://abcd1234@system-master:3000",
    "threeScaleAdminServiceUrl": "https://3scale-admin.3scale.apps.myopenshift.local",
    "threeScaleServiceAuthToken": "abcdefghi12334560643738759128759",
    "serviceConfigs": [
        { "name":"production",
            "defaults": {
                "claimName": "{{client}}",
                "claimType": "liquid"
            }
        },
        {"name":"staging",
            "defaults": {
                "claimName": "{{client}}",
                "claimType": "liquid"
            },
            "services": [
                {
                    "id": "100c01",
                    "type": "plain",
                    "token": "azp"
                },
                {
                    "id": "10002",
                    "tenant_id": "10001",
                    "type": "plain",
                    "token": "aud"
                }
            ]
        }
    ]
}

```
- **threeScaleMasterConfigUrl**: is the config url for accessing the real 3Scale (it should be copied from the system-master-apicast secret)
- **threeScaleAdminServiceUrl** is the 3Scale tenant instance administration url, currently is not used.
- **threeScaleServiceAuthToken** token for authentication on the administration server, currently not used.
- **serviceConfigs**: the enricher section, the configuration could be specified in two ways (or a mix of them if necessary). Every service config is being structured as follows:
  - **name**: the environment name (must be one of production or staging)
  - **defaults**: this section contains the defaults for the environment:
    - **claimName**: name or liquid pattern of the claim to be verified
    - **claimType**: defines the notation type of the above name (one of liquid or plain)
    - **services**: array which defines the configurations by service (thakes precedence over defaults)
      - **id**: 3Scale service ID
      - **tenant_id**: (optional) the tenantID of the services
      - **token**: name or liquid pattern of the claim to be verified
      - **type**: defines the notation type of the above name (one of liquid or plain)

## Uninstall

In order to remove the proxy enricher from 3Scale:
- change the THREESCALE_PORTAL_ENDPOINT back to its original value
- remove the openshift objects labeled with app:nodejs-enricher
