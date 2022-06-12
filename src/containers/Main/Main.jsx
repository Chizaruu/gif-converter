import { useState, useEffect } from "react";
import styles from "./Main.module.scss";
import { FFmpegUser } from "../../js/FFmpegUser";
import { ImageHandler } from "../../components/ImageHandler/ImageHandler";

export function Main() {
    const [ffmpegUser] = useState(new FFmpegUser());
    const [ready, setReady] = useState(false);
    const [input, setInput] = useState(null);
    const [format, setFormat] = useState("mp4");
    const [type, setType] = useState("Individual");
    const [output, setOutput] = useState([]);

    function handleInput(file) {
        setInput(file);
    }

    async function handleDownload() {
        if (output === null) {
            console.log("No file to download");
            return;
        }

        await ffmpegUser.download(output, format, type);
    }

    useEffect(() => {
        (async () => {
            await ffmpegUser.load();
        })();

        if (ffmpegUser.isLoaded()) {
            setReady(true);
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (ready && input) {
            setOutput([]);
            (async () => {
                await ffmpegUser.destroy(output);
                setOutput(await ffmpegUser.convert(input, format, type));
            })();
        }
        // eslint-disable-next-line
    }, [ready, input, format, type]);

    return (
        <main className={styles.main}>
            <div className={styles.Container}>
                <div className={styles.Container__Input}>
                    <h3>~ Input ~</h3>
                    <h4>Select Gif</h4>
                    <input
                        type="file"
                        id="input"
                        accept="image/gif"
                        onChange={(e) =>
                            handleInput(e.target.files[0], "image/gif")
                        }
                    />
                    <h4>Format</h4>
                    <select
                        id="format"
                        onChange={(e) => setFormat(e.target.value)}
                    >
                        <option value="mp4">mp4</option>
                        <option value="png">png</option>
                    </select>
                    {format === "png" && <h4>Type</h4>}
                    {format === "png" && (
                        <select
                            name="type"
                            id="type"
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="Individual">Individual</option>
                            <option value="Spritesheet">Spritesheet</option>
                            <option value="Horizontal Strip">
                                Horizontal Strip
                            </option>
                            <option value="Vertical Strip">
                                Vertical Strip
                            </option>
                        </select>
                    )}
                </div>
                <div className={styles.Container__Output}>
                    <h3>~ Output ~</h3>
                    <div>
                        {format === "png" && (
                            <ImageHandler urls={output} type={type} />
                        )}
                        {format === "mp4" && (
                            <video src={output[0]} controls loop />
                        )}
                    </div>
                    <button onClick={() => handleDownload()}>Download</button>
                </div>
            </div>
        </main>
    );
}
