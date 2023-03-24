# Lambda function

## Description

A Lambda function (using Node.js/JavaScript) should take an image in an S3 bucket, resize it, and put the resized version of the image in the S3 bucket.

## Execution result:

<img src="/img/execution.png" alt="Alt text" style="display: inline-block; margin: 0 auto; max-width: 800px">

## Resized image in the S3 bucket:

<img src="/img/s3.png" alt="Alt text" style="display: inline-block; margin: 0 auto; max-width: 800px">

## Dependencies

- "aws-sdk": "^2.1327.0"
- "jimp": "^0.22.5"
