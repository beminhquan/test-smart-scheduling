import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
// Giả định thư mục utils và service
// import { formatDate } from '../../utils/format'; 
// import { getMySchedule } from '../../services/scheduleService'; 

export default function MySchedulePage() {
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWeek, setCurrentWeek] = useState('22/09/2026 - 28/09/2026'); // Mock data tuần hiện tại

  // Mock API call
  useEffect(() => {
    const fetchSchedule = async () => {
      // Thay thế bằng call API thật: const data = await getMySchedule();
      const mockData = [
        { id: 1, date: '22/09/2026', day: 'T3', shift: 'Sáng', role: 'Phục vụ', time: '08:00 - 12:00', status: 'Đã xác nhận' },
        { id: 2, date: '23/09/2026', day: 'T4', shift: 'Chiều', role: 'Phục vụ', time: '12:00 - 17:00', status: 'Đã xác nhận' },
        { id: 3, date: '24/09/2026', day: 'T5', shift: 'Tối', role: 'Phục vụ', time: '17:00 - 22:00', status: 'Đã xác nhận' },
        { id: 4, date: '25/09/2026', day: 'T6', shift: 'Sáng', role: 'Phục vụ', time: '08:00 - 12:00', status: 'Đã xác nhận' },
        { id: 5, date: '26/09/2026', day: 'T7', shift: 'Chiều', role: 'Phục vụ', time: '12:00 - 17:00', status: 'Đã xác nhận' },
      ];
      setScheduleData(mockData);
    };

    fetchSchedule();
  }, []);

  const handleShiftClick = (shift) => {
    setSelectedShift(shift);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedShift(null);
  };

  const handleRequestExchange = () => {
    // Logic để mở trang/modal đổi ca
    console.log('Yêu cầu đổi ca:', selectedShift);
    closeModal();
    // alert('Tính năng đang phát triển');
  };

  // Mock days of the week
  const daysOfWeek = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const shifts = ['Sáng', 'Chiều', 'Tối'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lịch làm việc</h1>
          <p className="text-gray-500 mt-1">Xem lịch làm việc chi tiết của bạn.</p>
        </div>
        <div className="flex bg-gray-200 rounded-lg p-1 mt-4 md:mt-0">
          <button className="px-4 py-2 bg-white rounded-md shadow-sm text-sm font-medium text-gray-900">
            Lịch của tôi
          </button>
          <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700">
            Lịch toàn bộ
          </button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center space-x-4 mb-6">
        <span className="text-gray-700 font-medium">{currentWeek}</span>
        <button className="text-gray-500 hover:text-gray-700 font-medium text-sm">
          &lt; Tuần trước
        </button>
        <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md font-medium text-sm">
          Tuần này
        </button>
        <button className="text-gray-500 hover:text-gray-700 font-medium text-sm">
          Tuần sau &gt;
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-b border-gray-200">
                Ca
              </th>
              {daysOfWeek.map((day) => (
                <th key={day} className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-r border-gray-200 last:border-r-0">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shifts.map((shiftName) => (
              <tr key={shiftName}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                  {shiftName}
                </td>
                {daysOfWeek.map((day) => {
                  const shift = scheduleData.find((s) => s.day === day && s.shift === shiftName);
                  return (
                    <td key={`${shiftName}-${day}`} className="px-2 py-2 border-r border-gray-200 last:border-r-0 h-24 align-top w-32">
                      {shift ? (
                        <div 
                          onClick={() => handleShiftClick(shift)}
                          className="bg-blue-50 border border-blue-200 rounded p-2 cursor-pointer hover:bg-blue-100 transition-colors h-full flex flex-col justify-between"
                        >
                          <div>
                             <p className="text-xs font-semibold text-blue-800">{shift.role}</p>
                             <p className="text-xs text-blue-600 mt-1">{shift.time}</p>
                          </div>
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800 mt-2 self-start">
                             {shift.status}
                          </span>
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Shift Details Modal */}
      {selectedShift && (
         <Modal isOpen={isModalOpen} onClose={closeModal} title="Chi tiết ca">
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {`Thứ ${selectedShift.day.replace('T', '')} - ${selectedShift.date}`}
              </h3>
              <div className="space-y-2 mb-6">
                <p className="text-sm"><span className="font-semibold">Ca:</span> {selectedShift.shift} ({selectedShift.time})</p>
                <p className="text-sm"><span className="font-semibold">Vai trò:</span> {selectedShift.role}</p>
                <p className="text-sm flex items-center">
                  <span className="font-semibold mr-2">Trạng thái:</span> 
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {selectedShift.status}
                  </span>
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={closeModal}>
                  Đóng
                </Button>
                <Button onClick={handleRequestExchange} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Yêu cầu đổi ca
                </Button>
              </div>
            </div>
         </Modal>
      )}
    </div>
  );
}