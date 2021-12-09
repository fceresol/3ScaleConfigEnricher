# 3ScaleConfigEnricher

Simple NodeJS proxy for proxying / 3Scale Configurations.

## Setup

- create the required openshift objects (samples for everything are provided in openshift_samples folder)
- deploy on openshift
- change the enricher-config configmap
- change the APIcast THREESCALE_PORTAL_ENDPOINT environment variable in order to point to 3ScaleConfigEnricher service in format http://mytoken@enricher-proxy:8080 (there's a small workaround to be applied in order to avoid errors on APIcast gateway: a token must be provided even if not used by the Proxy) _Note: the original env using the secret must be removed and replaced by an hardcoded one_

## Configuration

the configuration is stored in a json file inside a config map, the file is structured as follows

```json
{
    "threeScaleAdminServiceUrl": "https://3scale-admin.3scale.apps.myopenshift.local",
    "threeScaleServiceAuthToken": "abcdefghi12334560643738759128759",
   
}

```

- **threeScaleAdminServiceUrl** is the 3Scale tenant instance administration url, currently is not used.
- **threeScaleServiceAuthToken** token for authentication on the administration server, currently not used.

## Uninstall

In order to remove the proxy enricher from 3Scale:
- change the THREESCALE_PORTAL_ENDPOINT back to its original value
- remove the openshift objects labeled with app:nodejs-enricher
