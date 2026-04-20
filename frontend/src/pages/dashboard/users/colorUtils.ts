export const getRoleColor = (role: string) => {
    switch (role) {
        case 'admin':
            return { background: 'var(--color-accent-surface-soft)', border: 'var(--color-accent-border)', color: 'var(--color-accent)' };
        case 'organizer':
            return { background: 'var(--color-info-surface)', border: 'var(--color-info-border)', color: 'var(--color-info)' };
        case 'vendor':
            return { background: 'var(--color-surface-raised)', border: 'var(--color-border)', color: 'var(--color-text-secondary)' };
        default:
            return { background: 'var(--color-surface)', border: 'var(--color-border)', color: 'var(--color-text)' };
    }
};

export const getKycColor = (status: string) => {
    switch (status) {
        case 'approved':
            return { background: 'var(--color-success-surface)', border: 'var(--color-success-border)', color: 'var(--color-success)' };
        case 'pending':
            return { background: 'var(--color-warning-surface)', border: 'var(--color-warning-border)', color: 'var(--color-warning)' };
        case 'rejected':
            return { background: 'var(--color-danger-surface)', border: 'var(--color-danger-border)', color: 'var(--color-danger)' };
        default:
            return { background: 'var(--color-surface)', border: 'var(--color-border)', color: 'var(--color-text)' };
    }
};

export const getStatusColor = (isActive: boolean) => {
    if (isActive) {
        return { background: 'var(--color-success-surface)', border: 'var(--color-success-border)', color: 'var(--color-success)' };
    } else {
        return { background: 'var(--color-danger-surface)', border: 'var(--color-danger-border)', color: 'var(--color-danger)' };
    }
};

export const getVerifiedColor = (isVerified: boolean) => {
    if (isVerified) {
        return { background: 'var(--color-info-surface)', border: 'var(--color-info-border)', color: 'var(--color-info)' };
    } else {
        return { background: 'transparent', border: 'var(--color-border)', color: 'var(--color-text-disabled)' };
    }
};
