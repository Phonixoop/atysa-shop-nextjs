import BlurImage from "ui/blur-image";
import withDragDrop from "ui/with-dragdrop";
import MultiBox from "ui/forms/multi-box";
import DropFileIcon from "ui/icons/cloud-arrow-up";

const MultiBoxWithDragDrop = withDragDrop(MultiBox);

export default function GalleryView({
  children,
  className = "relative w-11/12 h-5/6 flex flex-col gap-2",
  selectedData = [],
  data = [],
  isLoading = false,
  onDrop = () => {},
  onChange = () => {},
  onClick = () => {},
  onContextMenu = () => {},
}) {
  return (
    <>
      <div className={className}>
        <MultiBoxWithDragDrop
          files={data}
          onClick={(file) => {
            onClick(file);
          }}
          onContextMenu={(file) => {
            onContextMenu(file);
          }}
          onDrop={(files) => onDrop(files)}
          initialKeys={selectedData}
          list={data}
          multiple
          onChange={(selectedFiles) => {
            onChange(selectedFiles);
          }}
          renderItem={(file, selected) => {
            return (
              <File
                className={`${
                  selected
                    ? "border-[3px] border-atysa-900 shadow-inner scale-95 rounded-lg"
                    : ""
                } transition-transform cursor-pointer`}
                key={file.id}
                file={file}
                onClick={() => onClick(file)}
                onContextMenu={() => onContextMenu(file)}
              />
            );
          }}
        >
          {isLoading
            ? "در حال لود گالری"
            : data.length <= 0 && <DropFileIcon />}
        </MultiBoxWithDragDrop>

        {children}
      </div>
    </>
  );
}

function File({
  className = "",
  file = {},
  onClick = () => {},
  onContextMenu = () => {},
}) {
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(file);
      }}
      onClick={() => onClick(file)}
      className={`flex justify-center drop-shadow-lg items-center w-40 h-40 overflow-hidden ${className}`}
    >
      {file?.mimetype?.includes("image") ? (
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <BlurImage
            className="rounded-lg"
            src={file.url}
            layout="fill"
            objectFit="cover"
            alt={file.originalFilename}
          />
        </div>
      ) : (
        <span>{file?.originalFilename}</span>
      )}
    </div>
  );
}
