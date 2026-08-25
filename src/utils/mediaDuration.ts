export function readMediaDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const isAudio = file.type.startsWith("audio/");
    const element = document.createElement(isAudio ? "audio" : "video");
    const objectUrl = URL.createObjectURL(file);
    let settled = false;

    const cleanup = () => {
      element.removeAttribute("src");
      element.load();
      URL.revokeObjectURL(objectUrl);
    };

    const finish = (seconds: number) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(Math.round(seconds));
    };

    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };

    element.preload = "metadata";

    element.onloadedmetadata = () => {
      if (!Number.isFinite(element.duration)) {
        element.currentTime = Number.MAX_SAFE_INTEGER;
        element.ontimeupdate = () => {
          element.ontimeupdate = null;
          element.currentTime = 0;
          finish(element.duration);
        };
        return;
      }

      finish(element.duration);
    };

    element.onerror = () => fail(new Error("Không đọc được metadata của file"));

    element.src = objectUrl;
  });
}
