import { useIsPageLoading } from "../../contexts/loading/LoadingContext";
import styles from "./PageLoader.module.css";
import LoadingScreen from "./LoadingScreen";

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
            <LoadingScreen />
        </div>
    );
}
