import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

export class FFmpegUser {
    constructor() {
        this.loadable = !!window.SharedArrayBuffer;
        this.ffmpeg = createFFmpeg({
            corePath:
                "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
            path: require.resolve("path-browserify"),
            log: true,
            progressRatio: 0,
        });
    }

    async load() {
        if (!this.loadable) return;

        try {
            await this.ffmpeg.load();
            return true;
        } catch (error) {
            this.loadable = false;
            return false;
        }
    }

    async convert(input, format, output) {
        if (!input) {
            return;
        }
        await this.ffmpeg.FS("writeFile", "input.gif", await fetchFile(input));
        switch (format) {
            case "mp4":
                await this.ffmpeg.run(
                    "-f",
                    "gif",
                    "-i",
                    "input.gif",
                    "-movflags",
                    "+faststart",
                    "-pix_fmt",
                    "yuv420p",
                    "-vf",
                    "scale=trunc(iw/2)*2:trunc(ih/2)*2",
                    "output.mp4"
                );

                const data = await this.ffmpeg.FS("readFile", "output.mp4");
                const blob = new Blob([data.buffer], { type: "video/mp4" });
                const url = URL.createObjectURL(blob);
                output = { url, blob };
                return output;
            default:
                throw new Error("Invalid format");
        }
    }

    download(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.click();
    }
}