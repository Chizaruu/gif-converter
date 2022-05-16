import styles from "./Nav.module.scss";

export function Nav() {
    return (
        <nav className={styles.navbar}>
            <a
                className={styles.navbar__link}
                href="https://chizaruu.github.io/"
                title="Hello World!"
            >
                &lt;Abdul Kadir Coskun /&gt; - My Utilities
            </a>
            <input id={styles.hamburger_toggle} type="checkbox" />
            <label
                className={styles.navbar__hamburger_container}
                htmlFor={styles.hamburger_toggle}
            >
                <div
                    className={styles.navbar__hamburger_container_button}
                ></div>
            </label>
            <ul className={styles.navbar__list}>
                <li className={styles.navbar__list__item}>
                    <a
                        className={styles.navbar__list__item__link}
                        href="/"
                        title="Psst, You want some conversion?"
                    >
                        Gif Converter
                    </a>
                </li>
                <li className={styles.navbar__list__item}>
                    <a
                        className={styles.navbar__list__item__link}
                        href="https://chizaruu.github.io/morse-code-translator"
                        title="- .. -- . / - --- / - .-. .- -. ... .-.. .- - . -.-.--"
                    >
                        Morse Code Translator
                    </a>
                </li>
            </ul>
        </nav>
    );
}
