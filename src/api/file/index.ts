import request from "api";
import { BASE_URL } from "api";

export function uploadFile({
  file,
  onProgress = () => {},
}: {
  file: any;
  onProgress: (percentage: number) => void;
}): any {
  const url = `${BASE_URL}/api/upload`;

  return new Promise<string>((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.onload = (result) => {
      const { response }: any = result.target;
      res(JSON.parse(response));
    };
    xhr.onerror = (evt) => rej(evt);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = (event.loaded / event.total) * 100;
        onProgress(Math.round(percentage));
      }
    };

    const formData = new FormData();
    formData.append("file", file);

    xhr.send(formData);
  });
}

export async function getUploads() {
  return await request({ url: `upload` });
}

export async function deleteFileById({ id }) {
  return await request({ url: `upload/${id}`, method: "DELETE" });
}
