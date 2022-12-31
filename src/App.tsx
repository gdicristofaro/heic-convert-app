import React, { useMemo, useState } from 'react';
import { convertAndDownload } from './convertHeif';
import Dropzone, { DropEvent, FileRejection, useDropzone } from 'react-dropzone'


const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};


function handleFormEvt(acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent, processingMessageStatus: undefined | ((msg: string) => void) = undefined) {
  convertAndDownload(acceptedFiles, processingMessageStatus);
}

function App() {
  let [processingMessage, setProcessingMessage] = useState("");
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({
    // accept: { "image/*": [".heic", ".heif"] },
    onDrop: (accepted, rej, evt) => handleFormEvt(accepted, rej, evt, setProcessingMessage),
    minSize: 0,
    multiple: true
  });

  const style: any = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  return (
    <div className="main" style={{padding: '1rem'}}>
      <h1>HEIC Converter</h1>
      <div className="container">
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop heic files here, or click to select files</p>
        </div>
      </div>
      <div>
        <p>{processingMessage}</p>
      </div>
    </div>
  );
}

export default App;
