# Req
![](https://travis-ci.com/IamCathal/Req.svg?token=NxDPAobZPqQisyLUpivy&branch=master)
#### How to get started working on this repo

1. Open Github desktop, sign in if necessary
2. Click file > clone repository, click this repo if it's there (it should be)
3. This will clone the current repo on github into a folder on your computer
4. In the repo directory run `npm install http-errors express cookie-parser morgan debug`, then `npm install hbs` then `npm audit fix`
4. Get working on your own version. Push it to either danu or localhost to test out stuff (port is 8673 by default)
5. Once you're happy with your changes you can make a commit, add a nice descriptive message and push  to origin.

#### How to use Swagger for documentation
1. Docs are hosted at `localhost/docs`
2. Docs are stored in the `swagger.json` file in the root directory
3. To edit docs:
    1. Go to `https://editor.swagger.io`
    2. Select `file -> import file` and select `swagger.json` file from root directory
    3. Add new API(s) using YAML. Documentation for swagger can be found here: `https://swagger.io/docs/specification/basic-structure/`
    4. When finished select `file -> convert and save as json` and overwrite old swagger.json file

#### Registration flowchart
![yes](https://i.imgur.com/KazYBEd.png)
