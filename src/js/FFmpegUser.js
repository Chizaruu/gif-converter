import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { downloadZip } from "client-zip";
import FileSaver from "file-saver";

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
        if (!input) return;

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
                await this.ffmpeg.run("-i", "input.gif", "out_%03d.png");

                const files = this.ffmpeg
                    .FS("readdir", ".")
                    .filter((file) => file.endsWith(".png"));

                const urls = files.map((file) => {
                    const data = this.ffmpeg.FS("readFile", file);
                    const blob = new Blob([data.buffer], { type: "image/png" });
                    const url = URL.createObjectURL(blob);
                    return url;
                });

                return urls;
            default:
                throw new Error("Invalid format");
        }
    }

    async download(output, format) {
        switch (format) {
            case "mp4":
                const data = this.ffmpeg.FS("readFile", "output.mp4");
                const blob = new Blob([data.buffer], { type: "video/mp4" });
                FileSaver.saveAs(blob, "output.mp4");
                break;
            case "png":
                let number = 1;
                async function* downloadGenerator() {
                    for (const url of output) {
                        yield {
                            input: await fetch(url),
                            name: `output${number++}.png`,
                        };
                    }
                }

                const zip = await downloadZip(downloadGenerator()).blob();
                FileSaver.saveAs(zip, "output.zip");
                break;
            default:
                throw new Error("Invalid format");
        }
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
