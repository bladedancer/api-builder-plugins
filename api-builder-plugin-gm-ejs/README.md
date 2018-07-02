# api-builder-plugin-gm-ejs

## About

This module installs the [EJS](http://ejs.co/) flow-node to be used within [Axway API Builder's](https://www.axway.com/en/datasheet/axway-api-builder)
flow editor.

The EJS flow-node allows the evaluation of [EJS](http://ejs.co/) templates using values from the flow.

### Format string
The _Format string_ method evaluates the template given with the data supplied. This allows complex values to be constructed from values that exist in the flow's context.

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| data | object | y | The data to evaluate the template with. Use $ to access the entire context. |
| template | string | y | The template being evaluated. |

### Format object
The _Format object_ method is similar to the _Format string_ method. It evaluates the template given with the data supplied. However the resulting string value is then JSON parsed. This allows the creation of JavaScript values and objects from the evaluated template.

| Param | Type | Required | Description |
| --- | --- | --- | --- |
| data | object | y | The data to evaluate the template with. Use $ to access the entire context. |
| template | string | y | The doT template being evaluated. |

### EJS Templates
For details on the EJS templates see http://ejs.co/.


#### Example
In the examples the Flow is going to be attached to an API that has three parameters, firstname, lastname and gender.

##### Basic interpolation <%= %>
The template can be used to quickly concatenate values.

| | |
| - | - |
| Request | <http://localhost:8080/api/example?firstname=Clark&lastname=Kent&gender=m> |
| _data_ | $.params |
| _template_ | <%=firstname%> <%=lastname%> |
| Output | Clark Kent |


##### Conditionals <% condition %>
The template evaluation is plain javascript so you can have any conditional you like here. For this example it is a ternary operator. 

| | |
| - | - |
| Request | <http://localhost:8080/api/example?firstname=Clark&lastname=Kent&male=true> |
| _data_ | $ |
| _template_ | Hello <%= male ? 'Mr' : 'Ms'%> <%=surname%> |
| Output | Hello Mr Kent |

| | |
| - | - |
| Request | <http://localhost:8080/api/example?firstname=Lois&lastname=Lane> |
| _data_ | $.params |
| _template_ | Hello <%= male ? 'Mr' : 'Ms'%> <%=surname%> |
| Output | Hello Ms Lane |


##### Array Iteration <%= array funcs. %>
Again as the template is javascript you can iterate over the array however you like.


| | |
| - | - |
| Request | <http://localhost:8080/api/example?names=Tom,Dick,Harry> |
| _data_ | $.params |
| _template_ | <%=names.join(' ');%> |
| Output | Tom Dick Harry  |


## Getting started

1.  Go to [platform.axway.com](https://platform.axway.com) and create an account
1.  Install [API Builder](https://docs.axway.com/bundle/API_Builder_allOS_en/page/api_builder.html)
1.  Follow the [Getting Started Guide](https://docs.axway.com/bundle/API_Builder_allOS_en/page/api_builder_getting_started_guide.html)

## Install

After creating your API Builder project (`appc new -t arrow`), you can install this flow-node handler
using npm:

```
npm install --save api-builder-plugin-gm-ejs
```

The "EJS" flow-node will then be available in the tools panel when creating or editing Flows.
