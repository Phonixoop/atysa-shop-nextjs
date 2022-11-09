import BlurImage from "ui/blur-image";
import withDragDrop from "ui/with-dragdrop";

import DropFileIcon from "ui/icons/cloud-arrow-up";

const FilesViewWithDragDrop = withDragDrop(FilesView);

export default function GalleryView({
  data = [],
  onDrop = () => {},
  onSelect = () => {},
}) {
  async function handleFile(files) {
    if (!files) return;
    const _files = files.map((file) => {
      const { name } = file;
      return {
        id: Math.random() * 1e9,
        originalFilename: name,
        details: file,
        url: window.URL.createObjectURL(file),
        uploaded: false,
      };
    });

    onDrop(_files);
  }
  return (
    <>
      <div className="w-11/12 h-5/6 flex flex-col gap-2">
        <FilesViewWithDragDrop
          files={data}
          onChange={(file) => {
            onSelect(file);
          }}
          onDrop={handleFile}
        >
          {data.length <= 0 && <DropFileIcon />}
        </FilesViewWithDragDrop>
      </div>
    </>
  );
}

function FilesView({ files, onClick = () => {}, onContextMenu = () => {} }) {
  return (
    <>
      {files != null &&
        files.length > 0 &&
        files.map((file) => {
          return (
            <File
              key={file.id}
              file={file}
              onClick={onClick}
              onContextMenu={onContextMenu}
            />
          );
        })}
    </>
  );
}

function File({ file = {}, onContextMenu = () => {} }) {
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        onChange(file);
      }}
      className="flex justify-center drop-shadow-lg items-center w-40 h-40 overflow-hidden"
    >
      {file?.mimetype?.includes("image") ? (
        <BlurImage image={file} />
      ) : (
        <span>{file?.originalFilename}</span>
      )}
    </div>
  );
}
