import React, { useState } from "react";


const buttonStyle = {
  background: "#007BFF",
  color: "white",
  padding: "10px 20px",
  border: "none",
  cursor: "pointer",
  borderRadius: "4px",
  marginLeft: "10px",
};



function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setErrorMessage("Please select a file before uploading.");
      return;
    }

    const url = "http://localhost:5000/upload";
    const formData = new FormData();
    formData.append("file", selectedFile, selectedFile.name);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Server response:", data);
        setErrorMessage(null); // Clear any previous error message
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage("Error uploading the file.");
    }
  };

  return (
    <div>
      <h1>File Upload</h1>
      <input type="file" onChange={handleFileChange} />
      <button style={buttonStyle} onClick={handleUpload}>Upload File</button>
      {errorMessage && <p style={{ color: "blue" }}>{errorMessage}</p>}
    </div>
  );
}

export default FileUpload;
