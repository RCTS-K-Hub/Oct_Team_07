import React, { useState } from "react";

function Form() {
  const [file, setFile] = useState(null);
  const [msg , setMsg] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async(e) => {
    e.preventDefault();

    const url = "http://localhost:5000/upload";
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
        setMsg(data.msg)
      })
      .catch((error) => {
        setMsg(error.msg)
      });
      setTimeout(() => {
        setMsg(null)
      }, 2000);
  };

  return (
    <div>
      {msg&&<p>{msg}</p>}
      <h1>Image file Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
    </div>
  );
}

export default Form;
