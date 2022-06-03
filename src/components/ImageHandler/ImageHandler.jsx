export function ImageHandler({ urls, type }) {
    return (
        <div>
            {type === "Individual" &&
                urls.map((url, index) => (
                    <img key={index} src={url} alt={index} width="50" />
                ))}
            {type === "Spritesheet" && (
                <img src={urls[0]} alt="spritesheet" width="350" />
            )}
            {type === "Horizontal Strip" && (
                <img src={urls[0]} alt="horizontal strip" width="350" />
            )}
            {type === "Vertical Strip" && (
                <img src={urls[0]} alt="vertical strip" width="350" />
            )}
        </div>
    );
}
