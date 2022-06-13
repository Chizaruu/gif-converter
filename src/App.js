import React from "react";
import styles from "./App.module.scss";
import { Header } from "./containers/Header/Header";
import { Main } from "./containers/Main/Main";
import { Nav } from "./containers/Nav/Nav";

export default function App() {
    return (
        <div className={styles.App}>
            <div className={styles.background}>
                <div className={styles.twinkling}>
                    <div className={styles.clouds}>
                        <Nav />
                        <Header />
                        <Main />
                    </div>
                </div>
            </div>
        </div>
    );
}
