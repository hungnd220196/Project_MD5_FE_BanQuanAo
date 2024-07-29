/**
 * Hàm định dạng tiền tệ Việt Nam
 * @param {*} money Chuỗi tiền tệ cần định dạng
 * @returns Chuỗi tiền đã định dạng
 */
const handleFormatMoney = (money) => {
  if (typeof money !== 'number' || isNaN(money)) {
    return '0 ₫';
  }
  return money.toLocaleString("it-IT", { style: "currency", currency: "VND" });
};

export { handleFormatMoney };
