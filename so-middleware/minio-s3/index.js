const Minio = require('minio');

const client = new Minio.Client({
    endPoint: process.env.MINIO_HOST || 'minio-service',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});

const bucket = 'second-bucket';
const fileName = 'hello-2.txt';
const fileContent = 'Hello MinIO!';

client.putObject(bucket, fileName, fileContent, (err, etag) => {
    if (err) {
        return console.log('Error uploading:', err);
    }
    console.log(`Uploaded ${fileName} to ${bucket}`);
});