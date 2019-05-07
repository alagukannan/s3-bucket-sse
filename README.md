# s3-enable-default-encryption-lambda-app
 Simple AWS Lambda that enables S3 default AES256 encryption whenever a bucket is created or bucket properties are modified, if encryption isn't enabled by deafult.

```bash
.
├── README.md                   <-- This instructions file
├── src                         <-- Source code for a lambda function
│   ├── index.js                <-- Lambda function code
│   ├── package.json            <-- NodeJS dependencies
│   └── tests                   <-- Unit tests
│       └── unit
│           └── test_handler.js
└── template.dev.yaml               <-- SAM DEV template
```

## Requirements

* AWS CLI already configured with at least PowerUser permission
* [NodeJS 8.10+ installed](https://nodejs.org/en/download/)
* [Docker installed](https://www.docker.com/community-edition)

## Make
You can pass in these environment properties to configure the make files.
  * S3_BUCKET_NAME
  * PROFILE - aws profile name
### Commands
  * make sam-init - install node.js dependcies
  * make sam-test - run sam locally and test events
  * make sam-build - build the lambda and its dependcies to .aws-sam folder
  * make sam-clean - clean the lambda and its dependcies
  * make sam-package - clean the lambda and its dependcies
  * make sam-deploy - clean the lambda and its dependcies

## Setup process

### Installing dependencies

In this example we use `npm` but you can use `yarn` if you prefer to manage NodeJS dependencies:

```bash
cd s3-enable-encrypt-app/src
npm run init
cd ../
```

### Local development

To test, run denied-party-check-worker sam app using the template template.dev.yaml and send in an event file as input.
**Important**:  testMode must be set to true in the template.dev.yaml in order to return test data.

```yaml
Environment:
        Variables:
          shutOffFlag: false
          testMode: true
```          

Test the Lamda:

```bash
cd s3-enable-encrypt-app\src
sam local invoke "samAppBase" -e ./tests/sample/s3event.json  -t template.yaml
```

**SAM CLI** is used to emulate Lambda locally and uses our `template.dev.yaml` to understand how to bootstrap this environment (runtime, where the source code is, etc.) - The following excerpt is what the CLI will read in order to initialize the Lambda app:

```yaml
...

  samAppBase:
    Type: 'AWS::Serverless::Function'
    Properties:
      Handler: index.lambda_handler
      ...
```

## Packaging and deployment

AWS Lambda NodeJS runtime requires a flat folder with all dependencies including the application. SAM will use `CodeUri` property to know where to look up for both application and dependencies:

```yaml
...
  samAppBase:
    Type: 'AWS::Serverless::Function'
    Properties:
      Handler: index.lambda_handler
      Runtime: nodejs8.10
      CodeUri: .
            ...
```

Firstly, we need a `S3 bucket` where we can upload our Lambda functions packaged as ZIP before we deploy anything - If you don't have a S3 bucket to store code artifacts then this is a good time to create one:

```bash
aws s3 mb s3://BUCKET_NAME
```

Next, run the following command to package our Lambda function to S3:

```bash
S3_BUCKET_NAME=BUCKET_NAME PROFILE=default make sam-package
```

Next, the following command will create a Cloudformation Stack and deploy your SAM resources.

```bash
S3_BUCKET_NAME=BUCKET_NAME PROFILE=default make sam-deploy
```

> **See [Serverless Application Model (SAM) HOWTO Guide](https://github.com/awslabs/serverless-application-model/blob/master/HOWTO.md) for more details in how to get started.**

After deployment is complete you can run the following command to retrieve the API Gateway Endpoint URL:

```bash
aws cloudformation describe-stacks \
    --stack-name sam-app \
    --query 'Stacks[].Outputs'
``` 
