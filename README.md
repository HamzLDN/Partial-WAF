
# Partial-Protect

Partial Protect aims to heavily focus on detecting threats in real time and defending against it. Aimed to be user friendly for small sites trying to have extra security for free.

<img src="ReadmeImages/Dashboard.png" width="800" />

Front-end was designed using bootstrap studio
## How it works

You will have a dashboard which runs on the localhost. And you can access it on port 278. You will be able to view IP, Request methods, Parameters, Query, and XSS detection. 


## Features

- Search by Keyword
- WhiteList IPS to dashboard
- BlackList IPS to Main Website
- Cross compatible 


## Installation

In your project path, type

```bash
  npm install github:HamzLDN/Partial-Protect
```

Now, on your express project, add the 2 following lines to deploy
```js
  const partial_middleware = require('partial-protect')
  app.use(partial_middleware)
```

Default port should be `278` to acccess on localhost
## Acknowledgements

 - [Bootstrap Studios for front-end](bootstrapstudio.io)
 - [Readme template I've used](https://readme.so/editor)

