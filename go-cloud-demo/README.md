# Go Cloud Infrastructure Demo

A simple demonstration of using Go to create cloud infrastructure resources, specifically an AWS S3 bucket.

## Prerequisites

1. **Go Installation**: This project requires Go 1.22 or later. The demo will automatically use Go 1.24.7.

2. **AWS Account and Credentials**:
   - An AWS account with appropriate permissions to create S3 buckets
   - AWS credentials configured via one of these methods:
     - Environment variables: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
     - AWS CLI configured: Run `aws configure`
     - IAM role (if running on EC2)
     - AWS SSO

## Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd go-cloud-demo
   ```

2. **Install dependencies**:
   ```bash
   go mod tidy
   ```

## Running the Demo

1. **Build the application**:
   ```bash
   go build -o cloud-demo main.go
   ```

2. **Run the demo**:
   ```bash
   ./cloud-demo
   ```

## What the Demo Does

The demo performs the following operations:

1. **Loads AWS Configuration**: Connects to AWS using your configured credentials
2. **Creates an S3 Bucket**: Generates a unique bucket name and creates a new S3 bucket
3. **Enables Versioning**: Configures the bucket with versioning enabled
4. **Lists Buckets**: Displays all your S3 buckets to verify creation
5. **Cleanup Instructions**: Provides commands to delete the created bucket

## Expected Output

```
Successfully created S3 bucket: go-cloud-demo-bucket-1640995200
Versioning enabled on the bucket

Your S3 buckets:
- go-cloud-demo-bucket-1640995200 (created: 2025-01-01 12:00:00)
- existing-bucket-1 (created: 2024-12-01 10:30:00)
- existing-bucket-2 (created: 2024-11-15 14:20:00)

Demo completed successfully!
Note: Remember to delete the bucket when you're done to avoid charges.
You can delete it with: aws s3 rb s3://go-cloud-demo-bucket-1640995200 --force
```

## Configuration

### Changing AWS Region

Edit the region in `main.go`:

```go
config.WithRegion("us-west-2"), // Change from us-east-1 to your preferred region
```

**Important**: If you change to a region other than `us-east-1`, you must also add the location constraint in the bucket creation code:

```go
createBucketInput := &s3.CreateBucketInput{
    Bucket: aws.String(bucketName),
    CreateBucketConfiguration: &types.CreateBucketConfiguration{
        LocationConstraint: types.BucketLocationConstraintUsWest2,
    },
}
```

### Available Regions and Location Constraints

- `us-east-1`: No location constraint needed (default)
- `us-west-1`: `BucketLocationConstraintUsWest1`
- `us-west-2`: `BucketLocationConstraintUsWest2`
- `eu-west-1`: `BucketLocationConstraintEuWest1`
- `ap-southeast-1`: `BucketLocationConstraintApSoutheast1`
- `ap-northeast-1`: `BucketLocationConstraintApNortheast1`
- And many more...

## Security Best Practices

1. **Least Privilege**: Ensure your AWS credentials have only the minimum required permissions:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:CreateBucket",
           "s3:PutBucketVersioning",
           "s3:ListAllMyBuckets"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

2. **Environment Variables**: For production, use environment variables instead of shared credentials files.

3. **Cleanup**: Always delete test resources to avoid unexpected charges.

## Troubleshooting

### Common Issues

1. **"Unable to load AWS SDK config"**:
   - Check that your AWS credentials are properly configured
   - Verify the AWS region is correct
   - Ensure you have network connectivity to AWS

2. **"Access Denied"**:
   - Verify your IAM user/role has the necessary S3 permissions
   - Check that you're using the correct AWS account

3. **"Bucket name already exists"**:
   - The bucket name generation includes a timestamp, so this should be rare
   - If it occurs, wait a few seconds and try again

### Debug Mode

Add these lines to enable debug logging:

```go
import "github.com/aws/smithy-go/logging"

cfg, err := config.LoadDefaultConfig(context.TODO(),
    config.WithRegion("us-east-1"),
    config.WithLogger(logging.StandardLogger{}),
)
```

## Extending the Demo

### Adding More AWS Services

To add EC2 instance creation:

```go
import "github.com/aws/aws-sdk-go-v2/service/ec2"

ec2Client := ec2.NewFromConfig(cfg)
// Add EC2 operations here
```

### Error Handling Improvements

```go
if err != nil {
    if awsErr, ok := err.(awserr.Error); ok {
        switch awsErr.Code() {
        case s3.ErrCodeBucketAlreadyExists:
            log.Printf("Bucket already exists: %v", awsErr)
        default:
            log.Printf("AWS error: %v", awsErr)
        }
    } else {
        log.Printf("Unknown error: %v", err)
    }
    return
}
```

## Cleanup

After running the demo, clean up the created resources:

```bash
# Delete the S3 bucket (replace with your actual bucket name)
aws s3 rb s3://go-cloud-demo-bucket-1640995200 --force
```

## Next Steps

This demo shows the basics of cloud infrastructure management with Go. To build more complex infrastructure:

1. **Add more AWS services** (EC2, RDS, Lambda, etc.)
2. **Implement idempotency** (check if resources exist before creating)
3. **Add configuration files** (YAML/JSON for infrastructure definitions)
4. **Create reusable modules** for common infrastructure patterns
5. **Add testing** with mock AWS services
6. **Implement state management** to track created resources

## Resources

- [AWS SDK for Go v2 Documentation](https://aws.github.io/aws-sdk-go-v2/docs/)
- [Go Documentation](https://golang.org/doc/)
- [AWS CLI Documentation](https://docs.aws.amazon.com/cli/)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
