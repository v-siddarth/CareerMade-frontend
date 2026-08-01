"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, CheckCircle, XCircle } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { toast } from "react-hot-toast";

interface Coupon {
  _id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  usageLimit: number;
  usageCount: number;
  expiresAt?: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: "",
    discountPercentage: 100,
    isActive: true,
    usageLimit: 0,
    expiresAt: "",
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{ data: { coupons: Coupon[] } }>("/api/coupons");
      if (res.data?.coupons) {
        setCoupons(res.data.coupons);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/api/coupons", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      toast.success("Coupon created successfully");
      setShowModal(false);
      setFormData({
        code: "",
        discountPercentage: 100,
        isActive: true,
        usageLimit: 0,
        expiresAt: "",
      });
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.message || "Failed to create coupon");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await apiFetch(`/api/coupons/${id}`, { method: "DELETE" });
      toast.success("Coupon deleted");
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to delete coupon");
    }
  };

  const toggleStatus = async (coupon: Coupon) => {
    try {
      await apiFetch(`/api/coupons/${coupon._id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      toast.success("Coupon updated");
      setCoupons((prev) =>
        prev.map((c) => (c._id === coupon._id ? { ...c, isActive: !coupon.isActive } : c))
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Coupons</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create Coupon
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-900">Code</th>
                <th className="px-6 py-4 font-semibold text-gray-900">Discount</th>
                <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 font-semibold text-gray-900">Usage</th>
                <th className="px-6 py-4 font-semibold text-gray-900">Expires</th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-bold text-gray-900">{coupon.code}</td>
                  <td className="px-6 py-4">{coupon.discountPercentage}%</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(coupon)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        coupon.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {coupon.isActive ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                      {coupon.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {coupon.usageCount} / {coupon.usageLimit || "∞"}
                  </td>
                  <td className="px-6 py-4">
                    {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No coupons found. Click "Create Coupon" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Create New Coupon</h2>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 uppercase"
                  placeholder="e.g. FREE100"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Discount Percentage</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2"
                />
                <p className="mt-1 text-xs text-gray-500">Currently only 100% bypass is supported automatically.</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Usage Limit (Optional)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.usageLimit || ""}
                  onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2"
                  placeholder="0 for unlimited"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Expiration Date (Optional)</label>
                <input
                  type="date"
                  value={formData.expiresAt?.split('T')[0] || ""}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active immediately
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-4 py-2 font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
