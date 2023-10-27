import React, { useState } from "react";

function Form() {
  const [file, setFile] = useState(null);
  const [blob , setBlob] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async(e) => {
    e.preventDefault();

    const url = "http://localhost:5050/upload";
    const formData = new FormData();
    formData.append("file", file , file.name);

    await fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("File upload failed");
        }
      })
      .then((data) => {
        console.log(data)
        setBlob(data.blob)
      })
      .catch((error) => {
        console.error(error)
        setBlob(error.blob)
      });
      setTimeout(() => {
        setBlob(null)
      }, 2000);
  };

  return (
    <div>
      <h1>Any File To Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
      <br/>
      {blob&&<p>{blob}</p>}
    </div>
  );
}

export default Form;
