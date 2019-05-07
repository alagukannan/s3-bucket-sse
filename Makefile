S3_BUCKET_NAME ?= ""
PROFILE ?= "default"
SAM := "$(shell which sam)"

sam-init: 
	npm run init --prefix src 

sam-build: 
	SAM build -t src/template.yaml 

sam-test: 
	npm run test-local --prefix src

sam-clean:
	npm run clean --prefix src

sam-package:
	sam package --template-file src/template.yaml --s3-bucket $(S3_BUCKET_NAME) --output-template-file src/packaged.yaml --profile ${PROFILE}

sam-deploy:
	 sam deploy --template-file src/packaged.yaml --s3-bucket $(S3_BUCKET_NAME) --profile ${PROFILE} --stack-name s3BucketPolicyEnforcer --capabilities CAPABILITY_IAM

