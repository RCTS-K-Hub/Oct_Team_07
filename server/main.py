# app.py
from flask import Flask, request, jsonify
from minio import Minio
from flask_cors import CORS
import io

app = Flask(__name__)
CORS(app)

minio_client = Minio(
    endpoint='localhost:9000',
    access_key='owner',
    secret_key='8121501222@Krishna',
    secure=False 
)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' in request.files:
        file = request.files['file']
        bucket_name = 'sam'
        object_name = file.filename

        in_memory_file = io.BytesIO(file.read())

        minio_client.put_object(
            bucket_name,
            object_name,
            in_memory_file,
            len(in_memory_file.getvalue()),
            file.content_type,
        )

        return jsonify(blob='File uploaded successfully')

    return jsonify(blob='No file provided'), 400


if __name__ == '__main__':
    app.run(debug=True, port=5050)
