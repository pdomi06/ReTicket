import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import styles from "./Orders.module.css";
import { apiFetch } from "../../../lib/apiFetch";
import { usePageLoading } from "../../../contexts/loading/LoadingContext";
import Modal from "../../../components/ui/modal/Modal";
import Input from "../../../components/ui/input/Input";
import Select from "../../../components/ui/select/Select";
import Button from "../../../components/ui/button/Button";

interface Order {
    id: number;
    orderNumber: number;
    subtotal: number | string;
    platformFee: number | string;
    tax: number | string | null;
    status: string;
    paymentIntentId: string | null;
    paymentStatus: string | null;
    deliveryEmail: string | null;
    deliveryStatus: string | null;
    deliveredAt: string | null;
    completedAt: string | null;
    cancelledAt: string | null;
    created_at: string;
    updated_at: string;
}

interface OrderItem {
    id: number;
    orderId: number;
    ticketListingId: string;
    price: number | string;
    created_at: string;
    updated_at: string;
}

const formatMoney = (value: number | string | null | undefined) => {
    if (value === null || value === undefined || value === "") return "-";
    const numeric = typeof value === "number" ? value : Number.parseFloat(String(value));
    if (Number.isNaN(numeric)) return String(value);
    return `${numeric.toLocaleString()} Ft`;
};

const formatDateTime = (value: string | null | undefined) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
};

const Orders = () => {
    const trackPageLoading = usePageLoading();
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filters, setFilters] = useState({
        query: "",
        status: "",
        paymentStatus: "",
        deliveryStatus: "",
    });

    useEffect(() => {
        const loadDataPromise = (async () => {
            try {
                const [ordersResponse, orderItemsResponse] = await Promise.all([
                    apiFetch(`${import.meta.env.VITE_API_BASE_URL}/orders`),
                    apiFetch(`${import.meta.env.VITE_API_BASE_URL}/orderItems`),
                ]);

                if (!ordersResponse.ok) {
                    throw new Error("Failed to fetch orders");
                }

                if (!orderItemsResponse.ok) {
                    throw new Error("Failed to fetch order items");
                }

                const ordersPayload = await ordersResponse.json();
                const orderItemsPayload = await orderItemsResponse.json();

                const parsedOrders = Array.isArray(ordersPayload)
                    ? ordersPayload
                    : Array.isArray(ordersPayload?.data)
                        ? ordersPayload.data
                        : [];

                const parsedOrderItems = Array.isArray(orderItemsPayload)
                    ? orderItemsPayload
                    : Array.isArray(orderItemsPayload?.data)
                        ? orderItemsPayload.data
                        : [];

                setOrders(parsedOrders);
                setOrderItems(parsedOrderItems);
            } catch (error) {
                console.error("Error fetching orders data:", error);
            }
        })();

        void trackPageLoading(loadDataPromise);
    }, [trackPageLoading]);

    const relatedItems = useMemo(() => {
        if (!selectedOrder) return [];
        return orderItems.filter((item) => item.orderId === selectedOrder.id);
    }, [orderItems, selectedOrder]);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const query = filters.query.trim().toLowerCase();
            const queryMatches =
                !query ||
                String(order.orderNumber).toLowerCase().includes(query) ||
                String(order.deliveryEmail || "").toLowerCase().includes(query) ||
                String(order.paymentIntentId || "").toLowerCase().includes(query);

            const statusMatches = !filters.status || order.status === filters.status;
            const paymentStatusMatches = !filters.paymentStatus || order.paymentStatus === filters.paymentStatus;
            const deliveryStatusMatches = !filters.deliveryStatus || order.deliveryStatus === filters.deliveryStatus;

            return queryMatches && statusMatches && paymentStatusMatches && deliveryStatusMatches;
        });
    }, [orders, filters]);

    const uniqueStatuses = useMemo(
        () => [...new Set(orders.map((order) => order.status).filter((status): status is string => Boolean(status)))],
        [orders]
    );
    const uniquePaymentStatuses = useMemo(
        () => [...new Set(orders.map((order) => order.paymentStatus).filter((status): status is string => Boolean(status)))],
        [orders]
    );
    const uniqueDeliveryStatuses = useMemo(
        () => [...new Set(orders.map((order) => order.deliveryStatus).filter((status): status is string => Boolean(status)))],
        [orders]
    );

    const ordersById = useMemo(() => {
        const ordersMap = new Map<number, Order>();
        filteredOrders.forEach((order) => {
            ordersMap.set(order.id, order);
        });
        return ordersMap;
    }, [filteredOrders]);

    const isFiltered = filters.query || filters.status || filters.paymentStatus || filters.deliveryStatus;

    const handleClearFilters = () => {
        setFilters({
            query: "",
            status: "",
            paymentStatus: "",
            deliveryStatus: "",
        });
    };

    const handleOrderRowClick = useCallback((event: MouseEvent<HTMLTableRowElement>) => {
        const orderId = Number(event.currentTarget.dataset.orderId);
        if (!Number.isFinite(orderId)) {
            return;
        }

        setSelectedOrder(ordersById.get(orderId) ?? null);
    }, [ordersById]);

    return (
        <div className={styles.ordersContainer}>
            <div className={styles.headerSection}>
                <h1>Orders</h1>
            </div>

            <div className={styles.filtersSection}>
                <div className={styles.filterGroup}>
                    <div style={{ minWidth: "220px" }}>
                        <Input
                            type="text"
                            label="Search order/email/intent"
                            name="query"
                            value={filters.query}
                            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                            theme="dark"
                            size="medium"
                        />
                    </div>

                    <div style={{ minWidth: "180px" }}>
                        <Select
                            label="All Status"
                            name="status"
                            value={filters.status}
                            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                            theme="dark"
                            size="medium"
                        >
                            <option value="">All Status</option>
                            {uniqueStatuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </Select>
                    </div>

                    <div style={{ minWidth: "180px" }}>
                        <Select
                            label="All Payment"
                            name="paymentStatus"
                            value={filters.paymentStatus}
                            onChange={(e) => setFilters((prev) => ({ ...prev, paymentStatus: e.target.value }))}
                            theme="dark"
                            size="medium"
                        >
                            <option value="">All Payment</option>
                            {uniquePaymentStatuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </Select>
                    </div>

                    <div style={{ minWidth: "180px" }}>
                        <Select
                            label="All Delivery"
                            name="deliveryStatus"
                            value={filters.deliveryStatus}
                            onChange={(e) => setFilters((prev) => ({ ...prev, deliveryStatus: e.target.value }))}
                            theme="dark"
                            size="medium"
                        >
                            <option value="">All Delivery</option>
                            {uniqueDeliveryStatuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </Select>
                    </div>

                    {isFiltered && (
                        <div>
                            <Button text="Clear" variant="outline" onClick={handleClearFilters} />
                        </div>
                    )}
                </div>
                <p className={styles.resultCount}>
                    Showing {filteredOrders.length} of {orders.length} orders
                </p>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Subtotal</th>
                            <th>Platform Fee</th>
                            <th>Tax</th>
                            <th>Status</th>
                            <th>Payment Status</th>
                            <th>Delivery Email</th>
                            <th>Delivery Status</th>
                            <th>Delivered At</th>
                            <th>Completed At</th>
                            <th>Cancelled At</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={13} className={styles.emptyState}>
                                    {orders.length === 0 ? "No orders found" : "No orders match your filters"}
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    className={styles.clickableRow}
                                    data-order-id={order.id}
                                    onClick={handleOrderRowClick}
                                    title="Click to view order items"
                                >
                                    <td className={styles.mono}>#{order.orderNumber}</td>
                                    <td>{formatMoney(order.subtotal)}</td>
                                    <td>{formatMoney(order.platformFee)}</td>
                                    <td>{formatMoney(order.tax)}</td>
                                    <td>{order.status || "-"}</td>
                                    <td>{order.paymentStatus || "-"}</td>
                                    <td>{order.deliveryEmail || "-"}</td>
                                    <td>{order.deliveryStatus || "-"}</td>
                                    <td>{formatDateTime(order.deliveredAt)}</td>
                                    <td>{formatDateTime(order.completedAt)}</td>
                                    <td>{formatDateTime(order.cancelledAt)}</td>
                                    <td>{formatDateTime(order.created_at)}</td>
                                    <td>{formatDateTime(order.updated_at)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                title={selectedOrder ? `Order #${selectedOrder.orderNumber}` : "Order"}
                size="lg"
            >
                {selectedOrder && (
                    <div className={styles.detailsContainer}>
                        <div className={styles.detailsGrid}>
                            <div><strong>Order ID:</strong> {selectedOrder.id}</div>
                            <div><strong>Order Number:</strong> {selectedOrder.orderNumber}</div>
                            <div><strong>Subtotal:</strong> {formatMoney(selectedOrder.subtotal)}</div>
                            <div><strong>Platform Fee:</strong> {formatMoney(selectedOrder.platformFee)}</div>
                            <div><strong>Tax:</strong> {formatMoney(selectedOrder.tax)}</div>
                            <div><strong>Status:</strong> {selectedOrder.status || "-"}</div>
                            <div><strong>Payment Intent ID:</strong> {selectedOrder.paymentIntentId || "-"}</div>
                            <div><strong>Payment Status:</strong> {selectedOrder.paymentStatus || "-"}</div>
                            <div><strong>Delivery Email:</strong> {selectedOrder.deliveryEmail || "-"}</div>
                            <div><strong>Delivery Status:</strong> {selectedOrder.deliveryStatus || "-"}</div>
                            <div><strong>Delivered At:</strong> {formatDateTime(selectedOrder.deliveredAt)}</div>
                            <div><strong>Completed At:</strong> {formatDateTime(selectedOrder.completedAt)}</div>
                            <div><strong>Cancelled At:</strong> {formatDateTime(selectedOrder.cancelledAt)}</div>
                            <div><strong>Created At:</strong> {formatDateTime(selectedOrder.created_at)}</div>
                            <div><strong>Updated At:</strong> {formatDateTime(selectedOrder.updated_at)}</div>
                        </div>

                        <h3 className={styles.itemsTitle}>Related Order Items ({relatedItems.length})</h3>
                        <div className={styles.itemsTableWrapper}>
                            <table className={styles.itemsTable}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Order ID</th>
                                        <th>Ticket Listing ID</th>
                                        <th>Price</th>
                                        <th>Created At</th>
                                        <th>Updated At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {relatedItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className={styles.emptyState}>No order items found for this order</td>
                                        </tr>
                                    ) : (
                                        relatedItems.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.orderId}</td>
                                                <td className={styles.mono}>{item.ticketListingId}</td>
                                                <td>{formatMoney(item.price)}</td>
                                                <td>{formatDateTime(item.created_at)}</td>
                                                <td>{formatDateTime(item.updated_at)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Orders;