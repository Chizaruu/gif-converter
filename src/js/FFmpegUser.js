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

    async convert(input, format, type) {
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
                await this.ffmpeg.run("-i", "input.gif", "out_%06d.png");
                const files = this.ffmpeg
                    .FS("readdir", ".")
                    .filter((file) => file.endsWith(".png"));
                const ffmpegInputs = [
                    "-i",
                    "input.gif",
                    "-f",
                    "image2",
                    "-vf",
                    "scale=trunc(iw/2)*2:trunc(ih/2)*2",
                    "-vsync",
                    "0",
                    "-vf",
                ];
                switch (type) {
                    case "Individual":
                        const urls = files.map((file) => {
                            return this.makeImageUrl(file);
                        });

                        return urls;
                    case "Spritesheet":
                        await this.ffmpeg.run(
                            ...ffmpegInputs,
                            `tile=7x${Math.ceil(files.length / 7)}`,
                            "spritesheet.png"
                        );
                        return [this.makeImageUrl("spritesheet.png")];
                    case "Horizontal Strip":
                        await this.ffmpeg.run(
                            ...ffmpegInputs,
                            `tile=${files.length}x1`,
                            "horizontalStrip.png"
                        );
                        return [this.makeImageUrl("horizontalStrip.png")];
                    case "Vertical Strip":
                        await this.ffmpeg.run(
                            ...ffmpegInputs,
                            `tile=1x${files.length}`,
                            "verticalStrip.png"
                        );
                        return [this.makeImageUrl("verticalStrip.png")];
                    default:
                        throw new Error("Invalid type");
                }
            default:
                throw new Error("Invalid format");
        }
    }

    async download(output, format, type) {
        switch (format) {
            case "mp4":
                const data = this.ffmpeg.FS("readFile", "output.mp4");
                const blob = new Blob([data.buffer], { type: "video/mp4" });
                FileSaver.saveAs(blob, "output.mp4");
                break;
            case "png":
                switch (type) {
                    case "Individual":
                        let number = 1;
                        async function* downloadGenerator() {
                            for (const url of output) {
                                yield {
                                    input: await fetch(url),
                                    name: `output${number++}.png`,
                                };
                            }
                        }
                        const zip = await downloadZip(
                            downloadGenerator()
                        ).blob();
                        FileSaver.saveAs(zip, "output.zip");
                        break;
                    case "Spritesheet":
                        FileSaver.saveAs(
                            this.makeImageBlob("spritesheet.png"),
                            "spritesheet.png"
                        );
                        break;
                    case "Horizontal Strip":
                        FileSaver.saveAs(
                            this.makeImageBlob("horizontalStrip.png"),
                            "horizontalStrip.png"
                        );
                        break;
                    case "Vertical Strip":
                        FileSaver.saveAs(
                            this.makeImageBlob("verticalStrip.png"),
                            "verticalStrip.png"
                        );
                        break;
                    default:
                        throw new Error("Invalid type");
                }
                break;
            default:
                throw new Error("Invalid format");
        }
    }

    makeImageUrl(image) {
        const data = this.ffmpeg.FS("readFile", image);
        const blob = new Blob([data.buffer], { type: "image/png" });
        const url = URL.createObjectURL(blob);
        return url;
    }

    makeImageBlob(file) {
        const data = this.ffmpeg.FS("readFile", file);
        const blob = new Blob([data.buffer], {
            type: "image/png",
        });
        return blob;
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
