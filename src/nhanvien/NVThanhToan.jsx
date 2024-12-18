import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ThanhToan() {
  const { id } = useParams(); // Lấy id đơn hàng từ URL
  const [voucherStatus, setVoucherStatus] = useState(""); // Trạng thái voucher
  const [voucherInput, setVoucherInput] = useState(""); // Input mã voucher
  const [voucherDiscount, setVoucherDiscount] = useState(0); // Phần trăm giảm giá từ voucher
  const [totalAmount, setTotalAmount] = useState(0); // Tổng tiền sau giảm giá
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState({
    id_DatHomestay: "",
    ten_homestay: "",
    ten_user: "",
    sdt_user: "",
    ngay_dat: "",
    ngay_tra: "",
    tong_tien_dat: 0,
    tien_coc_truoc: 0,
    TT_Thanhtoan: "",
    gia_homestay: 0,
  });

  // Hàm format ngày theo định dạng DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return ''; // Nếu ngày không hợp lệ, trả về chuỗi trống
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch dữ liệu đơn hàng
  useEffect(() => {
    fetch(`https://tong-api-1.onrender.com/donhangdacoc/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setOrderDetails(data);
        setTotalAmount(data.tong_tien_dat); // Khởi tạo tổng tiền khi lấy dữ liệu
      })
      .catch((error) => console.error("Lỗi khi tải dữ liệu đơn hàng:", error));
  }, [id]);

  const calculateStayDuration = () => {
    if (orderDetails.ngay_dat && orderDetails.ngay_tra) {
      const ngayDat = new Date(orderDetails.ngay_dat);
      const ngayTra = new Date(orderDetails.ngay_tra);
      if (isNaN(ngayDat) || isNaN(ngayTra)) return 0;
      const soNgayO = Math.ceil((ngayTra - ngayDat) / (1000 * 60 * 60 * 24));
      return soNgayO > 0 ? soNgayO : 0;
    }
    return 0;
  };

  const calculateTotalAmountForStay = () => {
    return orderDetails.gia_homestay * calculateStayDuration(); // Tổng tiền cho số ngày ở
  };

// Tính tiền đã cọc (30% của tổng tiền ban đầu)
const calculateDepositAmount = () => {
  return calculateTotalAmountForStay() * 0.3; // Tiền đã cọc (30%)
};

// Tính tiền còn lại (tổng tiền - tiền cọc)
const calculateRemainingAmount = () => {
  return calculateTotalAmountForStay() - calculateDepositAmount(); // Tiền còn lại sau khi trừ cọc
};

const calculateTotalAfterVoucher = () => {
  const remainingAmount = calculateRemainingAmount(); // Tiền còn lại sau khi trừ tiền cọc
  if (voucherDiscount > 0) {
    // Áp dụng voucher vào số tiền còn lại
    return remainingAmount - (remainingAmount * (voucherDiscount / 100));
  }
  return remainingAmount; // Nếu không có voucher, trả lại số tiền còn lại
};


  // Xử lý thanh toán
  const handlePayment = () => {
    const updatedOrder = {
      TT_Thanhtoan: "Đã thanh toán",  // Trạng thái thanh toán
      tong_tien_dat: totalAmount,      // Tổng tiền
    };
    fetch(`https://tong-api-1.onrender.com/donhangdathanhtoan/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedOrder),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Cập nhật thành công!") {
          alert("Thanh toán thành công!");
          navigate('/nhanvien_dathanhtoan/');  // Điều hướng sau khi thanh toán thành công
        } else {
          alert(data.message || "Có lỗi xảy ra khi thanh toán.");
        }
      })
      .catch((error) => {
        console.error("Lỗi khi thanh toán:", error);
        alert("Đã xảy ra lỗi khi thanh toán.");
      });
  };

  // Hàm kiểm tra mã voucher
  const handleCheckVoucher = () => {
    const voucherCode = voucherInput.trim(); // Xóa khoảng trắng thừa từ input
    const voucherList = {
      PRDS20: 20, // Mã giảm giá 20%
      PRDS30: 30, // Mã giảm giá 30%
      PRDS50: 50, // Mã giảm giá 50%
    };
    if (voucherCode in voucherList) {
      const discount = voucherList[voucherCode];
      setVoucherDiscount(discount); // Cập nhật phần trăm giảm giá
      setVoucherStatus(`Mã hợp lệ: Giảm ${discount}%`);
    } else {
      setVoucherDiscount(0); // Đặt giảm giá về 0 nếu mã không hợp lệ
      setVoucherStatus("Mã không hợp lệ!");
    }
  };

  useEffect(() => {
    // Tính toán lại tổng tiền sau khi áp dụng voucher và các thay đổi khác
    const updatedTotalAmount = calculateTotalAfterVoucher();
    setTotalAmount(updatedTotalAmount);
  }, [voucherDiscount, orderDetails]);




// Tính toán tiền còn lại sau khi trừ tiền cọc
const calculateAmountDue = () => {
  const totalAmountForStay = calculateTotalAmountForStay(); // Tổng tiền trong số ngày ở
  const tienCocTruoc = orderDetails.tien_coc_truoc || 0;   // Tiền đã cọc
  return totalAmountForStay - tienCocTruoc; // Tiền còn lại sau khi trừ tiền cọc
};


// Tính toán số tiền còn lại sau khi trừ tiền cọc
const calculateRemainingAmountAfterDeposit = () => {
  const remainingAmount = calculateAmountDue(); // Tiền còn lại sau khi trừ tiền cọc
  if (voucherDiscount > 0) {
    // Áp dụng chiết khấu voucher vào số tiền còn lại
    return remainingAmount - (remainingAmount * (voucherDiscount / 100));
  }
  return remainingAmount; // Nếu không có voucher, trả lại số tiền còn lại
};

  return (
    <div className="payment-container">
      <h2>Thông tin thanh toán</h2>
      <form>
        <div className="form-group nhanvien">
          <label>ID Đơn hàng:</label>
          <input type="text" value={orderDetails.id_DatHomestay} readOnly />
        </div>
        <div className="form-group nhanvien">
          <label>Tên Homestay:</label>
          <input type="text" value={orderDetails.ten_homestay} readOnly />
        </div>
        <div className="form-group nhanvien">
          <label>Tên Người Đặt:</label>
          <input type="text" value={orderDetails.ten_user} readOnly />
        </div>
        <div className="form-group nhanvien">
          <label>Số điện thoại người đặt:</label>
          <input type="text" value={orderDetails.sdt_user} readOnly />
        </div>
        <div className="form-group nhanvien">
          <label>Ngày Đặt:</label>
          <input value={formatDate(orderDetails.ngay_dat)} readOnly />
        </div>
        <div className="form-group nhanvien">
          <label>Ngày Trả:</label>
          <input value={formatDate(orderDetails.ngay_tra)} readOnly />
        </div>
        <div className="form-group-horizontal voucher-group">
          <label>Mã Voucher:</label>
          <div className="voucher-input-container">
            <input
              type="text"
              value={voucherInput}
              onChange={(e) => setVoucherInput(e.target.value)}
              placeholder="Nhập mã voucher"
            />
            <button type="button" onClick={handleCheckVoucher}>
              Áp dụng
            </button>
          </div>
        </div>
        <p className="voucher-status red-text">{voucherStatus}</p>
        <div className="payment-summary">
        <div className="summary-row">
  <span className="summary-label">Tổng Tiền Ban Đầu Trong <strong>{calculateStayDuration()}</strong> ngày:</span>
  <span className="summary-value text_underline red-text">
    {Number(calculateTotalAmountForStay()).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    })}
  </span>
        </div>

<div className="payment-summary">
  <div className="summary-row">
    <span className="summary-label">Tiền đã cọc:</span>
    <span className="summary-value">
      {(Number(orderDetails.gia_homestay * calculateStayDuration()) * 0.3).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })}
    </span>
  </div>

  <div className="summary-row">
    <span className="summary-label">Tiền còn lại:</span>
    <span className="summary-value">
      {Number(calculateRemainingAmount()).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })}
    </span>
  </div>

  <div className="summary-row">
    <span className="summary-label">Chiết khấu (Voucher):</span>
    <span className="summary-value">
      {voucherDiscount > 0
        ? `- ${(calculateRemainingAmount() * (voucherDiscount / 100)).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}`
        : "0 VND"}
    </span>
  </div>

  <div className="total-amount-row">
    <span className="total-label">Tổng Tiền Cần Thanh Toán:</span>
    <span className="total-value">
      {Number(calculateTotalAfterVoucher()).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })}
    </span>
  </div>
</div>
        </div>

        <div className="voucher-input-container">
          <button type="button" onClick={handlePayment}>
            Thanh Toán
          </button>
        </div>
      </form>
    </div>
  );
}

export default ThanhToan;
