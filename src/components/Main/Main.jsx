import React, { useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    path: require.resolve("path-browserify"),
    log: true,
    progressRatio: 0,
});

export function Main() {
    const [loadable, setLoadable] = useState(!!window.SharedArrayBuffer);
    const [ready, setReady] = useState(false);
    const [input, setInput] = useState(null);
    const [format, setFormat] = useState("mp4");
    const [output, setOutput] = useState({
        File: null,
        String: null,
    });

    async function load() {
        if (!loadable || ready) return;

        try {
            await ffmpeg.load();
            setReady(true);
        } catch (error) {
            setLoadable(false);
            throw new Error(error);
        }
    }

    function handleInput(file) {
        setInput(file);
    }

    async function convertFile() {
        if (!input) {
            return;
        }

        ffmpeg.FS("writeFile", "input.gif", await fetchFile(input));
        switch (format) {
            case "mp4":
                await ffmpeg.run(
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

                const data = ffmpeg.FS("readFile", "output.mp4");
                const blob = new Blob([data.buffer], { type: "video/mp4" });
                const url = URL.createObjectURL(blob);
                setOutput({
                    blob,
                    url,
                });
                break;
            default:
                throw new Error("Invalid format");
        }
    }

    const download = () => {
        if (!output.blob) {
            return;
        }

        const a = document.createElement("a");
        a.href = URL.createObjectURL(output.blob);

        switch (format) {
            case "mp4":
                a.download = "output.mp4";
                break;
            default:
                throw new Error("Invalid format");
        }

        a.click();
    };

    const reset = () => {
        output && URL.revokeObjectURL(output.url);
        setInput(undefined);
        setOutput(undefined);
    };

    useEffect(() => {
        load();
    });

    if (!loadable) {
        return (
            <div>
                <h2 style={{ fontSize: "3rem" }}>Browser not supported 😥</h2>
            </div>
        );
    }
    return (
        <main>
            <input
                type="file"
                id="upload"
                accept="image/gif"
                onChange={(e) => handleInput(e.target.files[0], "image/gif")}
            />
            <select id="format" onChange={(e) => setFormat(e.target.value)}>
                <option value="mp4">mp4</option>
                <option value="png">png</option>
            </select>
            <input type="checkbox" id="spritesheet" />
            <label htmlFor="spritesheet">Spritesheet</label>
            <button onClick={() => reset()}>Reset</button>
            <button onClick={() => convertFile()}>Convert</button>
            <label htmlFor="video">~ Output ~</label>
            <video id="video" src={output.url} controls loop />
            <button onClick={() => download(output.blob, "output.mp4")}>
                Download
            </button>
        </main>
    );
}
