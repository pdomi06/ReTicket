export type UnixTimestampInput = number | string | null | undefined;

export const toUnixSeconds = (value: string | number): number | null => {
    if (typeof value === "number") {
        if (!Number.isFinite(value)) {
            return null;
        }
        return value > 9999999999 ? Math.floor(value / 1000) : Math.floor(value);
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
        return null;
    }

    if (/^\d+$/.test(trimmedValue)) {
        const numericValue = Number(trimmedValue);
        if (!Number.isFinite(numericValue)) {
            return null;
        }
        return numericValue > 9999999999 ? Math.floor(numericValue / 1000) : Math.floor(numericValue);
    }

    const parsed = new Date(trimmedValue);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return Math.floor(parsed.getTime() / 1000);
};

export const toDateFromUnix = (value: UnixTimestampInput): Date | null => {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const unixSeconds = toUnixSeconds(value);
    if (unixSeconds === null) {
        return null;
    }

    const date = new Date(unixSeconds * 1000);
    return Number.isNaN(date.getTime()) ? null : date;
};

export const toDateTimeLocalValue = (value: UnixTimestampInput): string => {
    const date = toDateFromUnix(value);
    if (!date) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const toDateInputValue = (value: UnixTimestampInput): string => {
    const date = toDateFromUnix(value);
    if (!date) {
        return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const formatUnixDate = (value: UnixTimestampInput, locale = "en-US"): string => {
    const date = toDateFromUnix(value);
    if (!date) {
        return "-";
    }

    return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const formatUnixDateTime = (value: UnixTimestampInput, locale = "en-US"): string => {
    const date = toDateFromUnix(value);
    if (!date) {
        return "-";
    }

    return date.toLocaleString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
