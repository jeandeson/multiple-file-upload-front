import Dropzone from "react-dropzone";

import { DropContainer, UploadMessage } from "./styles";

const Upload = ({ handleUpload }) => {
  function toggleReady(files) {
    handleUpload(files);
  }
  function renderDragMessage(isDragActive, isDragReject) {
    if (!isDragActive) {
      return <UploadMessage>Solte aquivos aqui...</UploadMessage>;
    }
    if (isDragReject) {
      return (
        <UploadMessage type="error">Arquivo não suportado...</UploadMessage>
      );
    }
    return (
      <UploadMessage type="success">Arraste aquivos aqui...</UploadMessage>
    );
  }
  return (
    <Dropzone accept={"image/*"} onDrop={toggleReady}>
      {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
        <DropContainer
          {...getRootProps()}
          isDragActive={isDragActive}
          isDragReject={isDragReject}
        >
          <input {...getInputProps()} />
          {renderDragMessage(isDragActive, isDragReject)}
        </DropContainer>
      )}
    </Dropzone>
  );
};

export default Upload;
