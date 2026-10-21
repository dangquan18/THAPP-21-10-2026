const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** Định dạng thời gian ngắn gọn cho danh sách: 14:05 / Hôm qua / 12/10 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const today = startOfDay(new Date());
  const day = startOfDay(date);
  const diffDays = Math.round((today - day) / 86400000);

  if (diffDays === 0) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  if (diffDays === 1) {
    return 'Hôm qua';
  }
  if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  }
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
}

/** Giờ:phút cho bong bóng chat */
export function formatClock(timestamp: number): string {
  const date = new Date(timestamp);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Chuẩn hoá chuỗi để tìm kiếm không phân biệt dấu, hoa thường */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/** Thời gian tương đối cho dải phân cách trong khung chat: Vừa xong / 5 phút trước / 2 tiếng trước */
export function formatRelative(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) {
    return 'Vừa xong';
  }
  if (minutes < 60) {
    return `${minutes} phút trước`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} tiếng trước`;
  }
  return formatTime(timestamp);
}
