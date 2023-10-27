const express = require("express");
const multer = require("multer");
const Minio = require("minio");
const cors = require("cors");

const app = express();
app.use(cors());
// app.use(express.json());
// Create a Minio client
const minioClient = new Minio.Client({
  endPoint: "localhost", // Update with your MinIO endpoint 127.0.0.1
  port: 9000,
  useSSL: false, // http = flase and https = true
  accessKey: "owner",
  secretKey: "8121501222@Krishna",
});

// Create a bucket if it doesn't exist
const bucketName = 'testing';
minioClient.bucketExists(bucketName, function (err, exists) {
  if (!exists) {
    minioClient.makeBucket(bucketName, 'us-east-1', function (err) {
      if (err) return console.log(err);
      console.log('Bucket created successfully.');
    });
  }
});

// Multer middleware for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const objectName = "Person/"+file.originalname; // specify the desired name for your file

  minioClient.putObject("testing", objectName, file.buffer, file.buffer.length, (err, etag) => {
    if (err) {
      console.error("Error uploading file:", err);
      res.status(500).send({msg:"Error uploading file"});
    } else {
      res.status(200).send({msg:"File uploaded successfully"});
    }
  });
});

app.get("/list-files", (req, res) => {
  const objectList = [];

  const stream = minioClient.listObjects(bucketName, 'Person/', true);
  stream.on('data', (obj) => {
    objectList.push(obj);
  });

  stream.on('end', () => {
    res.json(objectList);
  });

  stream.on('error', (err) => {
    console.error("Error listing objects:", err);
    res.status(500).json({ msg: "Error listing objects" });
  });
});

app.get("/get-object/:objectName", (req, res) => {
  const objectName = 'Person/'+req.params.objectName;

  minioClient.getObject(bucketName, objectName, (err, dataStream) => {
    if (err) {
      console.error("Error getting object:", err);
      res.status(500).json({ msg: "Error getting object" });
    } else {
      dataStream.pipe(res);
    }
  });
});


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
