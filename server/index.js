const express = require("express");
const multer = require("multer");
const Minio = require("minio");
const cors = require("cors");

const app = express();
app.use(cors());

// Create a Minio client
const minioClient = new Minio.Client({
  endPoint: "localhost", // Update with your MinIO endpoint (e.g., 127.0.0.1)
  port: 9000,
  useSSL: false, // Set to true for HTTPS or false for HTTP
  accessKey: "minioadmin",
  secretKey: "minioadmin",
});

// Create a bucket if it doesn't exist
const bucket_name = 'testing';
minioClient.bucketExists(bucket_name, function (err, exists) {
  if (!exists) {
    minioClient.makeBucket(bucket_name, 'us-east-1', function (err) {
      if (err) return console.log(err);
      console.log('Bucket created successfully.');
    });
  }
});

// Multer middleware for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).send("No file uploaded.");
  }

  const objectName = "Minio/"+uploadedFile.originalname; //name of your file

  minioClient.putObject(bucket_name, objectName, uploadedFile.buffer, uploadedFile.buffer.length, (err, etag) => {
    if (err) {
      console.error("Error uploading file:", err);
      res.status(500).send({ msg: "Error uploading file" });
    } else {
      res.status(200).send({ msg: "File uploaded successfully" });
    }
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
