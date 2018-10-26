# api-builder-plugin-gm-code

The Code plugin allows you to execute Javascript code inside a Flow. 

> Note the function has access to global scope and so you should never execute a function received from an untrusted source.

Once installed the Code flow node will show up in the "Extensions" section of the Flow Editor tool panel.

![Tool Panel](./imgs/toolpanel.png)

### Exectute
The _Execute_ method executes the specified function. As the Flow Node spec cannot define dynamic inputs the node instead makes use of ES6 destructuring.

![Config Panel](./imgs/configpanel.png)

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| function | string | y | The function to execute. When called it will receive `inputs` as the only arguments. Using destructuring makes this easier to consume. |
| inputs | object | y | The parameters to pass to the function when executing. |

The node has two outputs, `next` and `error`. The `error` output is triggered if the function throws an exception, otherwise the `next` output is triggered with the return value of the function.

![Flow](./imgs/flow.png)

## Install

After creating your API Builder service, you can install this plugin using npm:

```
npm install --save @bladedancer/api-builder-plugin-gm-code
```
