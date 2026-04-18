import { useIsPageLoading } from "../../contexts/loading/LoadingContext";
import styles from "./PageLoader.module.css";

type PageLoaderProps = {
    isEnabled?: boolean;
};

export default function PageLoader({ isEnabled = true }: PageLoaderProps) {
    const isPageLoading = useIsPageLoading();
    const shouldShowLoader = isEnabled && isPageLoading;

    return (
        <div
            className={`${styles.overlay} ${shouldShowLoader ? styles.overlayVisible : styles.overlayHidden}`}
            aria-hidden={!shouldShowLoader}
        >
            <div className={styles.loaderShell} role="status" aria-live="polite" aria-label="Page loading">
                <span className={styles.spinner} />
            </div>
        </div>
    );
}
