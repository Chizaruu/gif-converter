import styles from "./ImageHandler.module.scss";

export function ImageHandler({ urls, type }) {
    let classes = [styles.ImageHandler];

    switch (type) {
        case "Individual":
            classes = (styles.ImageHandler, styles.ImageHandler__Individual);
            break;
        case "Spritesheet":
            classes = (styles.ImageHandler, styles.ImageHandler__Spritesheet);
            break;
        case "Horizontal Strip":
            classes =
                (styles.ImageHandler, styles.ImageHandler__HorizontalStrip);
            break;
        case "Vertical Strip":
            classes = (styles.ImageHandler, styles.ImageHandler__VerticalStrip);
            break;
        default:
            classes = [styles.ImageHandler];
            break;
    }

    return (
        <div className={classes}>
            {type === "Individual" &&
                urls.map((url, index) => (
                    <img key={index} src={url} alt={index} />
                ))}
            {type === "Spritesheet" && <img src={urls[0]} alt="spritesheet" />}
            {type === "Horizontal Strip" && (
                <img src={urls[0]} alt="horizontal strip" />
            )}
            {type === "Vertical Strip" && (
                <img src={urls[0]} alt="vertical strip" />
            )}
        </div>
    );
}
