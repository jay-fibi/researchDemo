package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
)

func main() {
	// Load AWS configuration from environment variables, shared credentials file, or IAM roles
	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion("us-east-1"), // Change this to your preferred region
	)
	if err != nil {
		log.Fatalf("Unable to load AWS SDK config: %v", err)
	}

	// Create S3 client
	client := s3.NewFromConfig(cfg)

	// Generate a unique bucket name (S3 bucket names must be globally unique)
	bucketName := fmt.Sprintf("go-cloud-demo-bucket-%d", time.Now().Unix())

	// Create the S3 bucket
	createBucketInput := &s3.CreateBucketInput{
		Bucket: aws.String(bucketName),
		// Note: us-east-1 doesn't require a location constraint
	}

	_, err = client.CreateBucket(context.TODO(), createBucketInput)
	if err != nil {
		log.Fatalf("Failed to create bucket: %v", err)
	}

	fmt.Printf("Successfully created S3 bucket: %s\n", bucketName)

	// Optional: Enable versioning on the bucket
	versioningInput := &s3.PutBucketVersioningInput{
		Bucket: aws.String(bucketName),
		VersioningConfiguration: &types.VersioningConfiguration{
			Status: types.BucketVersioningStatusEnabled,
		},
	}

	_, err = client.PutBucketVersioning(context.TODO(), versioningInput)
	if err != nil {
		log.Printf("Warning: Failed to enable versioning: %v", err)
	} else {
		fmt.Println("Versioning enabled on the bucket")
	}

	// List all buckets to verify creation
	listBucketsInput := &s3.ListBucketsInput{}
	listBucketsOutput, err := client.ListBuckets(context.TODO(), listBucketsInput)
	if err != nil {
		log.Printf("Warning: Failed to list buckets: %v", err)
	} else {
		fmt.Println("\nYour S3 buckets:")
		for _, bucket := range listBucketsOutput.Buckets {
			fmt.Printf("- %s (created: %s)\n", *bucket.Name, bucket.CreationDate.Format("2006-01-02 15:04:05"))
		}
	}

	fmt.Println("\nDemo completed successfully!")
	fmt.Println("Note: Remember to delete the bucket when you're done to avoid charges.")
	fmt.Printf("You can delete it with: aws s3 rb s3://%s --force\n", bucketName)
}
