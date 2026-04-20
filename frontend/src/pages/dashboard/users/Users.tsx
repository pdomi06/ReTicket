import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react';
import { apiFetch } from '../../../lib/apiFetch';
import { usePageLoading } from '../../../contexts/loading/LoadingContext';
import Input from '../../../components/ui/input/Input';
import Button from '../../../components/ui/button/Button';
import Select from '../../../components/ui/select/Select';
import Modal from '../../../components/ui/modal/Modal';
import styles from './Users.module.css';
import { getRoleColor, getKycColor, getStatusColor, getVerifiedColor } from './colorUtils';
import { getInitials, formatRelativeTime, formatCurrency } from './formatUtils';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: 'vendor' | 'organizer' | 'admin';
    balance: number;
    isActive: boolean;
    isVerified: boolean;
    isOnline: boolean;
    kycStatus: 'pending' | 'approved' | 'rejected';
    lastLogin: string | null;
    created_at: string;
}

interface UsersResponse {
    success: boolean;
    data: {
        users: User[];
        stats: {
            totalUsers: number;
            activeUsers: number;
            suspendedUsers: number;
            pendingKyc: number;
        };
    };
}

const Users = () => {
    const trackPageLoading = usePageLoading();
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);


    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        role: 'all',
        kycStatus: 'all',
        accountStatus: 'all',
        verification: 'all',
    });

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState<Partial<User>>({});
    const [actionMenuUser, setActionMenuUser] = useState<number | null>(null);

    const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchAllUsers = useCallback(async () => {
        trackPageLoading(
            (async () => {
                try {
                    const response = await apiFetch(`${VITE_API_BASE_URL}/users/all`);
                    if (!response.ok) throw new Error('Failed to fetch users');

                    const payload = (await response.json()) as UsersResponse;
                    setAllUsers(payload.data.users);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            })()
        );
    }, [VITE_API_BASE_URL, trackPageLoading]);

    useEffect(() => {
        void fetchAllUsers();
    }, [fetchAllUsers]);

    useEffect(() => {
        let filtered = allUsers;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (user) =>
                    user.name.toLowerCase().includes(query) ||
                    user.email.toLowerCase().includes(query)
            );
        }

        if (filters.role !== 'all' && filters.role !== '') {
            filtered = filtered.filter((user) => user.role === filters.role);
        }

        if (filters.kycStatus !== 'all' && filters.kycStatus !== '') {
            filtered = filtered.filter((user) => user.kycStatus === filters.kycStatus);
        }

        if (filters.accountStatus !== 'all' && filters.accountStatus !== '') {
            if (filters.accountStatus === 'active') {
                filtered = filtered.filter((user) => user.isActive);
            } else if (filters.accountStatus === 'suspended') {
                filtered = filtered.filter((user) => !user.isActive);
            }
        }

        if (filters.verification !== 'all' && filters.verification !== '') {
            const isVerified = filters.verification === 'verified';
            filtered = filtered.filter((user) => user.isVerified === isVerified);
        }

        setFilteredUsers(filtered);
    }, [allUsers, searchQuery, filters]);

    const handleClearFilters = () => {
        setFilters({
            role: 'all',
            kycStatus: 'all',
            accountStatus: 'all',
            verification: 'all',
        });
        setSearchQuery('');
    };

    const handleOpenDetail = useCallback((user: User) => {
        setSelectedUser(user);
        setDetailModalOpen(true);
        setActionMenuUser(null);
    }, []);

    const handleOpenEdit = useCallback((user: User) => {
        setSelectedUser(user);
        setEditFormData({ ...user });
        setEditModalOpen(true);
        setActionMenuUser(null);
    }, []);

    const handleSaveEdit = async () => {
        if (!selectedUser) return;

        try {
            const response = await apiFetch(`${VITE_API_BASE_URL}/users/${selectedUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editFormData),
            });

            if (!response.ok) throw new Error('Failed to update user');

            // Update the user in allUsers state
            const updatedUsers = allUsers.map((u) =>
                u.id === selectedUser.id ? { ...u, ...editFormData } : u
            );
            setAllUsers(updatedUsers);
            setEditModalOpen(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleToggleActive = useCallback(async (targetUser: User | null = selectedUser) => {
        if (!targetUser) return;

        try {
            const newActiveStatus = !targetUser.isActive;
            const response = await apiFetch(`${VITE_API_BASE_URL}/users/${targetUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: newActiveStatus }),
            });

            if (!response.ok) throw new Error('Failed to toggle user status');

            setAllUsers((previousUsers) => previousUsers.map((user) =>
                user.id === targetUser.id ? { ...user, isActive: newActiveStatus } : user
            ));
            setActionMenuUser(null);
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    }, [VITE_API_BASE_URL, selectedUser]);

    const handleDeleteUser = useCallback(async (targetUser: User | null = selectedUser) => {
        if (!targetUser) return;

        try {
            const response = await apiFetch(`${VITE_API_BASE_URL}/users/${targetUser.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete user');

            setAllUsers((previousUsers) => previousUsers.filter((user) => user.id !== targetUser.id));
            setActionMenuUser(null);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }, [VITE_API_BASE_URL, selectedUser]);

    const usersById = useMemo(() => {
        const usersMap = new Map<number, User>();
        filteredUsers.forEach((user) => {
            usersMap.set(user.id, user);
        });
        return usersMap;
    }, [filteredUsers]);

    const getUserIdFromButton = useCallback((button: HTMLButtonElement) => {
        const userId = Number(button.dataset.userId);
        return Number.isFinite(userId) ? userId : null;
    }, []);

    const getUserFromButton = useCallback((button: HTMLButtonElement) => {
        const userId = getUserIdFromButton(button);
        if (userId === null) {
            return null;
        }

        return usersById.get(userId) ?? null;
    }, [getUserIdFromButton, usersById]);

    const handleOpenDetailClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        const user = getUserFromButton(event.currentTarget);
        if (!user) {
            return;
        }

        handleOpenDetail(user);
    }, [getUserFromButton, handleOpenDetail]);

    const handleOpenEditClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        const user = getUserFromButton(event.currentTarget);
        if (!user) {
            return;
        }

        handleOpenEdit(user);
    }, [getUserFromButton, handleOpenEdit]);

    const handleActionMenuToggleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        const userId = getUserIdFromButton(event.currentTarget);
        if (userId === null) {
            return;
        }

        setActionMenuUser((currentUserId) => (currentUserId === userId ? null : userId));
    }, [getUserIdFromButton]);

    const handleToggleActiveMenuClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        const user = getUserFromButton(event.currentTarget);
        if (!user) {
            return;
        }

        setSelectedUser(user);
        void handleToggleActive(user);
    }, [getUserFromButton, handleToggleActive]);

    const handleChangeRoleMenuClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        const user = getUserFromButton(event.currentTarget);
        if (!user) {
            return;
        }

        setSelectedUser(user);
        handleOpenEdit(user);
    }, [getUserFromButton, handleOpenEdit]);

    const handleDeleteUserMenuClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        const user = getUserFromButton(event.currentTarget);
        if (!user) {
            return;
        }

        setSelectedUser(user);
        void handleDeleteUser(user);
    }, [getUserFromButton, handleDeleteUser]);

    return (
        <div className={styles.usersContainer}>
            <div className={styles.headerSection}>
                <h1>Users</h1>
            </div>

            <div className={styles.filtersSection}>
                <div className={styles.filterGroup}>
                    <div className={styles.searchField}>
                        <Input
                            type="text"
                            label="Search by name or email..."
                            name="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            theme="dark"
                            size="medium"
                        />
                    </div>

                    <div className={styles.filterField}>
                        <Select
                            label="Role"
                            name="role"
                            value={filters.role}
                            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                            theme="dark"
                            size="medium"
                        >
                            <option value=""></option>
                            <option value="all">All Roles</option>
                            <option value="vendor">Vendor</option>
                            <option value="organizer">Organizer</option>
                            <option value="admin">Admin</option>
                        </Select>
                    </div>

                    <div className={styles.filterField}>
                        <Select
                            label="KYC Status"
                            name="kycStatus"
                            value={filters.kycStatus}
                            onChange={(e) => setFilters({ ...filters, kycStatus: e.target.value })}
                            theme="dark"
                            size="medium"
                        >
                            <option value=""></option>
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </Select>
                    </div>

                    <div className={styles.filterField}>
                        <Select
                            label="Account Status"
                            name="accountStatus"
                            value={filters.accountStatus}
                            onChange={(e) => setFilters({ ...filters, accountStatus: e.target.value })}
                            theme="dark"
                            size="medium"
                        >
                            <option value=""></option>
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                        </Select>
                    </div>

                    <div className={styles.filterField}>
                        <Select
                            label="Verification"
                            name="verification"
                            value={filters.verification}
                            onChange={(e) => setFilters({ ...filters, verification: e.target.value })}
                            theme="dark"
                            size="medium"
                        >
                            <option value=""></option>
                            <option value="all">All</option>
                            <option value="verified">Verified</option>
                            <option value="unverified">Unverified</option>
                        </Select>
                    </div>

                    {(searchQuery || filters.role !== 'all' || filters.kycStatus !== 'all' || filters.accountStatus !== 'all' || filters.verification !== 'all') && (
                        <div>
                            <Button
                                text="Clear"
                                variant="outline"
                                onClick={handleClearFilters}
                            />
                        </div>
                    )}
                </div>
                <p className={styles.resultCount}>
                    Showing {filteredUsers.length} of {allUsers.length} users
                </p>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>KYC</th>
                            <th>Balance</th>
                            <th>Status</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className={styles.userCell}>
                                        <div
                                            className={styles.avatar}
                                            style={{
                                                background: 'var(--color-accent-surface-soft)',
                                                border: '1px solid var(--color-accent-border)',
                                            }}
                                        >
                                            {getInitials(user.name)}
                                        </div>
                                        <div>
                                            <div className={styles.userName}>{user.name}</div>
                                            <div className={styles.userEmail}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div
                                        className={styles.badge}
                                        style={getRoleColor(user.role)}
                                    >
                                        {user.role}
                                    </div>
                                </td>
                                <td>
                                    <div
                                        className={styles.badge}
                                        style={getKycColor(user.kycStatus)}
                                    >
                                        {user.kycStatus}
                                    </div>
                                </td>
                                <td className={styles.balanceCell}>
                                    <span style={{ color: user.balance > 0 ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                                        {formatCurrency(user.balance)}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.statusPills}>
                                        <div
                                            className={styles.badge}
                                            style={getStatusColor(user.isActive)}
                                        >
                                            {user.isActive ? 'Active' : 'Suspended'}
                                        </div>
                                        <div
                                            className={styles.badge}
                                            style={getVerifiedColor(user.isVerified)}
                                        >
                                            {user.isVerified ? 'Verified' : 'Unverified'}
                                        </div>
                                    </div>
                                </td>
                                <td className={styles.lastLoginCell}>
                                    {formatRelativeTime(user.lastLogin)}
                                </td>
                                <td>
                                    <div className={styles.actionButtons}>
                                        <button
                                            className={styles.iconButton}
                                            data-user-id={user.id}
                                            onClick={handleOpenDetailClick}
                                            title="View user details"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            className={styles.iconButton}
                                            data-user-id={user.id}
                                            onClick={handleOpenEditClick}
                                            title="Edit user"
                                        >
                                            ✏️
                                        </button>
                                        <div className={styles.dropdownContainer}>
                                            <button
                                                className={styles.iconButton}
                                                data-user-id={user.id}
                                                onClick={handleActionMenuToggleClick}
                                                title="More actions"
                                            >
                                                ⋯
                                            </button>
                                            {actionMenuUser === user.id && (
                                                <div className={styles.dropdown}>
                                                    <button data-user-id={user.id} onClick={handleToggleActiveMenuClick}>
                                                        {user.isActive ? 'Suspend' : 'Activate'}
                                                    </button>
                                                    <button data-user-id={user.id} onClick={handleChangeRoleMenuClick}>
                                                        Change Role
                                                    </button>
                                                    <button
                                                        className={styles.danger}
                                                        data-user-id={user.id}
                                                        onClick={handleDeleteUserMenuClick}
                                                    >
                                                        Delete User
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                title={selectedUser?.name}
                size="md"
                confirmText="Edit User"
                cancelText="Close"
                onConfirm={() => {
                    if (!selectedUser) {
                        return;
                    }
                    setDetailModalOpen(false);
                    handleOpenEdit(selectedUser);
                }}
            >
                {selectedUser && (
                    <div className={styles.detailModal}>
                        <div className={styles.modalHeader}>
                            <div
                                className={styles.largeAvatar}
                                style={{
                                    background: 'var(--color-accent-surface-soft)',
                                    border: '2px solid var(--color-accent-border)',
                                }}
                            >
                                {getInitials(selectedUser.name)}
                                {selectedUser.isOnline && <div className={styles.onlineIndicator} />}
                            </div>
                            <div>
                                <h3>{selectedUser.name}</h3>
                                <p>{selectedUser.email}</p>
                                <div
                                    className={styles.badge}
                                    style={getRoleColor(selectedUser.role)}
                                >
                                    {selectedUser.role}
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalColumns}>
                            <div className={styles.modalColumn}>
                                <h4>Account Info</h4>
                                <div className={styles.modalField}>
                                    <label>Balance</label>
                                    <div>{formatCurrency(selectedUser.balance)}</div>
                                </div>
                                <div className={styles.modalField}>
                                    <label>KYC Status</label>
                                    <div
                                        className={styles.badge}
                                        style={getKycColor(selectedUser.kycStatus)}
                                    >
                                        {selectedUser.kycStatus}
                                    </div>
                                </div>
                                <div className={styles.modalField}>
                                    <label>Account Status</label>
                                    <div
                                        className={styles.badge}
                                        style={getStatusColor(selectedUser.isActive)}
                                    >
                                        {selectedUser.isActive ? 'Active' : 'Suspended'}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.modalColumn}>
                                <h4>Security & Contact</h4>
                                <div className={styles.modalField}>
                                    <label>Phone</label>
                                    <div>{selectedUser.phone || '—'}</div>
                                </div>
                                <div className={styles.modalField}>
                                    <label>Email Verified</label>
                                    <div
                                        className={styles.badge}
                                        style={getVerifiedColor(selectedUser.isVerified)}
                                    >
                                        {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                                    </div>
                                </div>
                                <div className={styles.modalField}>
                                    <label>Member Since</label>
                                    <div>{new Date(selectedUser.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Edit User"
                size="md"
                confirmText="Save Changes"
                cancelText="Cancel"
                onConfirm={handleSaveEdit}
            >
                {selectedUser && (
                    <div className={styles.editModal}>
                        <Input
                            type="text"
                            label="Name"
                            name="name"
                            value={editFormData.name || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            theme="dark"
                            size="medium"
                        />
                        <Input
                            type="email"
                            label="Email"
                            name="email"
                            value={editFormData.email || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                            theme="dark"
                            size="medium"
                        />
                        <Input
                            type="tel"
                            label="Phone"
                            name="phone"
                            value={editFormData.phone || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                            theme="dark"
                            size="medium"
                        />
                        <Select
                            label="Role"
                            name="role"
                            value={editFormData.role || 'vendor'}
                            onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as 'vendor' | 'organizer' | 'admin' })}
                            theme="dark"
                            size="medium"
                        >
                            <option value=""></option>
                            <option value="vendor">Vendor</option>
                            <option value="organizer">Organizer</option>
                            <option value="admin">Admin</option>
                        </Select>
                        <Select
                            label="KYC Status"
                            name="kycStatus"
                            value={editFormData.kycStatus || 'pending'}
                            onChange={(e) => setEditFormData({ ...editFormData, kycStatus: e.target.value as 'pending' | 'approved' | 'rejected' })}
                            theme="dark"
                            size="medium"
                        >
                            <option value=""></option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </Select>

                        <div className={styles.toggleGroup}>
                            <label>Account Active</label>
                            <input
                                type="checkbox"
                                checked={editFormData.isActive || false}
                                onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                                className={styles.toggle}
                            />
                        </div>

                        <div className={styles.toggleGroup}>
                            <label>Email Verified</label>
                            <input
                                type="checkbox"
                                checked={editFormData.isVerified || false}
                                onChange={(e) => setEditFormData({ ...editFormData, isVerified: e.target.checked })}
                                className={styles.toggle}
                            />
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Users;
