import { Container, FileInfo, Preview } from "./styles";
import { CircularProgressbar } from "react-circular-progressbar";
import { MdCheckCircle, MdError, MdLink } from "react-icons/md";

const FileList = ({ files, handleDelete }) => {
  return (
    <Container>
      {files.map((file) => (
        <li key={file.id}>
          <FileInfo>
            <Preview src={file.preview} />
            <div>
              <strong>{file.name}</strong>
              <span>
                {file.readableSize}{" "}
                {!!file.url && (
                  <button onClick={() => handleDelete(file)}>Delete</button>
                )}
              </span>
            </div>
          </FileInfo>
          <div>
            {!file.uploaded && !file.error && (
              <CircularProgressbar
                styles={{ root: { width: 24 }, path: { stroke: "#715d901" } }}
                strokeWidth={10}
                value={file.progress}
              />
            )}
          </div>
          {file.url && (
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              <MdLink style={{ marginRight: 8 }} size={24} color={"#222"} />
            </a>
          )}
          {file.uploaded && <MdCheckCircle size={24} color="#78e5d5" />}
          {file.error && <MdError size={24} color="#e57878" />}
        </li>
      ))}
    </Container>
  );
};

export default FileList;
