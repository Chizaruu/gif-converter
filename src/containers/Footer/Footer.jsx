import React from "react";
import styles from "./Footer.module.scss";

export function Footer() {
    return (
        <footer className={styles}>
            Made with
            <span id="heart" title="Latvia!~">
                ❤️
            </span>
            by Abdul-Kadir Coskun
        </footer>
    );
}
