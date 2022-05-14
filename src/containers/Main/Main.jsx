import { useState, useEffect } from "react";
import { FFmpegUser } from "../../js/FFmpegUser";

export function Main() {
    const [ffmpeg] = useState(new FFmpegUser());
    const [ready, setReady] = useState(false);
    const [input, setInput] = useState(null);
    const [format, setFormat] = useState("mp4");
    const [output, setOutput] = useState({ file: null, url: "" });

    function handleInput(file) {
        setInput(file);
    }

    async function handleOutput() {
        const file = await ffmpeg.convert(input, format);
        setOutput(file);
        setInput(null);
    }

    function handleDownload() {
        if (!output.file) {
            return;
        }
        ffmpeg.download(...output);
    }

    useEffect(() => {
        if (!ready) {
            setReady(ffmpeg.load());
        }
    }, [ffmpeg, ready]);

    useEffect(() => {
        if (ready && input) {
            handleOutput();
            setInput(null);
        }
        // eslint-disable-next-line
    }, [ready, input]);

    return (
        <main>
            <h3>~ Input ~</h3>
            <div>
                <span>
                    <label htmlFor="upload">Select Gif:</label>
                    <input
                        type="file"
                        id="input"
                        accept="image/gif"
                        onChange={(e) =>
                            handleInput(e.target.files[0], "image/gif")
                        }
                    />
                </span>
                <span>
                    <label htmlFor="format">Format:</label>
                    <select
                        id="format"
                        onChange={(e) => setFormat(e.target.value)}
                    >
                        <option value="mp4">mp4</option>
                        <option value="png">png</option>
                    </select>
                </span>
            </div>
            <h3>~ Output ~</h3>
            <video id="video" src={output.url} controls loop />
            <button onClick={() => handleDownload()}>Download</button>
        </main>
    );
}
