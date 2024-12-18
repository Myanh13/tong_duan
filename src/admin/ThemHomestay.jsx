import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


const ThemHomestay = () => {
  const [sp, setSp] = useState({
    ten_homestay: "",
    gia_homestay: "",
    mota: "",
    TrangThai: "",
    id_Loai: "",
    danh_gia: 0,
  });


  const submitDuLieu = async () => {
    if (!sp.ten_homestay || !sp.gia_homestay || !sp.TrangThai || !sp.id_Loai) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
  
    try {
      // Gửi thông tin homestay trước
      const response = await axios.post("https://tong-api-1.onrender.com/admin/homestay", sp);
  
      if (response.status === 201) {
        const id_homestay = response.data.id; // Lấy ID từ kết quả thêm homestay
        
        // Upload hình ảnh nếu có
        const formData = new FormData();
        if (sp.mainImage) formData.append("images", sp.mainImage);
        if (sp.image1) formData.append("images", sp.image1);
        if (sp.image2) formData.append("images", sp.image2);
        if (sp.image3) formData.append("images", sp.image3);
        if (sp.image4) formData.append("images", sp.image4);
  
        if (formData.has("images")) {
          await axios.post(`https://tong-api-1.onrender.com/admin/hinh_homestay/${id_homestay}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
  
        alert("Thêm homestay thành công!");
        setSp({
          ten_homestay: "",
          gia_homestay: "",
          mota: "",
          TrangThai: "",
          id_Loai: "",
          danh_gia: 0,
          mainImage: null,
          image1: null,
          image2: null,
          image3: null,
          image4: null,
        });
      } else {
        alert("Thêm thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm homestay:", error);
      alert("Có lỗi xảy ra, vui lòng kiểm tra lại!");
    }
  };

  return (
<div className="container_admin_pra _add_form_pra">
  <h2>Thêm Homestay</h2>
  <form>
    <div className="form-group_admin_pra">
      <label htmlFor="productName">Tên Homestay</label>
      <input
        type="text"
        id="productName"
        name="productName"
        required
        value={sp.ten_homestay}
        onChange={(e) => setSp({ ...sp, ten_homestay: e.target.value })}
      />
    </div>
    <div className="form-group_admin_pra">
      <label htmlFor="productPrice">Giá</label>
      <input
        type="number"
        id="productPrice"
        name="productPrice"
        required
        value={sp.gia_homestay}
        onChange={(e) => setSp({ ...sp, gia_homestay: e.target.value })}
      />
    </div>
    <div className="form-group_admin_pra">
      <label htmlFor="productDescription">Mô Tả</label>
      <textarea
        id="productDescription"
        name="productDescription"
        rows="4"
        required
        value={sp.mota}
        onChange={(e) => setSp({ ...sp, mota: e.target.value })}
      ></textarea>
    </div>
    <div className="form-group_admin_pra">
      <label htmlFor="productCategory">Trạng Thái</label>
      <select
        id="productCategory"
        name="productCategory"
        required
        onChange={(e) => setSp({ ...sp, TrangThai: e.target.value })}
        className="form-control"
        value={sp.TrangThai || ""}
      >
        <option value="">Chọn trạng thái</option>
        <option value="Còn phòng">Còn phòng</option>
        <option value="Hết phòng">Hết phòng</option>
      </select>
    </div>
    <div className="form-group_admin_pra">
      <label htmlFor="productCategory">Loại</label>
      <select
        id="productCategory"
        name="productCategory"
        required
        onChange={(e) => setSp({ ...sp, id_Loai: e.target.value })}
        className="form-control"
        value={sp.id_Loai || ""}
      >
        <option value="">Chọn loại</option>
        <option value="1">Loại 1</option>
        <option value="2">Loại 2</option>
        <option value="3">Loại 3</option>
        <option value="4">Loại 4</option>
        <option value="5">Loại 5</option>
      </select>
    </div>

    {/* Add image input fields */}
    <div className="form-group_admin_pra">
      <label htmlFor="mainImage">Hình Chính</label>
      <input
        type="file"
        id="mainImage"
        name="mainImage"
        required
        onChange={(e) => setSp({ ...sp, mainImage: e.target.files[0] })}
      />
    </div>

    <div className="form-group_admin_pra">
      <label htmlFor="image1">Hình Phụ 1</label>
      <input
        type="file"
        id="image1"
        name="image1"
        onChange={(e) => setSp({ ...sp, image1: e.target.files[0] })}
      />
    </div>
    <div className="form-group_admin_pra">
      <label htmlFor="image2">Hình Phụ 2</label>
      <input
        type="file"
        id="image2"
        name="image2"
        onChange={(e) => setSp({ ...sp, image2: e.target.files[0] })}
      />
    </div>
    <div className="form-group_admin_pra">
      <label htmlFor="image3">Hình Phụ 3</label>
      <input
        type="file"
        id="image3"
        name="image3"
        onChange={(e) => setSp({ ...sp, image3: e.target.files[0] })}
      />
    </div>
    <div className="form-group_admin_pra">
      <label htmlFor="image4">Hình Phụ 4</label>
      <input
        type="file"
        id="image4"
        name="image4"
        onChange={(e) => setSp({ ...sp, image4: e.target.files[0] })}
      />
    </div>

    <div className="form-group_admin_pra">
      <button className="btn btn-warning" type="button" onClick={submitDuLieu}>
        Thêm Homestay
      </button>
      &nbsp;
      <button className="btn btn-warning">
        <Link to="/admin_danhsach" className="btn btn-info">
          Danh sách
        </Link>
      </button>
    </div>
  </form>
</div>

  );
};

export default ThemHomestay;
