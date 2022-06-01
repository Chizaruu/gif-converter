import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

export class FFmpegUser {
    constructor() {
        this.loadable = !!window.SharedArrayBuffer;
        this.ffmpeg = createFFmpeg({
            log: true,
            progressRatio: 0,
        });
    }

    async load() {
        if (this.loadable) {
            try {
                await this.ffmpeg.load();
                console.log("ffmpeg loaded");
                return true;
            } catch (error) {
                this.loadable = false;
                console.error(error);
                return false;
            }
        }
    }

    async convert(input, format) {
        if (!input) {
            return;
        }
        this.ffmpeg.FS("writeFile", "input.gif", await fetchFile(input));
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

                const data = this.ffmpeg.FS("readFile", "output.mp4");
                const blob = new Blob([data.buffer], { type: "video/mp4" });
                const url = URL.createObjectURL(blob);
                return [url];
            case "png":
                await this.ffmpeg.run(
                    "-i",
                    "input.gif",
                    "-map",
                    "0:v",
                    "-r",
                    "5",
                    "out_%03d.png"
                );

                return this.ffmpeg
                    .FS("readdir", ".")
                    .filter((file) => file.endsWith(".png"))
                    .map((file) => {
                        const data = this.ffmpeg.FS("readFile", file);
                        const blob = new Blob([data.buffer], {
                            type: "image/png",
                        });
                        const url = URL.createObjectURL(blob);
                        return url;
                    });
            default:
                throw new Error("Invalid format");
        }
    }

    download(url) {
        const a = document.createElement("a");
        a.href = url;
        a.download = "output.mp4";
        a.click();
    }

    isLoaded() {
        return this.loadable;
    }

    async destroy(output) {
        if (output && output.length)
            this.ffmpeg
                .FS("readdir", ".")
                .filter((file) => file.endsWith(".png"))
                .map((file) => this.ffmpeg.FS("unlink", file));
    }
}
