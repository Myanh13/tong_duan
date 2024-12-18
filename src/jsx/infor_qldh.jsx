import React, { useState, useEffect,useRef  } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Infor_User_Qldh() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('auth'));
  const defaultAvatar = '../../image/user2.png';
  const [imageUrl, setImageUrl] = useState(null); // Thêm state này ở đầu file component
  const [currentPage, setCurrentPage] = useState(1); // State lưu trang hiện tại
  const [ordersPerPage, setOrdersPerPage] = useState(5); // Số lượng đơn hàng mặc định trên mỗi trang
  const tableRef = useRef(null); // Khởi tạo ref cho phần bảng đơn hàng
  const [orders, setOrders] = useState([]); // State lưu danh sách đơn hàng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = storedUser; 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://tong-api-1.onrender.com/user/${storedUser.id_user}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          
          // Kiểm tra nếu người dùng có ảnh, nếu không thì sẽ dùng ảnh mặc định
          if (data.user.avatar && data.user.avatar !== "../../image/user2.png") {
            setImageUrl(`https://tong-api-1.onrender.com${data.user.avatar}`);  // Hiển thị ảnh từ server
          } else {
            setImageUrl("../../image/user2.png");  // Hiển thị ảnh mặc định
          }
        } else {
          console.error('Lỗi khi lấy dữ liệu người dùng');
        }
      } catch (error) {
        console.error('Lỗi kết nối với server:', error);
      }
    };
  
    if (storedUser) {
      fetchUserData();
    }
  }, []);
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('id_user', storedUser.id_user);

      try {
        const response = await fetch(`https://tong-api-1.onrender.com/user/${storedUser.id_user}/avatar`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          alert('Cập nhật ảnh đại diện thành công!');

          // Cập nhật URL ảnh đại diện mới
          setImageUrl(`https://tong-api-1.onrender.com${data.avatarPath}`);
        } else {
          alert('Cập nhật ảnh đại diện thất bại');
        }
      } catch (error) {
        console.error('Lỗi khi kết nối với server:', error);
      }
    }
  };

  useEffect(() => {
    // Kiểm tra xem có dữ liệu người dùng trong localStorage hay không
    const storedUser = JSON.parse(localStorage.getItem('auth'));

    if (storedUser) {
      // Nếu có thông tin người dùng trong localStorage, set state user
      setUser(storedUser);

      // Gửi yêu cầu tới server để lấy thông tin đơn hàng của người dùng
      const fetchOrders = async () => {
        try {
          const response = await fetch(`https://tong-api-1.onrender.com/dh_user?id_user=${storedUser.id_user}`);
          if (!response.ok) {
            throw new Error("Lỗi khi lấy dữ liệu từ server");
          }
          const data = await response.json();
          setOrders(data); // Cập nhật danh sách đơn hàng
        } catch (err) {
          console.error("Lỗi khi lấy danh sách đơn hàng:", err);
          setError("Lỗi khi tải dữ liệu!");
        } finally {
          setLoading(false); // Kết thúc trạng thái loading
        }
      };

      fetchOrders(); // Gọi hàm lấy đơn hàng khi có người dùng
    }
  }, []); // Chạy effect một lần khi component được render

  // Hàm đăng xuất
  const handleLogout = () => {
    // Hiển thị thông báo xác nhận
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn đăng xuất không?');
    
    if (isConfirmed) {
      // Xóa thông tin người dùng khi đăng xuất
      localStorage.removeItem('auth');
      setUser(null); // Đặt lại state user về null
  
      // Điều hướng người dùng về trang đăng nhập hoặc trang chủ
      navigate('/');
      window.location.reload(); // Tải lại trang
    }
  };


  useEffect(() => {
      // Gọi API lấy dữ liệu đơn hàng
      const fetchOrders = async () => {
          try {
              const response = await fetch(`https://tong-api-1.onrender.com/dh_user?id_user=${userId}`); // Truyền id_user qua query
              if (!response.ok) {
                  throw new Error("Lỗi khi lấy dữ liệu từ server");
              }
              const data = await response.json();
              setOrders(data); // Cập nhật state
          } catch (err) {
              console.error("Lỗi khi lấy danh sách đơn hàng:", err);
              setError("Lỗi khi tải dữ liệu!");
          } finally {
              setLoading(false); // Kết thúc trạng thái loading
          }
      };

      fetchOrders(); // Gọi hàm khi component được render
  }, [userId]); // Hook sẽ gọi lại khi userId thay đổi

  const handleDelete = async (id) => {
    const confirmation = window.confirm("Bạn có chắc muốn hủy đơn hàng này?");
    if (confirmation) {
      try {
        const response = await fetch(`https://tong-api-1.onrender.com/dh_user/${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.thongbao); // Hiển thị thông báo nếu xóa thành công
          setOrders(orders.filter(order => order.id_DatHomestay !== id)); // Cập nhật lại danh sách đơn hàng
        } else {
          alert(result.thongbao); // Hiển thị thông báo lỗi nếu không thể xóa
        }
      } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
      }
    }
  };
 // Xử lý phân trang
 const indexOfLastOrder = currentPage * ordersPerPage;
 const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
 const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Hàm phân trang
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    
    // Cuộn đến phần bảng đơn hàng
    if (tableRef.current) {
      tableRef.current.scrollIntoView({
        behavior: 'smooth', // Cuộn mượt mà
        block: 'start',     // Cuộn đến vị trí phần tử ở trên cùng
      });
    }
  };

 // Hàm để hiển thị tất cả đơn hàng
 const showAllOrders = () => {
  setOrdersPerPage(orders.length); // Cập nhật ordersPerPage thành tổng số đơn hàng
  setCurrentPage(1); // Quay lại trang 1 khi hiển thị tất cả
};

  if (!user) {
    // Nếu không có người dùng, có thể hiển thị trang đăng nhập hoặc thông báo khác
    return <div>Chưa đăng nhập. Vui lòng đăng nhập lại.</div>;
  }
  return (
    <div className="main">
      <div className="danh">123</div>
      <div className="body_profile min_warp2">
        <div className="main_tk">
          <div className="thongtin">
            <div className="box_user">
                <div className="profile-container_infor_nguoidung">
                    <div className="profile-avatar_infor_nguoidung">
                        <div className="profile-avatar_infor_nguoidung_img">
                          <img src={imageUrl || defaultAvatar} alt="Avatar" />
                        </div>
                        <div className="change-avatar-icon" onClick={() => document.getElementById("avatarInput").click()}>
                          <i className="fa-regular fa-image"></i>
                        </div>
                        <input hidden id="avatarInput" type="file" accept="image/*" onChange={handleFileChange}/>
                    </div>
                    <div className="profile-info_infor_nguoidung">
                      <h2>{user.id_user}. {user.ten_user}</h2>
                      <p><span className="icon_infor_nguoidung"><i class="fa-solid fa-phone"></i> </span> {user.sdt_user}</p>
                      <p><span className="icon_infor_nguoidung"><i class="fa-solid fa-envelope"></i></span>  {user.email_user}</p>
                  </div>
                </div>          
            </div>
            <div className="box_link">
              <Link to={'/infor_user'} className="tab_item active">
                <i className="fa-light fa-circle-info"></i>
                Thông Tin Tài Khoản
              </Link>
              <Link to={'/ud_infor'} className="tab_item">
                <i className="fa-light fa-user"></i>
                Chỉnh Sửa Tài Khoản
              </Link>
              <Link to={'/quen_mk'} className="tab_item">
                <i className="fa-light fa-lock"></i>
                Đổi Mật Khẩu
              </Link>
              <Link to={'/ql_dhang'} className="tab_item">
                <i className="fa-light fa-clipboard-list"></i>
                Quản Lí Đơn Hàng
              </Link>
            </div>
            <div className="box_tieude">
              <h1>Đơn Hàng Của Bạn</h1>
            </div>
            <table className="table_cart">
              <thead>
                <tr>
                  <th>Thứ Tự</th>
                  <th>Thông Tin Đơn Hàng</th>
                  <th>Tiền Đã Thanh Toán</th>
                  <th>Trạng Thái</th>
                  <th>Công Cụ</th>
                </tr>
              </thead>
              <tbody>
                    {currentOrders.length > 0 ? (
                        currentOrders.map((order, index) => (
                            <tr key={order.id_DatHomestay}>
                                <td>{index + 1}</td>
                                <td style={{ textAlign: "left" }}>
                                    Đơn Hàng <strong>{order.id_DatHomestay}</strong> -{" "}
                                    {new Date(order.ngay_dat).toLocaleDateString()}<br />
                                    <strong>Hình Thức Thanh Toán:</strong>{"........... "}
                                    {/* {order.TT_Thanhtoan || "Không xác định"} */}
                                </td>
                                <td className="price_tk red-text">
                                    {order.tong_tien_dat.toLocaleString()} đ
                                </td>
                                <td>{order.TT_Thanhtoan || "Chờ xử lý"}</td>
                                <td>
                                {order.TT_Thanhtoan === "Chờ thanh toán" || order.TT_Thanhtoan === "Thanh toán thất bại" ? (
                                  <p
                                    className="icon"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleDelete(order.id_DatHomestay)}
                                  >
                                    <img src="../../image/xcart.png" alt="Xóa" />
                                  </p>
                                ) : (
                                  <span>
                                    {order.TT_Thanhtoan === "Đã thanh toán" ? (
                                      <i className="fa-solid fa-check" style={{ color: 'green', marginRight: '5px' }}></i>
                                    ) : null}

                                    {order.TT_Thanhtoan === "Thanh toán thành công" ? (
                                      <i className="fa-regular fa-credit-card" style={{ color: 'green', marginRight: '5px' }}></i>
                                    ) : null}                                    
                                     {order.TT_Thanhtoan === "đã hủy" ? (
                                      <i className="fa-solid fa-circle-info" style={{ color: 'red', marginRight: '5px' }}></i>
                                    ) : null}
                                  </span>
                                )}
                              </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                                Không có đơn hàng nào!
                            </td>
                        </tr>
                    )}
                </tbody>

            </table>
            {/* Pagination */}
            <div className="pagination_phong line_gray">
                  <Link
                    to="#"
                    className="all_phong"
                    onClick={showAllOrders}
                  >
                    Tất Cả
                </Link>
                  {currentPage > 1 && (
                    <Link
                      to="#"
                      className="prev_phong"
                      onClick={() => paginate(currentPage - 1)}
                    >
                      &laquo; Trước
                    </Link>
                  )}

                  {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, index) => (
                    <Link
                      to="#"
                      key={index}
                      className={`page_phong ${currentPage === index + 1 ? 'active_phong' : ''}`}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </Link>
                  ))}

                  {currentPage < Math.ceil(orders.length / ordersPerPage) && (
                    <Link
                      to="#"
                      className="next_phong"
                      onClick={() => paginate(currentPage + 1)}
                    >
                      Tiếp &raquo;
                    </Link>
                  )}
                    {/* Thêm lựa chọn "All" để hiển thị tất cả */}
            </div>

          </div>
          <div className="tab">
            <h1 className="tab_title">Tài Khoản</h1>
            <div className="tab_list">
              <Link to={'/infor_user'} className="link active">
                <i className="fa-light fa-circle-info"></i>
                Thông Tin Tài Khoản
              </Link>
              <Link to={'/ud_infor'} className="link">
                <i className="fa-light fa-user"></i>
                Chỉnh Sửa Tài Khoản
              </Link>
              <Link to={'/quen_mk'} className="link">
                <i className="fa-light fa-lock"></i>
                Đổi Mật Khẩu
              </Link>
              <Link to={'/ql_dhang'} className="link">
                <i className="fa-light fa-clipboard-list"></i>
                Quản Lí Đơn Hàng
              </Link>
              <div onClick={handleLogout} className="tab_item logout_user">
                <i className="fa-sharp fa-regular fa-period"></i>
                Đăng Xuất
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Infor_User_Qldh;
