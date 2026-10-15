import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
// import { getExchangeHistory, createExchangeRequest } from '../../services/shiftExchangeService'; // Mock service
// import FormInput from '../../components/FormInput'; // Tuỳ vào thiết kế của component này

export default function ShiftExchangePage() {
  // === STATE MANAGEMENT ===
  const [activeTab, setActiveTab] = useState('create'); // 'create' | 'history'
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  // Data States
  const [myShifts, setMyShifts] = useState([]);
  const [colleagueShifts, setColleagueShifts] = useState([]);
  const [historyData, setHistoryData] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    myShiftId: '',
    colleagueShiftId: '',
    reason: ''
  });

  // === EFFECTS (MOCK API CALLS) ===
  useEffect(() => {
    // Giả lập gọi API lấy danh sách ca của mình và ca của người khác
    const fetchSelectOptions = async () => {
      // Dựa theo ảnh "image 3.pdf", mock` data cho các ca làm việc
      setMyShifts([
        { id: '1', label: 'Thứ 3 - Sáng (08:00 - 12:00)' },
        { id: '2', label: 'Thứ 5 - Tối (17:00 - 22:00)' }
      ]);
      setColleagueShifts([
        { id: '101', label: 'Trần Văn Nam - Thứ 3 Chiều (12:00 - 17:00)' },
        { id: '102', label: 'Lê Văn Bình - Thứ 6 Sáng (08:00 - 12:00)' }
      ]);
    };

    // Giả lập gọi API lấy lịch sử đổi ca
    const fetchHistory = async () => {
      setHistoryData([
        { id: 'REQ1', date: '21/09/2026', myShift: 'Thứ 3 (Sáng)', targetShift: 'Thứ 3 (Chiều)', targetPerson: 'Trần Văn Nam', status: 'Chờ người kia duyệt' },
        { id: 'REQ2', date: '19/09/2026', myShift: 'Thứ 7 (Tối)', targetShift: 'Chủ Nhật (Sáng)', targetPerson: 'Mai Thị Lan', status: 'Chờ Manager duyệt' },
        { id: 'REQ3', date: '15/09/2026', myShift: 'Thứ 2 (Sáng)', targetShift: 'Thứ 2 (Chiều)', targetPerson: 'Lê Hoàng Anh', status: 'Đã duyệt' },
        { id: 'REQ4', date: '10/09/2026', myShift: 'Thứ 5 (Sáng)', targetShift: 'Thứ 5 (Tối)', targetPerson: 'Nguyễn Thị Hà', status: 'Từ chối' },
      ]);
    };

    fetchSelectOptions();
    fetchHistory();
  }, []);

  // === HANDLERS ===
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.myShiftId || !formData.colleagueShiftId) {
      alert("Vui lòng chọn đầy đủ ca làm việc cần đổi.");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const confirmExchange = () => {
    // Giả lập logic gửi API createExchangeRequest(formData)
    console.log("Đã gửi yêu cầu đổi ca:", formData);
    
    // Đóng modal, reset form và chuyển sang tab lịch sử
    setIsConfirmModalOpen(false);
    setFormData({ myShiftId: '', colleagueShiftId: '', reason: '' });
    setActiveTab('history');
    
    // Có thể reload lại data lịch sử ở đây
    alert("Gửi yêu cầu thành công!");
  };

  // Helper hàm lấy class màu cho badge trạng thái
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Chờ người kia duyệt': return 'bg-yellow-100 text-yellow-800';
      case 'Chờ Manager duyệt': return 'bg-orange-100 text-orange-800';
      case 'Đã duyệt': return 'bg-green-100 text-green-800';
      case 'Từ chối': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // === RENDER HELPERS ===
  const renderCreateTab = () => (
    <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Tạo yêu cầu mới</h2>
      <form onSubmit={handleSubmitForm} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ca của bạn</label>
          <select 
            name="myShiftId"
            value={formData.myShiftId}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">-- Chọn ca làm việc của bạn --</option>
            {myShifts.map(shift => (
              <option key={shift.id} value={shift.id}>{shift.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ca của người được đổi</label>
          <select 
            name="colleagueShiftId"
            value={formData.colleagueShiftId}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">-- Chọn ca của đồng nghiệp --</option>
            {colleagueShifts.map(shift => (
              <option key={shift.id} value={shift.id}>{shift.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lý do đổi ca</label>
          <textarea 
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            rows="3"
            placeholder="Ví dụ: Mình có việc cá nhân, mong bạn hỗ trợ. Cảm ơn nhiều!"
            className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6">
            Gửi yêu cầu đổi ca
          </Button>
        </div>
      </form>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày gửi</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ca của tôi</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ca đổi</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người đổi</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {historyData.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.myShift}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.targetShift}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.targetPerson}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
          {historyData.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Chưa có dữ liệu đổi ca.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // === MAIN JSX ===
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Yêu cầu đổi ca</h1>
        <p className="text-gray-500 mt-1">Quản lý và tạo các yêu cầu thay đổi lịch làm việc của bạn.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('create')}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'create' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Tạo yêu cầu
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'history' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Lịch sử đổi ca
        </button>
      </div>

      {/* Content */}
      <div className="mb-8">
        {activeTab === 'create' ? renderCreateTab() : renderHistoryTab()}
      </div>

      {/* Confirmation Modal */}
      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} title="Xác nhận yêu cầu đổi ca">
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Bạn có chắc chắn muốn gửi yêu cầu đổi ca này không? Người được chọn sẽ nhận được thông báo để xác nhận.
          </p>
          <div className="bg-gray-50 p-3 rounded-md text-sm mb-6 border border-gray-200">
            <p><span className="font-medium">Ca của bạn:</span> {myShifts.find(s => s.id === formData.myShiftId)?.label}</p>
            <p className="mt-2"><span className="font-medium">Ca đổi với:</span> {colleagueShifts.find(s => s.id === formData.colleagueShiftId)?.label}</p>
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={confirmExchange} className="bg-blue-600 hover:bg-blue-700 text-white">
              Xác nhận gửi
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}