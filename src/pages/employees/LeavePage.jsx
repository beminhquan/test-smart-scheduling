import React, { useState } from 'react';
import Button from '../../components/Button';

export default function LeavePage() {
  const [leaveHistory, setLeaveHistory] = useState([
    { id: 1, date: '23/09', shift: 'Sáng', reason: 'Việc cá nhân', status: 'Chờ duyệt' },
    { id: 2, date: '15/09', shift: 'Chiều', reason: 'Việc gia đình', status: 'Đã duyệt' },
    { id: 3, date: '10/09', shift: 'Tối', reason: 'Ốm', status: 'Từ chối' }
  ]);

  const [formData, setFormData] = useState({
    date: '',
    shift: 'Ca sáng - 08:00-12:00',
    reason: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.reason) {
      alert('Vui lòng điền đầy đủ Ngày nghỉ và Lý do');
      return;
    }

    const dateObj = new Date(formData.date);
    const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
    
    let shortShift = 'Cả ngày';
    if (formData.shift.includes('sáng')) shortShift = 'Sáng';
    if (formData.shift.includes('chiều')) shortShift = 'Chiều';
    if (formData.shift.includes('tối')) shortShift = 'Tối';

    const newRequest = {
      id: Date.now(),
      date: formattedDate,
      shift: shortShift,
      reason: formData.reason,
      status: 'Chờ duyệt'
    };

    setLeaveHistory([newRequest, ...leaveHistory]);
    setFormData({ date: '', shift: 'Ca sáng - 08:00-12:00', reason: '', notes: '' });
    alert('Đã gửi đơn xin nghỉ thành công!');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Chờ duyệt':
        return 'bg-yellow-100 text-yellow-800';
      case 'Đã duyệt':
        return 'bg-green-100 text-green-800';
      case 'Từ chối':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Xin nghỉ</h1>
        <p className="text-gray-500 mt-1">Gửi yêu cầu xin nghỉ đến Manager để được xem xét.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Tạo đơn xin nghỉ</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nghỉ</label>
              <input 
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ca nghỉ</label>
              <select 
                name="shift"
                value={formData.shift}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="Ca sáng - 08:00-12:00">Ca sáng - 08:00-12:00</option>
                <option value="Ca chiều - 12:00-17:00">Ca chiều - 12:00-17:00</option>
                <option value="Ca tối - 17:00-22:00">Ca tối - 17:00-22:00</option>
                <option value="Cả ngày">Cả ngày</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lý do</label>
              <input 
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Nhập lý do xin nghỉ..."
                className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Thông tin bổ sung (nếu có)..."
                className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md">
                Gửi đơn xin nghỉ
              </Button>
            </div>
          </form>
        </div>

        <div className="md:col-span-1 bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Lịch sử đơn nghỉ</h2>
          <div className="space-y-4">
            {leaveHistory.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-900">{item.date} {item.shift}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{item.reason}</span>
              </div>
            ))}
            {leaveHistory.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Chưa có đơn xin nghỉ nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}