# api-builder-plugin-gm-hash

## About

This module installs the Hash flow-node to be used within [Axway API Builder's](https://www.axway.com/en/datasheet/axway-api-builder)
flow editor.

The Hash flow-node allows the hashing of strings from within the flow.

### md5
The _md5_ method calculatest the MD5 hash of the input string.

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| plaintext | string | y | The plain text to generate the hash for. |


## Getting started

1.  Go to [platform.axway.com](https://platform.axway.com) and create an account
1.  Install [API Builder](https://docs.axway.com/bundle/API_Builder_allOS_en/page/api_builder.html)
1.  Follow the [Getting Started Guide](https://docs.axway.com/bundle/API_Builder_allOS_en/page/api_builder_getting_started_guide.html)

## Install

After creating your API Builder project (`npx @axway/api-builder init project`), you can install this flow-node handler using npm:

```
npm install api-builder-plugin-gm-hash
```

The "Hash" flow-node will then be available in the tools panel when creating or editing Flows.
