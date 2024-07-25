/**
 * Hàm định dạng tiền tệ Việt Nam
 * @param {*} money Chuỗi tiền tệ cần định dạng
 * @returns Chuỗi tiền đã định dạng
 */

const handleFormatMoney = (money) => {
  return money.toLocaleString("it-IT", { style: "currency", currency: "VND" });
};

export { handleFormatMoney };
