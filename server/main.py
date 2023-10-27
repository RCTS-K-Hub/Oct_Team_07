# app.py
from flask import Flask, request, jsonify, send_file
from minio import Minio
from flask_cors import CORS
import io

app = Flask(__name__)
CORS(app)

minio_client = Minio(
    endpoint='localhost:9000',
    access_key='seetha',
    secret_key='6301188638@Seetha',
    secure=False 
)


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' in request.files:
        file = request.files['file']
        bucket_name = 'ctha'
        object_name = file.filename

        in_memory_file = io.BytesIO(file.read())

        minio_client.put_object(
            bucket_name,
            object_name,
            in_memory_file,
            len(in_memory_file.getvalue()),
            file.content_type,
        )

        return jsonify(msg='File uploaded successfully')

    return jsonify(msg='No file provided'), 400


@app.route('/list-files')
def list_files():
    bucket_name = 'ctha'
    objects = minio_client.list_objects(bucket_name)

    file_list = [{"filename":obj.object_name} for obj in objects]

    return jsonify(file_list)


@app.route('/get-object/<object_name>')
def get_object(object_name):
    object_name = object_name
    bucket_name = 'ctha'
    object = minio_client.get_object(bucket_name, object_name)
    object_data = io.BytesIO(object.read())
    return send_file(object_data, mimetype=object.getheader('content-type', 'application/octet-stream'))  

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=5000)
