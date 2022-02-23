import { useState, useEffect } from "react";
import GlobalStyle from "./styles/global";
import { Content, Container } from "./App.styles";
import Upload from "./components/Upload";
import FileList from "./components/FileList";
import { uniqueId } from "lodash";
import filesize from "filesize";
import api from "./servies/api";

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    async function fetchApiData() {
      const { data } = await api.get("/posts");
      console.log(data);
      setUploadedFiles(
        data.map((file) => ({
          id: file._id,
          key: file.key,
          name: file.name,
          readableSize: filesize(file.size),
          url: file.url,
          preview: file.url,
          uploaded: true,
        }))
      );
    }
    fetchApiData();
  }, []);

  const handleDelete = async (file) => {
    setUploadedFiles(uploadedFiles.filter((f) => f.key !== file.key));
    await api.delete(`/posts/${file.key}`);
  };

  const handleUpload = (files) => {
    const auxFiles = files.map((file) => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null,
    }));

    setUploadedFiles(auxFiles);
    uploadedFiles.forEach(processUpload);
  };

  function updateFile(id, data) {
    const updatedUploadedFiles = uploadedFiles.map((file) => {
      if (file.id === id) {
        file.key = data.key;
        file.progress = data.progress;
        file.error = data.error;
        file.uploaded = data.uploaded;
        file.url = data.url;
        return { ...file, ...data };
      } else {
        return file;
      }
    });
    setUploadedFiles(updatedUploadedFiles);
  }

  function processUpload(file) {
    const data = new FormData();
    data.append("file", file.file);
    api
      .post("/posts", data, {
        onUploadProgress: (e) => {
          const progress = parseInt(Math.round((e.loaded * 100) / e.total));
          updateFile(file.id, {
            progress,
            error: false,
            uploaded: false,
            url: null,
          });
        },
      })
      .then((response) => {
        updateFile(file.id, {
          key: response.data.key,
          uploaded: true,
          error: false,
          url: response.data.url,
        });
      })
      .catch(() => {
        updateFile(file.id, { error: true });
      });
  }

  return (
    <Container>
      <GlobalStyle />
      <Content>
        <Upload handleUpload={handleUpload} />
        {!!uploadedFiles.length && (
          <FileList handleDelete={handleDelete} files={uploadedFiles} />
        )}
      </Content>
      {!!uploadedFiles.length && (
        <button onClick={() => uploadedFiles.forEach(processUpload)}>
          upload
        </button>
      )}
    </Container>
  );
}

export default App;
