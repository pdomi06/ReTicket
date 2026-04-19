import { useIsPageLoading } from "../../contexts/loading/LoadingContext";
import styles from "./PageLoader.module.css";
import LoadingScreen from "./LoadingScreen";

type PageLoaderProps = {
    isEnabled?: boolean;
    isContained?: boolean;
    className?: string;
};

export default function PageLoader({
    isEnabled = true,
    isContained = false,
    className = "",
}: PageLoaderProps) {
    const isPageLoading = useIsPageLoading();
    const shouldShowLoader = isEnabled && isPageLoading;

    return (
        <div
            className={`${styles.overlay} ${isContained ? styles.overlayContained : ""} ${className} ${shouldShowLoader ? styles.overlayVisible : styles.overlayHidden}`}
            aria-hidden={!shouldShowLoader}
        >
            {shouldShowLoader ? <LoadingScreen /> : null}
        </div>
    );
}
