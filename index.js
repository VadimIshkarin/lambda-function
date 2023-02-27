const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const Jimp = require("jimp");
const s3 = new S3Client({ region: "us-east-1" });
exports.handler = async (event) => {
  const srcBucket = event.Records[0].s3.bucket.name;
  const srcKey = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );
  const dstBucket = srcBucket;
  const dstKey = `resized/${srcKey}`;
  try {
    const params = {
      Bucket: srcBucket,
      Key: srcKey,
    };
    const image = await s3.send(new GetObjectCommand(params));
    const jimpImage = await Jimp.read(image.Body);
    jimpImage.resize(200, Jimp.AUTO);

    const resizedImage = await jimpImage.getBufferAsync(Jimp.MIME_JPEG);
    // const resizedImage = await Jimp(image.Body).resize(200, 200).toBuffer();
    const putParams = {
      Bucket: dstBucket,
      Key: dstKey,
      Body: resizedImage,
      ContentType: "image/jpeg",
    };
    await s3.send(new PutObjectCommand(putParams));
    console.log(
      `Successfully resized ${srcBucket}/${srcKey} and uploaded to ${dstBucket}/${dstKey}`
    );
  } catch (error) {
    console.error(`Error resizing image: ${error}`);
  }
};
