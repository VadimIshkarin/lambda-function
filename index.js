const AWS = require("aws-sdk");
const Jimp = require("jimp");

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

exports.handler = async (event, context) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  try {
    const imageObject = await s3
      .getObject({ Bucket: bucket, Key: key })
      .promise();
    const image = await Jimp.read(imageObject.Body);

    const resizedImage = image.resize(100, 100);
    const resizedImageBuffer = await resizedImage.getBufferAsync(
      Jimp.MIME_JPEG
    );

    const resizedImageKey = `resized-${key}`;
    await s3
      .putObject({
        Bucket: bucket,
        Key: resizedImageKey,
        Body: resizedImageBuffer,
      })
      .promise();

    console.log(`Successfully resized and uploaded image: ${resizedImageKey}`);
  } catch (error) {
    console.error(`Error resizing and uploading image: ${error}`);
  }
};
