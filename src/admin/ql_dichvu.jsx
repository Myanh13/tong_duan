import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Ql_dichvu = () => {
  const [service, setServices] = useState([]);
  const [editService, setEditService] = useState(null);
  const [Ten_DV, setTen_DV] = useState('');
  const [Mo_ta, setMo_ta] = useState('');
  const [Gia, setGia] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchService();
  }, []);

  // Lấy danh sách bài viết từ API
  const fetchService = () => {
    fetch('https://tong-api-1.onrender.com/dichvu')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServices(data);
        } else {
          console.error('Dữ liệu không phải là mảng:', data);
        }
      })
      .catch((error) => {
        console.error('Có lỗi khi lấy dữ liệu bài viết!', error);
      });
  };

  // Thêm Dịch vụ mới
  const handleAddPost = () => {
    const formData = new FormData();
    formData.append('Ten_DV', Ten_DV);
    formData.append('Mo_ta', Mo_ta);
    formData.append('Gia', parseFloat(Gia));
   
    fetch('https://tong-api-1.onrender.com/them_dichvu', {
      method: 'POST',
      body: formData,  // Gửi dữ liệu dạng FormData
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Dịch vụ đã được thêm:', data);
        setIsAdding(false);
        setTen_DV('');
        setMo_ta('');
        setGia('');
        fetchService();
      })
      .catch((error) => {
        console.error('Có lỗi khi thêm dịch vụ mới!', error);
      });
  };
  
  const handleDelete = (id) => {
    // Hiển thị thông báo xác nhận trước khi xóa
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này không?');
  
    if (isConfirmed) {
      fetch(`https://tong-api-1.onrender.com/xoadichvu/${id}`, { method: 'DELETE' })
        .then(() => {
          alert('Bài viết đã được xóa thành công!');
          fetchService(); // Cập nhật danh sách bài viết sau khi xóa
        })
        .catch((error) => {
          console.error('Có lỗi khi xóa bài viết!', error);
          alert('Không thể xóa bài viết. Vui lòng thử lại!');
        });
    }
  };
  

  return (
    <div className="admin_table_pra_wrapper">
       <button className="btn_table_admin btn-add_table_admin" onClick={() => setIsAdding(true)}>
      + Thêm Dịch vụ
        </button> 
    <h1 className="admin_table_pra_title">Quản lý Dịch vụ</h1>
    {isAdding && (
  <div className="add-user-form">
    <h2>Thêm Dịch vụ mới</h2>
    <input
      type="text"
      placeholder="Tên dịch vụ"
      value={Ten_DV}
      onChange={(e) => setTen_DV(e.target.value)}
      required
    />
    <textarea
      placeholder="Mô tả"
      value={Mo_ta}
      onChange={(e) => setMo_ta(e.target.value)}
      required
    />
     <input
      type="number"
      placeholder="Giá"
      value={Gia}
      onChange={(e) => setGia(e.target.value)}
      required
    />

    <div className="wap_btn_admin">
      <button onClick={handleAddPost}>Lưu</button>
      <button onClick={() => setIsAdding(false)}>Hủy</button>
    </div>
  </div>
)}
  
    <table className="admin_table_pra">
      <thead>
        <tr>
          <th className="admin_table_pra_id">ID</th>
          <th className="admin_table_pra_name">Tên Dịch vụ </th>
          <th className="admin_table_pra_content">Mô tả</th>
          <th className="admin_table_pra_role">Giá</th>
          <th className="admin_table_pra_role">Chức năng</th>
        </tr>
      </thead>
      <tbody>
          {service.map((service) => (
            <tr key={service.id_DV}>
              <td className="admin_table_pra_id">{service.id_DV}</td>
              <td className="admin_table_pra_name">
                {service.Ten_DV}  
              </td>
               <td className="admin_table_pra_description">
                {service.Mo_Ta}  
              </td>
              <td className="admin_table_pra_role">
                {service.Gia}  
              </td>
              <td className="atooltip_table_admin">
                <div className="bisai">
                <button
                      className="btn_table_admin btn-primary_table_admin"
                    >
                    <Link to={`/suadichvu/${service.id_DV}`}> Sửa </Link>
                    </button>
                    &nbsp;
                    <button
                      className="btn_table_admin btn-danger_table_admin"
                      onClick={() => handleDelete(service.id_DV)}  
                    >
                      Xóa
                    </button>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
  
  );
};

export default Ql_dichvu;
