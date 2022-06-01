export function ImageHandler({ urls }) {
    return (
        <div>
            {urls.length &&
                urls.map((url, index) => (
                    <img key={index} src={url} alt={index} width="50" />
                ))}
        </div>
    );
}
