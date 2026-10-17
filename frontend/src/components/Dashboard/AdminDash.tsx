import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Package2,
  RefreshCw,
  CheckCircle2,
  Truck,
  Search,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";
// import { useAuth } from "../Context/AuthContext"; // optional guard
// import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL as string;
const api = axios.create({ baseURL: API_URL, withCredentials: true });

type OrderStatus = "PENDING" | "APPROVED" | "SHIPPED" | "CANCELLED";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  imageUrl?: string;
};

type Address = {
  line1?: string; line2?: string; city?: string; state?: string; postalCode?: string; country?: string;
};

type Order = {
  _id: string;
  userId: string;
  user?: { username?: string; email?: string };
  items: OrderItem[];
  subtotal?: number;
  shipping?: number;
  tax?: number;
  total: number;
  status: OrderStatus;
  shippingAddress?: Address;
  shippingCarrier?: string;
  trackingNumber?: string;
  shippedAt?: string;
  createdAt: string;
  updatedAt: string;
};

function money(n: number | undefined) {
  if (typeof n !== "number") return "—";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

function fmtDate(s?: string) {
  if (!s) return "—";
  try { return new Date(s).toLocaleString(); } catch { return s; }
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, string> = {
    PENDING: "bg-amber-100 text-amber-800 border-amber-200",
    APPROVED: "bg-blue-100 text-blue-800 border-blue-200",
    SHIPPED: "bg-emerald-100 text-emerald-800 border-emerald-200",
    CANCELLED: "bg-rose-100 text-rose-800 border-rose-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${map[status]}`}>
      {status}
    </span>
  );
}

type ShipModalProps = {
  order: Order | null;
  onClose: () => void;
  onSubmit: (carrier: string, tracking: string) => Promise<void>;
  inFlight: boolean;
};

function ShipModal({ order, onClose, onSubmit, inFlight }: ShipModalProps) {
  const [carrier, setCarrier] = useState("");
  const [tracking, setTracking] = useState("");

  useEffect(() => {
    if (order) {
      setCarrier(order.shippingCarrier ?? "");
      setTracking(order.trackingNumber ?? "");
    }
  }, [order]);

  if (!order) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-md rounded-xl bg-white shadow-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Mark as Shipped</h3>
          <button className="p-1 rounded hover:bg-gray-100" onClick={onClose}><X size={18} /></button>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Order <span className="font-mono">{order._id}</span>
        </p>
        <label className="block text-sm font-medium mb-1">Carrier</label>
        <input
          className="w-full border rounded-md px-3 py-2 mb-3"
          placeholder="e.g. UPS, USPS, FedEx"
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
        />
        <label className="block text-sm font-medium mb-1">Tracking Number</label>
        <input
          className="w-full border rounded-md px-3 py-2 mb-4"
          placeholder="e.g. 1Z999AA10123456784"
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
        />
        <button
          disabled={!carrier || !tracking || inFlight}
          onClick={() => onSubmit(carrier.trim(), tracking.trim())}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 disabled:opacity-50"
        >
          <Truck size={16} /> {inFlight ? "Updating…" : "Confirm & Notify Customer"}
        </button>
      </div>
    </>
  );
}

const AdminOrders: React.FC = () => {
  // const { isAdmin } = useAuth(); const navigate = useNavigate();
  // useEffect(() => { if (!isAdmin) navigate("/dashboard/overview"); }, [isAdmin]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [status, setStatus] = useState<"ALL" | OrderStatus>("ALL");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  const [inFlightIds, setInFlightIds] = useState<Set<string>>(new Set());
  const [shipTarget, setShipTarget] = useState<Order | null>(null);

  const debouncedQuery = useDebounced(query, 400);

  const params = useMemo(() => {
    const out: Record<string, any> = { page, limit };
    if (status !== "ALL") out.status = status;
    if (debouncedQuery) out.q = debouncedQuery;
    return out;
  }, [page, limit, status, debouncedQuery]);

  async function fetchOrders() {
    setLoading(true);
    setErr("");
    try {
      const { data } = await api.get("/admin/orders", { params });
      const list: Order[] = Array.isArray(data) ? data : data.orders ?? [];
      setOrders(list);
      setTotal(Array.isArray(data) ? list.length : data.total ?? list.length);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.status, params.q]);

  function markInFlight(id: string, on: boolean) {
    setInFlightIds((prev) => {
      const next = new Set(prev);
      on ? next.add(id) : next.delete(id);
      return next;
    });
  }

  async function approveOrder(order: Order) {
    if (order.status !== "PENDING") return;
    const id = order._id;
    if (inFlightIds.has(id)) return;

    // optimistic
    markInFlight(id, true);
    setOrders((prev) => prev.map(o => o._id === id ? { ...o, status: "APPROVED" } : o));

    try {
      await api.patch(`/admin/orders/${id}/status`, { status: "APPROVED" });
      toast.success(`Order ${id} approved`);
    } catch (e) {
      // rollback
      setOrders((prev) => prev.map(o => o._id === id ? { ...o, status: "PENDING" } : o));
      toast.error("Failed to approve order");
    } finally {
      markInFlight(id, false);
    }
  }

  async function shipOrder(carrier: string, tracking: string) {
    if (!shipTarget) return;
    const id = shipTarget._id;
    if (inFlightIds.has(id)) return;

    markInFlight(id, true);
    setOrders((prev) =>
      prev.map(o => o._id === id ? { ...o, status: "SHIPPED", shippingCarrier: carrier, trackingNumber: tracking, shippedAt: new Date().toISOString() } : o)
    );

    try {
      await api.patch(`/admin/orders/${id}/status`, {
        status: "SHIPPED",
        shippingCarrier: carrier,
        trackingNumber: tracking,
      });
      toast.success(`Order ${id} marked as shipped`);
      setShipTarget(null);
    } catch (e) {
      // rollback
      setOrders((prev) => prev.map(o => o._id === id ? { ...o, status: "APPROVED", shippingCarrier: undefined, trackingNumber: undefined, shippedAt: undefined } : o));
      toast.error("Failed to mark as shipped");
    } finally {
      markInFlight(id, false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Package2 className="text-gray-800" />
          <h1 className="text-2xl font-semibold">Admin · Orders</h1>
        </div>
        <button
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-50"
          onClick={fetchOrders}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order id, username, email…"
            className="w-full pl-9 pr-3 py-2 border rounded-md"
          />
        </div>
        <div className="flex gap-2">
          {(["ALL", "PENDING", "APPROVED", "SHIPPED", "CANCELLED"] as const).map(s => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-2 rounded-md border ${status === s ? "bg-black text-white" : "hover:bg-gray-50"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Errors */}
      {!!err && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
          <AlertTriangle size={16} /> {err}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3">Order</th>
              <th className="text-left px-4 py-3">Customer</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Items</th>
              <th className="text-left px-4 py-3">Total</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">Loading orders…</td>
              </tr>
            )}

            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                  No orders found.
                </td>
              </tr>
            )}

            {!loading && orders.map((o) => {
              const itemsCount = o.items?.reduce((acc, it) => acc + (it.qty || 0), 0) || 0;
              const busy = inFlightIds.has(o._id);
              return (
                <tr key={o._id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px]">{o._id}</span>
                      <button
                        title="Details"
                        className="p-1 rounded hover:bg-gray-100"
                        onClick={() => toast(<div className='text-sm'>
                          <div className="font-semibold mb-1">Order Details</div>
                          <div><b>Address:</b> {o.shippingAddress?.line1 ?? "—"} {o.shippingAddress?.city} {o.shippingAddress?.state} {o.shippingAddress?.postalCode}</div>
                          <div><b>Carrier:</b> {o.shippingCarrier ?? "—"}</div>
                          <div><b>Tracking:</b> {o.trackingNumber ?? "—"}</div>
                        </div>, { duration: 4000 })}
                      >
                        <Info size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">{o.user?.username ?? "—"}<div className="text-xs text-gray-500">{o.user?.email ?? ""}</div></td>
                  <td className="px-4 py-3">{fmtDate(o.createdAt)}</td>
                  <td className="px-4 py-3">{itemsCount}</td>
                  <td className="px-4 py-3 font-medium">{money(o.total)}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {o.status === "PENDING" && (
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border hover:bg-gray-50 disabled:opacity-50"
                          onClick={() => approveOrder(o)}
                          disabled={busy}
                        >
                          <CheckCircle2 size={16} /> Approve
                        </button>
                      )}
                      {o.status === "APPROVED" && (
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border hover:bg-gray-50 disabled:opacity-50"
                          onClick={() => setShipTarget(o)}
                          disabled={busy}
                        >
                          <Truck size={16} /> Mark as Shipped
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Page {page} of {totalPages} · {total} total
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 rounded-md border hover:bg-gray-50 disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="px-3 py-1.5 rounded-md border hover:bg-gray-50 disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>

      {/* Ship modal */}
      <ShipModal
        order={shipTarget}
        onClose={() => setShipTarget(null)}
        inFlight={shipTarget ? inFlightIds.has(shipTarget._id) : false}
        onSubmit={shipOrder}
      />
    </div>
  );
};

export default AdminOrders;

/** Small debounce hook to keep search snappy without spamming the server */
function useDebounced<T>(value: T, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}
