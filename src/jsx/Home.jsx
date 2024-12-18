import axios from 'axios';
import React, { useState,useEffect, useRef } from 'react';
import { useParams } from "react-router-dom"
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

function Home() {
    const { id } = useParams();
    const [checkIn, setCheckIn] = useState(new Date());  
    const [checkOut, setCheckOut] = useState(new Date(new Date().setDate(new Date().getDate() + 1))); 
    const [roomType, setRoomType] = useState('');
    const [homestayData, setHomestayData] = useState([]);
    const [datHomestay, setDatHomestay] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [isCheckInOpen, setIsCheckInOpen] = useState(false);
    const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
    const datePickerRef = useRef();
    const swiperRef = useRef(null); // Ref để truy cập Swiper instance


    const [showhomestay, setHomestay] = useState(null); // Lưu thông tin homestay
    const [error, setError] = useState(null); // Lưu lỗi nếu có
    const [homestays, setHomestays] = useState([]); // Lưu danh sách homestay
    const [danhSachPhong, setDanhSachPhong] = useState([]); // Lưu danh sách phòng
    const [checkInDate, setCheckInDate] = useState(new Date()); // Ngày nhận phòng mặc định là hôm nay
    const [checkOutDate, setCheckOutDate] = useState(new Date()); // Ngày trả phòng
    const [roomsAvailable, setRoomsAvailable] = useState([]); // Danh sách phòng trống
    const [showRooms, setShowRooms] = useState(false); // Trạng thái hiển thị danh sách phòng
    const listRef = useRef(null); // Ref cho danh sách phòng
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [homestaysPerPage] = useState(6); // Số lượng homestay hiển thị trên mỗi trang
    const [danhSachLoaiPhong, setDanhSachLoaiPhong] = useState([]); // Lưu danh sách loại phòng
    const [loaiPhongHienThi, setLoaiPhongHienThi] = useState(''); // Loại phòng hiện tại
    const [selectedLoaiId, setSelectedLoaiId] = useState(null); // ID loại phòng đã chọn
    const [images, setImages] = useState([]); // Hình ảnh homestay
    const storedUser = JSON.parse(localStorage.getItem('auth'));
    const [isNotificationVisible, setNotificationVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5);
    const [dateError, setDateError] = useState("");
    const [notificationMessage, setNotificationMessage] = useState(""); // Thông báo

    useEffect(() => {
        // Cập nhật checkOut nếu checkIn thay đổi
        if (checkIn) {
          const newCheckOut = new Date(checkIn);
          newCheckOut.setDate(newCheckOut.getDate() + 1); // Ngày trả phòng là ngày hôm sau
          setCheckOut(newCheckOut);
        }
      }, [checkIn]); // Chạy khi checkIn thay đổi

    // Hàm fetch hình ảnh homestay
    const fetchHomestayImages = async () => {
      try {
        const response = await fetch('https://tong-api-1.onrender.com/dshinhanh');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setImages(data); // Đặt dữ liệu vào state
      } catch (error) {
        console.error('Failed to fetch images:', error);
      }
    };
    
    // Fetch hình ảnh khi component mount
    useEffect(() => {
      fetchHomestayImages();
    }, []);
  
    // Fetch thông tin homestay theo ID
    useEffect(() => {
      axios.get(`https://tong-api-1.onrender.com/homestay/${id}`)
        .then(response => {
          setHomestay(response.data); // Lưu thông tin homestay vào state
        })
        .catch(err => {
          setError("Lỗi khi tải dữ liệu homestay");
        });
    }, [id]);

    useEffect(() => {
        axios.get(`https://tong-api-1.onrender.com/homestay`)
          .then(response => {
            setHomestay(response.data); // Lưu thông tin homestay vào statepage danh
          })
          .catch(err => {
            setError("Lỗi khi tải dữ liệu homestay");
          });
      }, [id]);
  
    useEffect(() => {
    // Fetch data from APIs
    const fetchData = async () => {
        try {
        const homestayResponse = await axios.get("https://tong-api-1.onrender.com/homestay");
        const datHomestayResponse = await axios.get("https://tong-api-1.onrender.com/dat_homestay");
        const loaiHomestayResponse = await axios.get("https://tong-api-1.onrender.com/loaihomestay");
    
        // Create a mapping of id_Loai to ten_Loai
        const loaiHomestayMap = loaiHomestayResponse.data.reduce((map, loai) => {
            map[loai.id_Loai] = loai.Ten_Loai;
            return map;
        }, {});
    
        // Attach ten_Loai and bookings to homestayData
        const updatedHomestayData = homestayResponse.data.map((room) => ({
            ...room,
            Ten_Loai: loaiHomestayMap[room.id_Loai] || `Loại ${room.id_Loai}`,
            bookings: datHomestayResponse.data.filter(
            (booking) => booking.id_homestay === room.id_homestay
            ),
        }));
    
        // Extract unique room types from loaiHomestayResponse
        const uniqueRoomTypes = loaiHomestayResponse.data.map((loai) => ({
            id_Loai: loai.id_Loai,
            Ten_Loai: loai.Ten_Loai,
        }));
    
        setHomestayData(updatedHomestayData);
        setDatHomestay(datHomestayResponse.data);
        setFilteredRooms(updatedHomestayData); // Default to show all rooms
        setRoomTypes(uniqueRoomTypes); // Set room types
        } catch (error) {
        console.error("Error fetching data: ", error);
        }
    };
    
    fetchData();
    }, []);
      
    const isOverlap = (start1, end1, start2, end2) => {
    return !(end1 < start2 || end2 < start1);
    };
    
    const filterRooms = () => {
    const target = document.getElementById('rooms_section');
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
    const checkInDate = checkIn ? new Date(checkIn) : null;
    const checkOutDate = checkOut ? new Date(checkOut) : null;
    
    if (!checkIn || !checkOut) {
    setFilteredRooms(
        homestayData.filter(
        (room) => !roomType || room.id_Loai === parseInt(roomType)
        )
    );
    return;
    }
    
    if (checkInDate >= checkOutDate) {
    alert("Ngày nhận phòng phải trước ngày trả phòng.");
    return;
    }
    
    const availableRooms = homestayData.filter((room) => {
    if (roomType && room.id_Loai !== parseInt(roomType)) {
        return false;
    }
    
    return !datHomestay.some((booking) => {
        if (booking.id_homestay === room.id_homestay) {
        const bookingCheckIn = new Date(booking.ngay_dat);
        const bookingCheckOut = new Date(booking.ngay_tra);
        return isOverlap(checkInDate, checkOutDate, bookingCheckIn, bookingCheckOut);
        }
        return false;
    });
    });
    
    setFilteredRooms(availableRooms);
    };
  
    // Hàm để ẩn danh sách phòng khi click ra ngoài
    const handleClickOutside = (event) => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        setShowRooms(false); // Ẩn danh sách phòng
      }
    };
  
    // Lắng nghe sự kiện click trên toàn bộ tài liệu
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      // Cleanup để gỡ bỏ sự kiện khi component bị unmount
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
    // sự kiện click cho show sản phẩm

    useEffect(() => {
    // Hàm đóng DatePicker khi click ngoài
    const handleClickOutside = (event) => {
        if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsCheckInOpen(false); // Đóng DatePicker khi click ngoài
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, []);

    // const handleDatePickerClick = (e) => {
    // e.stopPropagation(); // Ngừng sự kiện lan truyền ra ngoài
    // };

    const [existingFavorites, setExistingFavorites] = useState(() => {
        return JSON.parse(localStorage.getItem("favorites")) || [];
    });
    
    const toggleFavorite = (homestay) => {
        if (!storedUser) {
            const goToLogin = window.confirm("Bạn cần đăng nhập để quản lý danh sách yêu thích. Bạn có muốn đến trang đăng nhập?");
            if (goToLogin) {
                window.location.href = '/dk_dn'; // Điều hướng đến trang đăng nhập
            }
            return;
        }
    
        if (!homestay) {
            console.error("Không có thông tin homestay");
            return;
        }
    
        setExistingFavorites((prevFavorites) => {
            let updatedFavorites;
    
            if (prevFavorites.some(item => item.id_homestay === homestay.id_homestay)) {
                // Nếu đã có trong danh sách yêu thích, xóa khỏi danh sách
                updatedFavorites = prevFavorites.filter(item => item.id_homestay !== homestay.id_homestay);
                setNotificationMessage("Sản phẩm đã được xóa khỏi danh sách yêu thích!"); // Thông báo xóa thành công
            } else {
                // Nếu chưa có trong danh sách yêu thích, thêm vào
                updatedFavorites = [...prevFavorites, homestay];
                setNotificationMessage("Sản phẩm đã được thêm vào danh sách yêu thích!"); // Thông báo thêm thành công
            }
    
            // Cập nhật localStorage sau khi thay đổi state
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    
            setNotificationVisible(true); // Hiển thị thông báo
            return updatedFavorites; // Trả về updatedFavorites
        });
    };
    const addToFavorites = (homestay) => {
        if (!storedUser) {
            const goToLogin = window.confirm("Bạn cần đăng nhập để thêm sản phẩm vào danh sách yêu thích. Bạn có muốn đến trang đăng nhập?");
            if (goToLogin) {
                window.location.href = '/dk_dn'; // Điều hướng đến trang đăng nhập
            }
            return;
        }
    
        if (!homestay) {
            console.error("Không có thông tin homestay");
            return;
        }
    
        setExistingFavorites((prevFavorites) => {
            const isFavorite = prevFavorites.some(item => item.id_homestay === homestay.id_homestay);
            
            if (!isFavorite) {
                const updatedFavorites = [...prevFavorites, homestay];
                localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Lưu vào localStorage
                setNotificationMessage("Sản phẩm đã được thêm vào danh sách yêu thích!");
            } else {
                setNotificationMessage("Sản phẩm này đã có trong danh sách yêu thích.");
            }
    
            setNotificationVisible(true); // Hiển thị thông báo
            return prevFavorites; // Trả về prevFavorites vì không thay đổi khi đã có trong danh sách
        });
    };
    
    useEffect(() => {
        let countdownInterval;
    
        if (isNotificationVisible) {
        // Đặt lại thời gian mỗi khi thông báo xuất hiện
        setTimeLeft(10); // Đặt lại bộ đếm về 5 giây
    
        countdownInterval = setInterval(() => {
            setTimeLeft(prevTime => {
            if (prevTime === 1) {
                setNotificationVisible(false); // Ẩn thông báo khi hết thời gian
                return 0;
            }
            return prevTime - 1;
            });
        }, 1000);
        }
    
        return () => clearInterval(countdownInterval); // Dọn dẹp khi component unmount hoặc trạng thái thay đổi
    }, [isNotificationVisible]);
  
    const handleContinueShopping = () => {
        setNotificationVisible(false); // Tắt thông báo
    };
    const handleGoToCart = () => {
        window.location.href = '/thich'; // Điều hướng đến trang đăng nhập
    };

    const renderStars = (rating) => {
        // Mảng chứa các thẻ <i> ngôi sao
        const stars = [];
        
        // Tính số sao đầy
        const fullStars = Math.floor(rating);
        
        // Kiểm tra nếu có sao rưỡi
        const hasHalfStar = rating % 1 >= 0.5;
      
        // Thêm sao đầy (hiển thị trước)
        for (let i = 0; i < fullStars; i++) {
          stars.push(<i key={`full-${i}`} className="fa-solid fa-star"></i>);
        }
      
        // Thêm sao rưỡi (hiển thị sau cùng, nếu có)
        if (hasHalfStar) {
          stars.push(<i key="half" className="fa-solid fa-star-half"></i>);
        }
      
        // Trả về các ngôi sao đã tạo ra
        return stars;
    };

    useEffect(() => {
        // Cập nhật checkOut nếu checkIn thay đổi
        if (checkIn) {
          const newCheckOut = new Date(checkIn);
          newCheckOut.setDate(newCheckOut.getDate() + 1); // Ngày trả phòng là ngày hôm sau
          setCheckOut(newCheckOut);
        }
    }, [checkIn]); // Chạy khi checkIn thay đổi
    
      
      
      
      

    if (error) return <p>{error}</p>;
    if (!showhomestay) return <p>Loading...</p>;
return(
    <div className="section_menu">
        <div className="banner index">
            <div className="wap_name_dt_rr index">
                    <div className="min_warp2">
                    <div className="name_menu_date_restaurant"  data-aos="fade-up" data-aos-duration="3000">
                        <h1 className="restaurant index">Paradiso</h1>
                        <p className="date index">Đồng hành cùng chuyến đi của bạn</p>

                    </div>
                </div>
            </div>
        </div>
        <div className="form_calendar_booking">
            <div className="min_warp3">
              <div className="wap_form_booking">
                <div className="form_booking">
                      {/* form */}
                    <div className="checkin_homstay t-datepicker">
                    <div
                      className="date_check_in search_item"
                      onClick={(e) => {
                        setIsCheckInOpen(!isCheckInOpen);
                        e.stopPropagation();
                      }}
                    >
                      <div className="seach_icons">
                        {/* Icon tìm kiếm */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24px" viewBox="0 0 24 24" fill="none">
                          <path d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z" stroke="#AAAFB6" strokeWidth="1.5" strokeLinecap="round"strokeLinejoin="round"></path>
                          <path d="M16.5 2.25V5.25" stroke="#AAAFB6" strokeWidth="1.5" strokeLinecap="round"strokeLinejoin="round"></path>
                          <path d="M7.5 2.25V5.25" stroke="#AAAFB6" strokeWidth="2" strokeLinecap="round"strokeLinejoin="round"></path>
                          <path d="M3.75 8.25H20.25" stroke="#AAAFB6" strokeWidth="1.5" strokeLinecap="round"strokeLinejoin="round"></path>
                        </svg>
                      </div>
                      <div className="search-form">
                        <label>Ngày nhận phòng</label>
                        <div className="t-check-in">
                          <div className="t-dates t-date-check-in">
                            <span className="t-day-check-in">
                              {checkIn ? new Date(checkIn).getDate().toString().padStart(2, '0') : '01'}/
                            </span>
                            <span className="t-month-check-in">
                              {checkIn ? (new Date(checkIn).getMonth() + 1).toString().padStart(2, '0') : '01'}/
                            </span>
                            <span className="t-year-check-in">
                              {checkIn ? new Date(checkIn).getFullYear() : '2024'}
                            </span>
                          </div>
                          {isCheckInOpen && (
                            <div className="date-picker-container1" ref={datePickerRef}>
                              <DatePicker
                                selected={checkIn ? new Date(checkIn) : null}
                                onChange={(date) => setCheckIn(date)}
                                dateFormat="dd/MM/yyyy"
                                className="t-input-check-in"
                                todayButton="Hôm nay"
                                onClickOutside={() => setIsCheckInOpen(false)} // Đóng khi click ra ngoài
                                inline
                                minDate={new Date()} // Vô hiệu hóa các ngày đã qua
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Phần chọn ngày trả phòng */}
                    <div
                      className="date_check_out search_item"
                      onClick={() => setIsCheckOutOpen(!isCheckOutOpen)}
                    >
                      <div className="seach_icons">
                        {/* Icon tìm kiếm */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24px" viewBox="0 0 24 24" fill="none">
                          <path d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z" stroke="#AAAFB6" strokeWidth="1.5" strokeLinecap="round"strokeLinejoin="round"></path>
                          <path d="M16.5 2.25V5.25" stroke="#AAAFB6" strokeWidth="1.5" strokeLinecap="round"strokeLinejoin="round"></path>
                          <path d="M7.5 2.25V5.25" stroke="#AAAFB6" strokeWidth="2" strokeLinecap="round"strokeLinejoin="round"></path>
                          <path d="M3.75 8.25H20.25" stroke="#AAAFB6" strokeWidth="1.5" strokeLinecap="round"strokeLinejoin="round"></path>
                        </svg>
                      </div>
                      <div className="search-form">
                        <label>Ngày trả phòng</label>
                        <div className="t-check-in">
                          <div className="t-dates t-date-check-out">
                            <span className="t-day-check-out">
                              {checkOut ? new Date(checkOut).getDate().toString().padStart(2, '0') : '01'}/
                            </span>
                            <span className="t-month-check-out">
                              {checkOut ? (new Date(checkOut).getMonth() + 1).toString().padStart(2, '0') : '01'}/
                            </span>
                            <span className="t-year-check-out">
                              {checkOut ? new Date(checkOut).getFullYear() : '2024'}
                            </span>
                          </div>
                          {isCheckOutOpen && (
                            <div className="date-picker-container2" ref={datePickerRef}>
                            <DatePicker
                              selected={checkOut}  // Đảm bảo checkOut được cập nhật đúng
                              onChange={(date) => setCheckOut(date)} // Cập nhật giá trị checkOut khi người dùng thay đổi ngày trả phòng
                              dateFormat="dd/MM/yyyy"
                              className="t-input-check-out"
                              todayButton="Hôm nay"
                              onClickOutside={() => setIsCheckOutOpen(false)} 
                              inline
                              minDate={checkIn ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000) : new Date()} // Đảm bảo checkOut >= checkIn + 1 ngày
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                            />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    </div>

                       {/* Phần chọn loại homestay */}
                    <div className="number_people search_item">
                        <div className="seach_icons">
                        {/* Icon số người */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M288 350.1l0 1.9-32 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L447.3 128.1c-12.3-1-25 3-34.8 11.7c-35.4 31.6-65.6 67.7-87.3 102.8C304.3 276.5 288 314.9 288 350.1zM480 512c-88.4 0-160-71.6-160-160c0-76.7 62.5-144.7 107.2-179.4c5-3.9 10.9-5.8 16.8-5.8c7.9-.1 16 3.1 22 9.2l46 46 11.3-11.3c11.7-11.7 30.6-12.7 42.3-1C624.5 268 640 320.2 640 352c0 88.4-71.6 160-160 160zm64-111.8c0-36.5-37-73-54.8-88.4c-5.4-4.7-13.1-4.7-18.5 0C453 327.1 416 363.6 416 400.2c0 35.3 28.7 64 64 64s64-28.7 64-64z"/></svg>
                        </div>
                    <div className="search-form">
                      <div className="group-dropdown-qty">
                        <label className="homestay_type" htmlFor="homestay-type">Loại homestay</label>
                        <select
                          id="homestay-type"
                          value={roomType}
                          onChange={(e) => setRoomType(e.target.value)}
                        >
                          <option value="">Tất cả các loại</option>
                          {roomTypes.map((type) => (
                            <option key={type.id_Loai} value={type.id_Loai}>
                              {type.Ten_Loai}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                   </div>
                      {/* Nút Đặt phòng */}
                    <div className="btn-more text-center search_btn">
                        <button type="button" className="ocean-button book_room"  onClick={() => {
                            filterRooms(); // Gọi hàm lọc phòng
                            setShowRooms(true); // Cập nhật trạng thái hiển thị danh sách phòng
                            }} >
                        Đặt phòng
                        </button>
                        {showRooms && (
                           <div ref={listRef} className="available-rooms">
                           <h4 className="danhgia-header">Các phòng trống</h4>
                           {filteredRooms.length > 0 ? (
                             <ul className="show_sp">
                               {filteredRooms.map((room) => (
                                 <li key={room.id_homestay}>
                                  
                                     <div className="show_img">
                                       {images.length > 0 ? (
                                         images
                                           .filter((image) => room.id_homestay === image.id_hinh)
                                           .map((image, index) => (
                                             <div key={index} className="add_img">
                                                 <span 
                                                    className={`heart-icon2 ${existingFavorites.some(item => item.id_homestay === room.id_homestay) ? 'active' : ''}`} 
                                                    onClick={() => toggleFavorite(room)}
                                                >
                                                    <i className="fa-solid fa-heart"></i>
                                                </span>
                                               <div className="homestay-sale">
                                                 {room.gia_homestay.toLocaleString('vi-VN', {
                                                   style: 'currency',
                                                   currency: 'VND',
                                                 })}
                                               </div>
                                               <img
                                                 src={image.url_hinh}
                                                 alt={room.ten_homestay || 'Hình ảnh homestay'}
                                               />
                                             </div>
                                           ))
                                       ) : (
                                         <p>Không có hình để hiển thị</p>
                                       )}
                                     </div>
                                     <div className="homestay-info">
                                     <Link
                                     to={`/homestay/${room.id_homestay}?checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}`}
                                   > <h3 className="homestay-name">{room.ten_homestay}</h3>
                                      
                                       </Link>
                                       <p className="homestay-rating">
                                         {renderStars(room.danh_gia)}
                                         <span className="homestay-rating-number">({room.danh_gia.toFixed(2)}/5)</span>
                                       </p>
                                       <div className="btn_ev text-left">
                                            <Link to={`/homestay/${room.id_homestay}?checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}`}>
                                                <span>
                                                    Xem chi tiết
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                                                    </svg>
                                                </span>
                                            </Link>
                                        </div>
                                         
                                     </div>                          
                                 </li>
                               ))}
                             </ul>
                           ) : (
                             <p>Không có phòng nào trống.</p>
                           )}
                         </div>
                         
                            )}
                          
                            
                    </div>
                </div>
              </div>
            </div>
                <div className="min_warp2">
                    <div className="row140">
                            <div className="row2" >
                                <div className="col-lg-4 col-md-6 col-12 banner--1" data-aos="fade-up" data-aos-duration="1400">
                                    <div className="about-banner">
                                        <picture>
                                            <source media="(max-width: 991px)" srcSet ="//theme.hstatic.net/200000909393/1001269498/14/home_about_banner_mb_1_1024x1024.jpg?v=2537"/>
                                            <source media="(min-width: 992px)" srcSet ="//theme.hstatic.net/200000909393/1001269498/14/home_about_banner_1.jpg?v=2537"/>
                                            <img src="//theme.hstatic.net/200000909393/1001269498/14/home_about_banner_1.jpg?v=2537" alt="banner 1"/>
                                        </picture>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-12 banner--2" data-aos="fade-up" data-aos-duration="2000">
                                    <div className="about-banner banner-content">
                                        <picture>
                                            <source media="(max-width: 991px)" srcSet ="//theme.hstatic.net/200000909393/1001269498/14/home_about_banner_mb_2_1024x1024.jpg?v=2537"/>
                                            <source media="(min-width: 992px)" srcSet ="//theme.hstatic.net/200000909393/1001269498/14/home_about_banner_2.jpg?v=2537"/>
                                            <img src="//theme.hstatic.net/200000909393/1001269498/14/home_about_banner_2.jpg?v=2537" alt="banner 2"/>
                                        </picture>
                                        <div className="about-content text-center">
                                            <div className="heading-title">
                                                <p className="title1">Chào mừng bạn đến với Paradiso</p>
                                                <h2 className="title2">Ngay trung tâm thành phố, cảnh quan tuyệt đẹp</h2>
                                            </div>
                                            <div className="btn_map col4">
                                                <Link to="#"><span>Xem thêm</span></Link>
                                            </div>    
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-12 banner--3" data-aos="fade-up" data-aos-duration="3000">
                                    <div className="about-banner">
                                        <picture>
                                            <source media="(max-width: 991px)" srcSet ="//theme.hstatic.net/200000909393/1001269498/14/home_about_banner_mb_3_1024x1024.jpg?v=2537"/>
                                            <source media="(min-width: 992px)" srcSet ="//theme.hstatic.net/200000909393/1001269498/14/home_about_banner_3.jpg?v=2537"/>
                                            <img src="//theme.hstatic.net/200000909393/1001269498/14/home_about_banner_3.jpg?v=2537" alt="banner 3"/>
                                        </picture>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
              
        </div> 
     
{/* <!-- show homstay  --> */}
            <div className="min_warp2">
                <div className="row8">
                    <div className="heading_title row_left" data-aos="fade-up" data-aos-duration="1500">
                        <p className="title1">Tận hưởng trải nghiệm lưu trú đẳng cấp</p>
                        <h2 className="title2 show_room">Nơi nghỉ dưỡng của bạn</h2>
                        <p className="des_pro show_room">Trốn đến những ngọn núi và thung lũng xinh đẹp nơi giấc mơ thành hiện thực. Văn hóa, thiên nhiên, suối và ẩm thực. Đắm mình trong những phẩm chất phục hồi của thiên nhiên, tránh xa những xáo trộn của cuộc sống thường ngày.</p> 
                    </div>
                    <div className="btn_slide">
                        <div className="owl-nav">
                            <button type="button" role="presentation" className="owl-prev" aria-label="prev slide"    onClick={() => swiperRef.current?.slidePrev()}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="512"
                                    height="512px"
                                    viewBox="0 0 512 512"
                                    className=""
                                    style={{ enableBackground: "new 0 0 512 512" }}
                                >
                                    <g transform="matrix(-1, 0, 0, -1, 512, 512)">
                                    <path d="M367.954,213.588L160.67,5.872c-7.804-7.819-20.467-7.831-28.284-0.029c-7.819,7.802-7.832,20.465-0.03,28.284l207.299,207.731c7.798,7.798,7.798,20.486-0.015,28.299L132.356,477.873c-7.802,7.819-7.789,20.482,0.03,28.284c3.903,3.896,9.016,5.843,14.127,5.843c5.125,0,10.25-1.958,14.157-5.873l207.269-207.701C391.333,275.032,391.333,236.967,367.954,213.588z" />
                                    </g>
                                </svg>
                            </button>
                            <button type="button" role="presentation" className="owl-next" aria-label="next slide" onClick={() => swiperRef.current?.slideNext()} >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="512"
                                height="512px"
                                viewBox="0 0 512 512"
                                className=""
                                style={{ enableBackground: "new 0 0 512 512" }}
                            >
                                <path d="M367.954,213.588L160.67,5.872c-7.804-7.819-20.467-7.831-28.284-0.029c-7.819,7.802-7.832,20.465-0.03,28.284l207.299,207.731c7.798,7.798,7.798,20.486-0.015,28.299L132.356,477.873c-7.802,7.819-7.789,20.482,0.03,28.284c3.903,3.896,9.016,5.843,14.127,5.843c5.125,0,10.25-1.958,14.157-5.873l207.269-207.701C391.333,275.032,391.333,236.967,367.954,213.588z" />
                            </svg>
                            </button>
                        </div>
                    </div>
                        <ul className="homestay_list" data-aos="fade-up" data-aos-duration="2000" ></ul>
                          <>
                            <Swiper data-aos="fade-up" data-aos-duration="2000" 
                                slidesPerView={4} // Hiển thị tối đa 3 slides
                                spaceBetween={30} // Khoảng cách giữa các slides
                                pagination={{
                                clickable: true,
                                }}
                                autoplay={{
                                  delay: 3000,
                                  disableOnInteraction: false,
                                }}
                                breakpoints={{
                                    900: { // Trên 768px
                                    slidesPerView: 4, // Hiển thị 4 slides
                                    spaceBetween: 30,
                                    },
                                    800: { // Trên 768px
                                    slidesPerView: 3, // Hiển thị 4 slides
                                    spaceBetween: 30,
                                    },
                                    767: { // Trên 768px
                                    slidesPerView: 3, // Hiển thị 4 slides
                                    spaceBetween: 30,
                                    },
                                    480: { // Từ 480px đến 767px
                                    slidesPerView: 2, // Hiển thị 2 slides
                                    spaceBetween: 20,
                                    },
                                    0: { // Dưới 480px
                                    slidesPerView: 1, // Hiển thị 1 slide
                                    spaceBetween: 10,
                                    },
                                }}
                                onSwiper={(swiper) => {
                                    swiperRef.current = swiper; // Lưu instance của Swiper
                                  }}
                                modules={[Pagination, Autoplay]}
                                className="mySwiper"
                                >
                                {Array.isArray(showhomestay) && showhomestay.slice(0,10).map((homestay) =>  (
                                    <SwiperSlide>
                                        <li key={homestay.id_homestay}>
                                            <p>
                                            <div className="img_homstay">
                                            {/* Icon trái tim */}
                                            <span 
                                                className={`heart-icon ${existingFavorites.some(item => item.id_homestay === homestay.id_homestay) ? 'active' : ''}`} 
                                                onClick={() => toggleFavorite(homestay)}
                                            >
                                                <i className="fa-solid fa-heart"></i>
                                            </span>

                                                <div className="pro-price">
                                                <span className="price">{homestay.gia_homestay.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                                <span>/ Đêm</span>
                                                </div>
                                                {images.length > 0 ? (
                                                images.map((image, index) => {
                                                    if (homestay.id_homestay === image.id_hinh) {
                                                    return (
                                                        <div key={image.id_homestay || index} className="add_img">
                                                        <img
                                                            src={image.url_hinh}
                                                            alt={homestay.ten_homestay || 'Hình ảnh homestay'}
                                                        />
                                                        </div>
                                                    );
                                                    }
                                                    return null;
                                                })
                                                ) : (
                                                <p>Không có hình để hiển thị</p>
                                                )}
                                            </div>
                                            <div className="des_hst">
                                                <div className="proloop-detail">
                                                <h3><Link to={"/homestay/" + homestay.id_homestay}>{homestay.ten_homestay}</Link></h3>
                                                <div className="pro-tag">
                                                    <div className="tag-item tag-area">
                                                    <span>150</span> <span className="tag-unit">m<sup>2</sup></span>
                                                    </div>
                                                    <div className="tag-item tag-guests">
                                                    <span>10</span> <span className="tag-unit">Guests</span>
                                                    </div>
                                                    <div className="tag-item tag-bed">
                                                    <span>5</span> <span className="tag-unit">Beds</span>
                                                    </div>
                                                    <div className="tag-item tag-bathroom">
                                                    <span>4</span> <span className="tag-unit">Bathroom</span>
                                                    </div>
                                                </div>
                                                <div className="pro-desc">
                                                    Double Suite rộng 150m² với thiết kế trong suốt, nằm ở tầng cao nhất của khách sạn, mang đến tầm nhìn toàn cảnh tuyệt đẹp...
                                                </div>
                                                <div className="btn_ev">
                                                    <Link to={"/homestay/" + homestay.id_homestay}>
                                                    <span>Xem chi tiết
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                        <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                                                        </svg>
                                                    </span>
                                                    </Link>
                                                </div>
                                                </div>
                                            </div>
                                            </p>
                                        </li>
                                        
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                         </>
                          {/* Lớp phủ và thông báo */}
                    {isNotificationVisible && (
                        <>
                        <div className="overlay_thongbao_user" style={{ display: 'block' }}></div>

                        <div className="notification_thongbao_user" style={{ display: 'flex' }}>
                            <p>{notificationMessage}</p>
                            <span>{timeLeft}s</span>
                            <button onClick={handleContinueShopping}>Tiếp tục chọn</button>
                            <button onClick={handleGoToCart}>Xem yêu thích</button>
                        </div>
                        </>
                    )}
                </div>
            </div>
{/* <!-- show homstay  --> */}
{/* <!-- service --> */}
            <div className="bg_service" data-aos="fade-up" data-aos-duration="1500">
                <div className="min_warp2">
                    <div className="row_warp">
                        <div className="col-lg-4 col-md-6 col-12">
                            <div className="service-item" data-aos="fade-zoom-in"
     data-aos-easing="ease-in-back"
     data-aos-delay="300"
     data-aos-offset="0">
                                <div className="item-icon">
                                    <img src="//theme.hstatic.net/200000909393/1001269498/14/home_service_img_1.jpg?v=2537" alt="Dịch vụ đưa đón tại sân bay"/>
                                </div>
                                <div className="item-detail">
                                    <h3 className="detail-title">Dịch vụ đưa đón tại sân bay</h3>
                                    <p className="detail-desc">Lorem ipsum proin gravida velit auctor alueut aenean sollicitu din, lorem auci elit consequat ipsutissem niuis sed odio sit amet a sit amet.</p>
                                </div>
                            </div>
                        </div>                
                        <div className="col-lg-4 col-md-6 col-12">
                            <div className="service-item" data-aos="fade-zoom-in"
     data-aos-easing="ease-in-back"
     data-aos-delay="300"
     data-aos-offset="0">
                                <div className="item-icon">
                                    <img src="//theme.hstatic.net/200000909393/1001269498/14/home_service_img_2.jpg?v=2537" alt="Dịch vụ quản gia"/>
                                </div>
                                <div className="item-detail">
                                    <h3 className="detail-title">Dịch vụ quản gia</h3>
                                    <p className="detail-desc">Lorem ipsum proin gravida velit auctor alueut aenean sollicitu din, lorem auci elit consequat ipsutissem niuis sed odio sit amet a sit amet.</p>
                                </div>
                            </div>
                        </div>      
                        <div className="col-lg-4 col-md-6 col-12">
                            <div className="service-item" data-aos="fade-zoom-in"
     data-aos-easing="ease-in-back"
     data-aos-delay="300"
     data-aos-offset="0">
                                <div className="item-icon">
                                    <img src="//theme.hstatic.net/200000909393/1001269498/14/home_service_img_3.jpg?v=2537" alt="Wifi &amp; Internet"/>
                                </div>
                                <div className="item-detail">
                                    <h3 className="detail-title">Wifi &amp; Internet</h3>
                                    <p className="detail-desc">Lorem ipsum proin gravida velit auctor alueut aenean sollicitu din, lorem auci elit consequat ipsutissem niuis sed odio sit amet a sit amet.</p>
                                </div>
                            </div>
                        </div>       
                        <div className="col-lg-4 col-md-6 col-12">
                            <div className="service-item" data-aos="fade-zoom-in"
     data-aos-easing="ease-in-back"
     data-aos-delay="300"
     data-aos-offset="0">
                                <div className="item-icon">
                                    <img src="//theme.hstatic.net/200000909393/1001269498/14/home_service_img_4.jpg?v=2537" alt="Dịch vụ giặt ủi"/>
                                </div>
                                <div className="item-detail">
                                    <h3 className="detail-title">Dịch vụ giặt ủi</h3>
                                    <p className="detail-desc">Lorem ipsum proin gravida velit auctor alueut aenean sollicitu din, lorem auci elit consequat ipsutissem niuis sed odio sit amet a sit amet.</p>
                                </div>
                            </div>
                        </div>           
                        <div className="col-lg-4 col-md-6 col-12">
                            <div className="service-item" data-aos="fade-zoom-in"
     data-aos-easing="ease-in-back"
     data-aos-delay="300"
     data-aos-offset="0">
                                <div className="item-icon">
                                    <img src="//theme.hstatic.net/200000909393/1001269498/14/home_service_img_5.jpg?v=2537" alt="Bữa sáng tại phòng"/>
                                </div>
                                <div className="item-detail">
                                    <h3 className="detail-title">Bữa sáng tại phòng</h3>
                                    <p className="detail-desc">Lorem ipsum proin gravida velit auctor alueut aenean sollicitu din, lorem auci elit consequat ipsutissem niuis sed odio sit amet a sit amet.</p>
                                </div>
                            </div>
                        </div>              
                        <div className="col-lg-4 col-md-6 col-12">
                            <div className="service-item" data-aos="fade-zoom-in"
     data-aos-easing="ease-in-back"
     data-aos-delay="300"
     data-aos-offset="0">
                                <div className="item-icon">
                                    <img src="//theme.hstatic.net/200000909393/1001269498/14/home_service_img_6.jpg?v=2537" alt="Chỗ đậu xe riêng"/>
                                </div>
                                <div className="item-detail">
                                    <h3 className="detail-title">Chỗ đậu xe riêng</h3>
                                    <p className="detail-desc">Lorem ipsum proin gravida velit auctor alueut aenean sollicitu din, lorem auci elit consequat ipsutissem niuis sed odio sit amet a sit amet.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
{/* <!-- service --> */}
{/* <!-- CNdu-lich --> */}
            <div className="bg_blog row8">
                <div className="min_warp2 ">
                    <div className="heading_title" data-aos="fade-up" data-aos-duration="1500">
                        <p className="title1">Hơn cả cảnh núi non</p>
                        <h2 className="title2 show_room">Trải nghiệm không thể quên</h2>
                    </div>
                    <div className="row2 list-blog justify-content-between align-items-center wow fadeInUp animated">
                        {/* Blog 1 */}
                        <div className="item-blog blog--1" data-aos="fade-up" data-aos-duration="1500">
                            <Link to="XXXX" title="Paddling Tour" aria-label="Paddling Tour">
                                <div 
                                    className="article-loop item-article" 
                                    style={{ backgroundImage: `url(https://file.hstatic.net/200000909393/article/img-69-800x600-1_3f16d7045e9a4dd49d5acc42384a3d5f.jpg)` }} // Sử dụng cú pháp JSX
                                >
                                    <div className="item-pd">
                                        <div className="media-article">
                                            <img 
                                                className="opcti0 ls-is-cached lazyloaded" 
                                                data-src="//file.hstatic.net/200000909393/article/img-69-800x600-1_3f16d7045e9a4dd49d5acc42384a3d5f_grande.jpg" 
                                                alt="Paddling Tour" 
                                                src="/image/index1.png" 
                                            />
                                            <time dateTime="2024-08-22">22 Tháng 08, 2024</time>
                                        </div>
                                        <div className="info-article">
                                            <div className="title-article">
                                                <h4 className="tittle_camnang">
                                                    Paddling Tour
                                                </h4>
                                            </div>
                                            <div className="short-article">
                                                Banff National Park’s biggest lake allows you to paddle for miles and enjoy breathtaking views. Lorem ipsum dolor...
                                            </div>
                                            <div className="btn_ev camnang">
                                                <Link to="#">
                                                    <span className="clo_white">Xem thêm
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                            <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                                                        </svg>
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        {/* Blog 2 */}
                        <div className="item-blog blog--2" data-aos="fade-up" data-aos-duration="2500">
                            <div 
                                className="article-loop item-article" >
                                <div className="media-article">
                                    <Link to="" title="Mountain Hiking" aria-label="Mountain Hiking">
                                        <img 
                                            className="ls-is-cached lazyloaded" 
                                            alt="Mountain Hiking" 
                                            src="https://file.hstatic.net/200000909393/article/img-68_93702bac2c97447b9475c6bb07a485d8.jpg" 
                                        />
                                        <time dateTime="2024-08-22">22 Tháng 08, 2024</time>
                                    </Link>
                                </div>
                                <div className="info-article">
                                    <div className="title-article">
                                        <h4 className="tittle_camnang">
                                            <Link to="XXXX">Mountain Hiking</Link>
                                        </h4>
                                    </div>
                                    <div className="short-article">
                                        With over 1,600 kilometres (994 miles) of trails, Banff National Park offers adventurers some of the best hiking...
                                    </div>
                                    <div className="btn_ev camnang">
                                        <Link to="#">
                                            <span>Xem chi tiết
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                                                </svg>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Blog 3 */}
                        <div className="item-blog blog--3" data-aos="fade-up" data-aos-duration="3000">
                            <div 
                                className="article-loop item-article" >
                                <div className="media-article">
                                    <Link to="/" title="Camping Tour" aria-label="Camping Tour">
                                        <img 
                                            className="ls-is-cached lazyloaded" 
                                            data-src="" 
                                            alt="Camping Tour" 
                                            src="https://file.hstatic.net/200000909393/article/img-70_23537e350baa48c5b65a977c872d0b09.jpg" 
                                        />
                                        <time dateTime="2024-08-22">22 Tháng 08, 2024</time>
                                    </Link>
                                </div>
                                <div className="info-article">
                                    <div className="title-article">
                                        <h4 className="tittle_camnang">
                                            <Link to="XXXX">Camping Tour</Link>
                                        </h4>
                                    </div>
                                    <div className="short-article">
                                        Banff offers a range of camping spots allowing you to experience all of this most gorgeous park’s outdoor...
                                    </div>
                                    <div className="btn_ev camnang">
                                        <Link to="XXXX">
                                            <span>Xem chi tiết
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                                                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                                            </svg>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>           
                        </div>
                    </div>
                    <div className="blog-content text-center" data-aos="fade-up" data-aos-duration="1500">
                        <p className="content-desc">
                            Bên trong nơi nghỉ dưỡng, mọi chi tiết đều được lên kế hoạch và sắp xếp trước để đảm bảo du khách có được trải nghiệm tốt nhất về cuộc sống trên núi.
                        </p>
                        <div className="btn-more text-center">
                            <Link to="#"><button className="ocean-button index" id="oceanButton">Liên Hệ Ngay</button></Link>
                        </div>
                    </div>
                </div>
            </div>
{/* <!-- CNdu-lich --> */}
{/* // <!-- form email --> */}
            <div className="email_newletter" data-aos="fade-up" data-aos-duration="3000" >
                    <div className="min_warp2">
                        <div className="row_email">
                            <div className="col-lg-6 col-12">
                                <div className="newsletter_title">
                                    <div className="heading-title">
                                        <p className="title3">Hãy kết nối cùng Paradiso</p>
                                        <h3 className="title4">Đăng ký nhận bản tin của chúng tôi để nhận tin tức, ưu đãi và khuyến mãi.</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-12">
                                <form acceptCharset="UTF-8" action="#" className="contact_form" method="post">
                                    <input name="form_type" type="hidden" value="customer"/>
                                    <input name="utf8" type="hidden" value="✓"/>
                                    <div className="form-group input-group">
                                        <input type="hidden" id="new_tags" name="#" value="Đăng kí nhận tin"/>     
                                        <input required="" type="email" name="#" className="form-control newsletter-input" id="newsletter-email" pattern="^(.)+@[A-Za-z0-9]([A-Za-z0-9.\-]*[A-Za-z0-9])?\.[A-Za-z]{1,13}$" placeholder="Nhập email của bạn" aria-label="Email Address"/>
                                        <div className="input_btn">
                                            <button type="submit" className="cta-submitform newsletter-btn">Đăng ký 
                                                <span className="icon-btn"><i className="fa fa-send-o"></i></span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="check-form">
                                        <input type="checkbox" id="new_check" required=""/>
                                        <span>Đã đọc &amp; Đồng ý <a href="#"> & Chính sách bảo mật</a></span>
                                    </div>
                                    <input id="eb66e25e0d524d97a7478759b2b7d91e" name="g-recaptcha-response" type="hidden"/>
                                </form>
                            </div>
                        </div>
                    </div>
            </div>
{/* /* <!-- form email --> */}
{/* <!-- footer-intagram --> */}
                <div className="footer-instagram" data-aos="fade-zoom-in" data-aos-easing="ease-in-out"data-aos-delay="400" data-aos-offset="0">
                    <div className="min_warp2">
                        <div className="row_col">
                            <>
                                <Swiper
                                    slidesPerView={4}
                                    spaceBetween={30}
                                    pagination={{
                                      clickable: true,
                                    }}
                                    autoplay={{
                                      delay: 3000, // Delay between slides in milliseconds
                                      disableOnInteraction: false, // Continue autoplay after user interaction
                                    }}
                                    breakpoints={{
                                        768: { // Trên 768px
                                          slidesPerView: 4, // Hiển thị 4 slides
                                          spaceBetween: 30,
                                        },
                                        480: { // Từ 480px đến 767px
                                          slidesPerView: 2, // Hiển thị 2 slides
                                          spaceBetween: 20,
                                        },
                                        0: { // Dưới 480px
                                          slidesPerView: 1, // Hiển thị 1 slide
                                          spaceBetween: 10,
                                        },
                                    }}
                                    modules={[Pagination, Autoplay]}
                                    className="mySwiper"
                                >
                                <SwiperSlide>
                                    <div className="box_intagram">
                                        <img src="//theme.hstatic.net/200000909393/1001269498/14/home_instagram_img_1.jpg?v=2537" alt="Instgram 1"/>
                                    </div>   
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="box_intagram">
                                    <img src="//theme.hstatic.net/200000909393/1001269498/14/home_instagram_img_2.jpg?v=2537" alt="Instgram 2"/>
                                    </div>   
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="box_intagram">
                                    <img src="//theme.hstatic.net/200000909393/1001269498/14/home_instagram_img_3.jpg?v=2537" alt="Instgram 3"/>
                                    </div>   
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="box_intagram">
                                    <img src="//theme.hstatic.net/200000909393/1001269498/14/home_instagram_img_4.jpg?v=2537" alt="Instgram 4"/>
                                    </div>   
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="box_intagram">
                                        <img src="//theme.hstatic.net/200000909393/1001269498/14/home_instagram_img_1.jpg?v=2537" alt="Instgram 1"/>
                                    </div>   
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="box_intagram">
                                        <img src="//theme.hstatic.net/200000909393/1001269498/14/home_instagram_img_1.jpg?v=2537" alt="Instgram 1"/>
                                    </div>   
                                </SwiperSlide>
                              

                                </Swiper>
                            </>
                        </div>
                        <div className="btn-more text-center">
                            <a href="#"><button className="ocean-button" id="oceanButton"><i className="fa-brands fa-instagram"></i> Theo dõi trên Instagram</button></a>
                        </div>
                    </div>
                </div>
{/* <!-- footer-intagram --> */}
              
        </div> 
        

)

};
export default Home;
