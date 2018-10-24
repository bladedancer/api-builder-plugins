# api-builder-plugin-gm-gmailutils

## About

This module installs the Gmail Utils flow-node to be used within [Axway API Builder's](https://www.axway.com/en/datasheet/axway-api-builder)
flow editor.

The Gmail Utils  flow-node provides methods to assist in message creation when interacting with the Gmail API.

### formatMessage
The _formatMessage_ method creates a body that can be consumed by `gmail.users.messages.send`.

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| to | string | n | The to recipient. |
| cc | string | n | The cc recipient. |
| bcc | string | n | The bcc recipient. |
| subject | string | n | The message subject. |
| body | string | n | The message body. |


## Install

After creating your API Builder project (`npx @axway/api-builder init project`), you can install this flow-node handler using npm:

```
npm install api-builder-plugin-gm-gmailutils
```

The "Gmail Utils" flow-node will then be available in the tools panel when creating or editing Flows.
