# exit when any command fails
set -e
tier=$1
s3BucketName=$2
aws_profile=$3

stackName="$4-$tier"
cd src
echo "Starting build fo Tier: $tier"

echo "clearing and install NPM packages"
rm -rf node_modules
npm install --production

echo "upload lambda to s3 bucket: $s3BucketName"
aws cloudformation package --template-file template.$tier.yaml --s3-bucket $s3BucketName  --output-template-file packaged.yaml --profile $aws_profile
echo "initiate Cloudformation stack update for $stackName"
aws cloudformation deploy --template-file ./packaged.yaml --stack-name $stackName --capabilities CAPABILITY_IAM --region us-west-2 --profile $aws_profile

echo "Ending build fo Tier: $tier"