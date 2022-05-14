import React from "react";
import styles from "./App.module.scss";
import { Footer } from "./containers/Footer/Footer";
import { Header } from "./containers/Header/Header";
import { Main } from "./containers/Main/Main";

export default function App() {
    return (
        <div className={styles.App}>
            <Header />
            <Main />
            <Footer />
        </div>
    );
}
