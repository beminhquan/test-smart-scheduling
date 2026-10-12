// Hàm định dạng dùng chung
export const formatDate = (d) => new Date(d).toLocaleDateString("vi-VN");
export const formatTime = (d) =>
  new Date(d).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
export const formatMoney = (n) => Number(n).toLocaleString("vi-VN") + " đ";
