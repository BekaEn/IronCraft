import React, { useState } from 'react';
import { FaEye, FaTrash, FaTimes } from 'react-icons/fa';
import { useGetCustomOrdersQuery, useUpdateCustomOrderMutation, useDeleteCustomOrderMutation } from '../../services/customOrdersApi';
import LoadingSpinner from '../UI/LoadingSpinner';
import toast from 'react-hot-toast';

const CustomOrdersSection: React.FC = () => {
  const { data, isLoading, refetch } = useGetCustomOrdersQuery({});
  const [updateCustomOrder] = useUpdateCustomOrderMutation();
  const [deleteCustomOrder] = useDeleteCustomOrderMutation();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-300',
    in_review: 'bg-blue-500/20 text-blue-300',
    approved: 'bg-green-500/20 text-green-300',
    in_production: 'bg-purple-500/20 text-purple-300',
    completed: 'bg-cyan-500/20 text-cyan-300',
    cancelled: 'bg-red-500/20 text-red-300',
  };

  const statusLabels: Record<string, string> = {
    pending: 'მოლოდინში',
    in_review: 'განხილვაში',
    approved: 'დამტკიცებული',
    in_production: 'წარმოებაში',
    completed: 'დასრულებული',
    cancelled: 'გაუქმებული',
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateCustomOrder({ id: orderId, data: { status: newStatus as any } }).unwrap();
      toast.success('სტატუსი განახლდა');
      refetch();
    } catch (error) {
      toast.error('სტატუსის განახლება ვერ მოხერხდა');
    }
  };

  const handleDelete = async (orderId: number) => {
    if (window.confirm('დარწმუნებული ხართ რომ გსურთ შეკვეთის წაშლა?')) {
      try {
        await deleteCustomOrder(orderId).unwrap();
        toast.success('შეკვეთა წაიშალა');
        refetch();
      } catch (error) {
        toast.error('შეკვეთის წაშლა ვერ მოხერხდა');
      }
    }
  };

  const handleUpdatePrice = async (orderId: number, price: number) => {
    try {
      await updateCustomOrder({ id: orderId, data: { estimatedPrice: price } }).unwrap();
      toast.success('ფასი განახლდა');
      refetch();
    } catch (error) {
      toast.error('ფასის განახლება ვერ მოხერხდა');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-white">ინდივიდუალური შეკვეთები</h2>
        <div className="text-blue-200">
          სულ: <span className="font-bold text-white">{data?.totalOrders || 0}</span>
        </div>
      </div>

      {!data?.orders || data.orders.length === 0 ? (
        <div className="glassmorphism-card p-12 text-center">
          <p className="text-blue-200 text-lg">ინდივიდუალური შეკვეთები არ არის</p>
        </div>
      ) : (
        <div className="glassmorphism-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase">მომხმარებელი</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase">კონტაქტი</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase">ზომა</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase">რაოდენობა</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase">სტატუსი</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase">ფასი</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-blue-200 uppercase">თარიღი</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-blue-200 uppercase">მოქმედებები</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {data.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-mono">#{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-white font-semibold">{order.customerName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-blue-200 text-sm">{order.email}</div>
                      <div className="text-blue-300 text-xs">{order.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-blue-200">
                      {order.width} × {order.height} სმ
                    </td>
                    <td className="px-6 py-4 text-white font-semibold">{order.quantity}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status]} border-0 cursor-pointer`}
                      >
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={order.estimatedPrice || ''}
                        onChange={(e) => handleUpdatePrice(order.id, parseFloat(e.target.value))}
                        placeholder="ფასი"
                        className="w-24 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm"
                      />
                    </td>
                    <td className="px-6 py-4 text-blue-200 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('ka-GE')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailsModal(true);
                          }}
                          className="text-cyan-400 hover:text-cyan-300 p-2 hover:bg-cyan-500/20 rounded-lg transition-all"
                          title="დეტალები"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/20 rounded-lg transition-all"
                          title="წაშლა"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glassmorphism-card w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-black text-white">შეკვეთა #{selectedOrder.id}</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-blue-200 hover:text-white"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-bold text-white mb-3">მომხმარებლის ინფორმაცია</h4>
                  <div className="space-y-2 text-blue-200">
                    <p><span className="font-semibold text-white">სახელი:</span> {selectedOrder.customerName}</p>
                    <p><span className="font-semibold text-white">ელ-ფოსტა:</span> {selectedOrder.email}</p>
                    <p><span className="font-semibold text-white">ტელეფონი:</span> {selectedOrder.phone}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-white mb-3">შეკვეთის დეტალები</h4>
                  <div className="space-y-2 text-blue-200">
                    <p><span className="font-semibold text-white">ზომა:</span> {selectedOrder.width} × {selectedOrder.height} სმ</p>
                    <p><span className="font-semibold text-white">რაოდენობა:</span> {selectedOrder.quantity}</p>
                    <p><span className="font-semibold text-white">სტატუსი:</span> <span className={`px-2 py-1 rounded ${statusColors[selectedOrder.status]}`}>{statusLabels[selectedOrder.status]}</span></p>
                    {selectedOrder.estimatedPrice && (
                      <p><span className="font-semibold text-white">შეფასებული ფასი:</span> {selectedOrder.estimatedPrice} ₾</p>
                    )}
                  </div>
                </div>
              </div>

              {selectedOrder.additionalDetails && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-white mb-3">დამატებითი დეტალები</h4>
                  <p className="text-blue-200 bg-white/5 p-4 rounded-lg">{selectedOrder.additionalDetails}</p>
                </div>
              )}

              <div className="mb-6">
                <h4 className="text-lg font-bold text-white mb-3">დიზაინის სურათი</h4>
                <div className="bg-white/5 p-4 rounded-lg">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}${selectedOrder.designImage}`}
                    alt="Design"
                    className="max-w-full h-auto rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="glassmorphism-button px-6 py-3 text-white"
                >
                  დახურვა
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomOrdersSection;
