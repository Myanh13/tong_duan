import React, {useEffect, useState, useRef} from "react";
import DatePicker from 'react-datepicker';
import { FaCalendarAlt } from 'react-icons/fa'; // Import biểu tượng lịch từ react-icons
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios'; // Nếu bạn sử dụng axios
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';


const Phong = () => {
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
  const [itemsPerPage, setItemsPerPage] = useState(10);  // Mặc định là 10 phòng mỗi trang
  const [currentPage, setCurrentPage] = useState(1);
  // Hàm phân trang
  const listRef = useRef(null);  // Khai báo ref cho danh sách phòng
  const indexOfLastRoom = currentPage * itemsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - itemsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);


  const [checkInDate, setCheckInDate] = useState(new Date()); // Mặc định là ngày hôm nay
  const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1))); // Ngày trả phòng mặc định là ngày mai
  const [roomsAvailable, setRoomsAvailable] = useState([]); // State để lưu danh sách phòng trống
  const [showRooms, setShowRooms] = useState(false); // Trạng thái hiển thị danh sách phòng
  const [images, setImages] = useState([]);
  const handleCheckInDateChange = (date) => { setCheckInDate(date);
  const updatedCheckout = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        setCheckOutDate(updatedCheckout);
    };
  const storedUser = JSON.parse(localStorage.getItem('auth'));
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [notificationMessage, setNotificationMessage] = useState(""); // Thông báo

  const fetchHomestayImages = async () => {
    try {
      const response = await fetch('https://tong-api-1.onrender.com/dshinhanh');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // console.log(data); // Log dữ liệu nhận được
      setImages(data); // Đặt dữ liệu vào state
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  };

  useEffect(() => {
    // Cập nhật checkOut nếu checkIn thay đổi
    if (checkIn) {
      const newCheckOut = new Date(checkIn);
      newCheckOut.setDate(newCheckOut.getDate() + 1); // Ngày trả phòng là ngày hôm sau
      setCheckOut(newCheckOut);
    }
  }, [checkIn]); // Chạy khi checkIn thay đổi

  useEffect(() => {
    fetchHomestayImages();
  }, []);


   const handleClickOutside = (event) => {
    if (listRef.current && !listRef.current.contains(event.target)) {
      setShowRooms(false); // Ẩn danh sách phòng
    }
  };

  useEffect(() => {
    // Lắng nghe sự kiện click trên toàn bộ tài liệu
    document.addEventListener('mousedown', handleClickOutside);
  
    // Cleanup để gỡ bỏ sự kiện khi component bị unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); 

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

const handleDatePickerClick = (e) => {
  e.stopPropagation(); // Ngừng sự kiện lan truyền ra ngoài
};

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

// const filterRooms = () => {
//   const target = document.getElementById('rooms_section');
//   if (target) {
//     target.scrollIntoView({ behavior: 'smooth' });
//   }
// const checkInDate = checkIn ? new Date(checkIn) : null;
// const checkOutDate = checkOut ? new Date(checkOut) : null;

// if (!checkIn || !checkOut) {
//   setFilteredRooms(
//     homestayData.filter(
//       (room) => !roomType || room.id_Loai === parseInt(roomType)
//     )
//   );
//   return;
// }

// if (checkInDate >= checkOutDate) {
//   alert("Ngày nhận phòng phải trước ngày trả phòng.");
//   return;
// }

// const availableRooms = homestayData.filter((room) => {
//   if (roomType && room.id_Loai !== parseInt(roomType)) {
//     return false;
//   }

//   return !datHomestay.some((booking) => {
//     if (booking.id_homestay === room.id_homestay) {
//       const bookingCheckIn = new Date(booking.ngay_dat);
//       const bookingCheckOut = new Date(booking.ngay_tra);
//       return isOverlap(checkInDate, checkOutDate, bookingCheckIn, bookingCheckOut);
//     }
//     return false;
//   });
// });

// setFilteredRooms(availableRooms);
// };

const filterRooms = () => {
  const target = document.getElementById('rooms_section');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }

  const checkInDate = checkIn ? new Date(checkIn) : null;
  const checkOutDate = checkOut ? new Date(checkOut) : null;

  if (!checkIn || !checkOut) {
    setFilteredRooms(
      homestayData.filter((room) => {
        const withinPriceRange =
          room.gia_homestay >= priceRange.min &&
          room.gia_homestay <= priceRange.max;
        return (!roomType || room.id_Loai === parseInt(roomType)) && withinPriceRange;
      })
    );
    return;
  }

  if (checkInDate >= checkOutDate) {
    alert("Ngày nhận phòng phải trước ngày trả phòng.");
    return;
  }

  const availableRooms = homestayData.filter((room) => {
    const withinPriceRange =
      room.gia_homestay >= priceRange.min &&
      room.gia_homestay <= priceRange.max;

    if (!withinPriceRange) {
      return false;
    }

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

const [sortOption, setSortOption] = useState('latest'); // Mặc định là 'latest'
const [priceMin, setPriceMin] = useState(''); // Giá thấp nhất
const [priceMax, setPriceMax] = useState(''); // Giá cao nhất
const roomsPerPage = 5; // Số lượng phòng mỗi trang

// Hàm phân trang
const paginate = (rooms) => {
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  return rooms.slice(indexOfFirstRoom, indexOfLastRoom);
};

const handleSort = (option) => {
  setSortOption(option);
  let sortedRooms = [...homestayData]; // Tạo bản sao để sắp xếp

  // Lọc theo khoảng giá nếu có
  if (priceMin || priceMax) {
    sortedRooms = sortedRooms.filter(room => {
      const price = room.gia_homestay;
      return (
        (!priceMin || price >= priceMin) && (!priceMax || price <= priceMax)
      );
    });
  }

  // Sắp xếp theo lựa chọn
  if (option === 'priceAsc') {
    sortedRooms.sort((a, b) => a.gia_homestay - b.gia_homestay); // Giá tăng
  } else if (option === 'priceDesc') {
    sortedRooms.sort((a, b) => b.gia_homestay - a.gia_homestay); // Giá giảm
  } else {
    sortedRooms.sort((a, b) => b.id_homestay - a.id_homestay); // Mới nhất
  }

  // Cập nhật danh sách đã lọc
  setFilteredRooms(sortedRooms);
};

const handlePriceFilter = () => {
  handleSort(sortOption); // Áp dụng lại sắp xếp khi thay đổi giá
};

// Lọc và phân trang dữ liệu


// Các hàm đi tới trang, tiếp theo, và trước

// Hàm để tính toán các trang cần hiển thị


const getPageNumbers = () => {
  const pageNumbers = [];

  // Hiển thị trang 1, 2 và dấu ...
  if (currentPage > 2) pageNumbers.push(1);
  if (currentPage > 3) pageNumbers.push('...');
  if (currentPage > 1) pageNumbers.push(currentPage - 1);

  // Luôn hiển thị trang hiện tại
  pageNumbers.push(currentPage);

  // Hiển thị các trang tiếp theo
  if (currentPage < totalPages) pageNumbers.push(currentPage + 1);
  if (currentPage < totalPages - 1) pageNumbers.push('...');

  // Hiển thị trang cuối cùng
  if (currentPage < totalPages - 1) pageNumbers.push(totalPages);

  return pageNumbers;
};


const goToPage = (pageNumber) => {
  setCurrentPage(pageNumber);
  
  // Cuộn đến phần danh sách phòng
  if (listRef.current) {
    listRef.current.scrollIntoView({
      behavior: 'smooth',  // Cuộn mượt mà
      block: 'start',      // Cuộn đến vị trí phần tử ở trên cùng
    });
  }
};

const nextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
    
    // Cuộn đến phần danh sách phòng
    if (listRef.current) {
      listRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
    
    // Cuộn đến phần danh sách phòng
    if (listRef.current) {
      listRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
};

const showAllRooms = () => {
  setItemsPerPage(filteredRooms.length); // Hiển thị tất cả các phòng
  setCurrentPage(1); // Quay lại trang đầu tiên
  
  // Cuộn đến phần danh sách phòng
  if (listRef.current) {
    listRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};
const pageNumbers = getPageNumbers();

const [allRooms, setAllRooms] = useState([]); // Dữ liệu gốc từ API
const [minValue, setMinValue] = useState(300000); // Giá trị của thanh trượt "Từ"
const [maxValue, setMaxValue] = useState(600000); // Giá trị của thanh trượt "Đến"
const [priceRange, setPriceRange] = useState({ min: 300000, max: 600000 }); // Khoảng giá đã chọn
const [showFilter, setShowFilter] = useState(false); // Trạng thái ẩn/hiện
const handleMinChange = (e) => {
  let value = Math.min(parseInt(e.target.value, 10), maxValue);
  setMinValue(value);
  setPriceRange({ min: value, max: maxValue });
};

const handleMaxChange = (e) => {
  let value = Math.max(parseInt(e.target.value, 10), minValue);
  setMaxValue(value);
  setPriceRange({ min: minValue, max: value });
};

const handleApply = () => {
  const priceFilteredRooms = homestayData.filter(
    (room) =>
      room.gia_homestay >= priceRange.min && room.gia_homestay <= priceRange.max
  );

  if (priceFilteredRooms.length === 0) {
    alert("Không có phòng nào phù hợp với khoảng giá đã chọn!");
  } else {
    alert(
      `Hiển thị các phòng trong khoảng giá: ${priceRange.min.toLocaleString(
        "vi-VN"
      )} - ${priceRange.max.toLocaleString("vi-VN")} VND`
    );
  }

  setFilteredRooms(priceFilteredRooms);
  setCurrentPage(1); // Reset về trang đầu
};

const filterRoomsByPrice = () => {
  return allRooms.filter(
    (room) => room.gia_homestay >= minValue && room.gia_homestay <= maxValue
  );
};

  return (
    <main className="wrapperMain_content">
      <section className="layout-collections-all">
        <div className="wrapper-mainCollection">
          <div className="banner phong">
            <div className="wap_name_dt_rr">
              <div className="min_warp2">
                <div className="name_menu_date_restaurant" data-aos="fade-up"  data-aos-duration="3000">
                  <p className="name_menu">Khám phá dịch vụ & tiện nghi </p>
                  <h1 className="restaurant">Homestay</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="section-search">
            <div className="min_warp3">
            <div className="min_warp3">      
                {/* form */}
              <div className="form_booking">
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
                    <button type="button" className="ocean-button book_room" onClick={filterRooms}>
                      Đặt phòng
                    </button>
                  </div>
              </div>
            </div>             
            </div>
          </div>
          <section className="section-collection-about-1"  data-aos="fade-up"
           data-aos-anchor-placement="top-bottom" data-aos-duration="2000">
            <div className="min_warp2">
              <div className="heading-title text-center magin50">
                <p className="more1">Chào mừng bạn đến với Paradiso</p>
                <h2 className="more2">
                  Tận hưởng quang cảnh biển xanh từ những ngôi nhà với thiết kế
                  hiện đại
                </h2>
                <p className="heading-desc">
                  Paradiso cung cấp nhiều lựa chọn chỗ nghỉ cho các nhóm với mọi
                  quy mô. Cho dù bạn quan tâm đến chỗ nghỉ tại khu nghỉ dưỡng
                  dành cho doanh nghiệp hay gia đình, phòng lãng mạn cho hai
                  người hay nơi nghỉ dưỡng khép kín trong cabin, chúng tôi đều
                  có chỗ nghỉ hoàn hảo dành cho bạn. Đội ngũ của chúng tôi tận
                  tâm cung cấp dịch vụ và chỗ nghỉ ngoạn mục như quang cảnh.
                </p>
              </div>
            </div>
          </section>
          <section className="section-collection-col section-collection-col-1">
            <div className="col-banner" style={{"--bg-col-all": "url(//theme.hstatic.net/200000909393/1001269498/14/collection_col_1_banner.jpg?v=2537)"}}>
              <div className="container breadcrumb-content text-center"  data-aos="fade-up"
                data-aos-anchor-placement="top-bottom" data-aos-duration="2500"  > 
                <p className="breadcrumb-more1">
                  Chào mừng bạn đến với Paradiso
                </p>
                <h2>Khám phá Nhà gỗ &amp;Nhà nghỉ</h2>
                <p className="breadcrumb-more2">
                  Mang đến cho du khách bầu không khí lịch sự với những tiện
                  nghi hiện đại.
                </p>
              </div>
            </div>
            <div className="min_warp2">
              <div className="btn_slide">                    
              </div>
              <div className="row8"  id="rooms_section" ref={listRef}>
              {showFilter && ( // Chỉ hiển thị khi showFilter là true
              <div className="price-filter">
                  <span className="close-icon" onClick={() => setShowFilter(!showFilter)}>&times;</span>
                  <span>Khoảng giá:</span>
                  <div className="range-container">
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      value={minValue}
                      onChange={handleMinChange}
                      step={100000} // Bước nhảy 10.000
                      className="slider"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      value={maxValue}
                      step={100000} // Bước nhảy 10.000
                      onChange={handleMaxChange}
                      className="slider"
                    />
                  </div>
                  <div className="range-labels">
                    <span>{priceRange.min.toLocaleString("vi-VN")} VND</span>
                    <span>{priceRange.max.toLocaleString("vi-VN")} VND</span>
                  </div>
                  <button className="ocean-button index" onClick={handleApply}>Áp dụng</button>
              </div>
                 )}
              

                <div className="product-header">
                    <div className="product-title">Phòng tại Paradiso</div>
                      <div className="sort-options">
                      <div className="sort-options-con">
        <button
          className="searchh-button"
          onClick={() => setShowFilter(!showFilter)} // Toggle trạng thái
        >
          Tìm theo giá
        </button>
      </div>
                        <span>Sắp xếp theo:</span>
                        <Link
                          className={sortOption === 'latest' ? 'active' : ''}
                          onClick={() => handleSort('latest')}
                        >
                          Mới nhất
                        </Link>
                        <Link
                          className={sortOption === 'priceAsc' ? 'active' : ''}
                          onClick={() => handleSort('priceAsc')}
                        >
                          Giá tăng
                        </Link>
                        <Link
                          className={sortOption === 'priceDesc' ? 'active' : ''}
                          onClick={() => handleSort('priceDesc')}
                        >
                          Giá giảm
                        </Link>
                      </div>
                     
             
               </div>
              <ul className="homestay_li2" data-aos="fade-up" data-aos-duration="2000" >
              {currentRooms.length > 0 ? (
              currentRooms.map((room) => (
                  <li key={room.id_homestay}>
                    <p>
                      <div className="img_homstay">
                      <span 
                        className={`heart-icon ${existingFavorites.some(item => item.id_homestay === room.id_homestay) ? 'active' : ''}`} 
                        onClick={() => toggleFavorite(room)}
                      >
                        <i className="fa-solid fa-heart"></i>
                      </span>
                        <div className="pro-price">
                          <span className="price">
                            {room.gia_homestay.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                          </span>
                          <span>/ Đêm</span>
                        </div>
                        <div className="product--image img-slide">
                          {images.length > 0 ? (
                            images.map((image, index) => {
                              if (image.id_hinh === room.id_homestay) {
                                return (
                                  
                                  <div key={index} className="lazy-img">
                                    <img
                                      className="img-loop"
                                      src={image.url_hinh}
                                      alt={room.ten_homestay || 'Hình ảnh homestay'}
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
                    </div>
                    <div className="des_hst">
                      <div className="proloop-detail">
                        <h3>
                        <Link to={`/homestay/${room.id_homestay}?checkIn=${checkIn.toISOString()}&checkOut=${checkOut.toISOString()}`}>{room.ten_homestay}</Link>
                        </h3>
                        <div className="pro-tag">
                        {/* <p>Loại phòng: {room.Ten_Loai}</p> */}
                        {/* <div>
                          {room.bookings.length > 0 ? (
                            room.bookings.map((booking, index) => (
                              <p key={index}>
                              Đã đặt  ngày:{" "}
                                {new Date(booking.ngay_dat).toLocaleDateString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}{" "}
                                <strong>Đến</strong>{" "}
                                {new Date(booking.ngay_tra).toLocaleDateString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                })}
                              </p>
                            ))
                          ) : (
                            <p>Chưa có thông tin đặt phòng</p>
                          )}
                       </div> */}
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
                        <div className="pro-desc">{room.mota}</div>
                        {/* <div
                          className="pro-desc"
                          style={{
                            color: room.TrangThai === 'Còn phòng' ? 'green' : 'red',
                          }}
                        >
                          {room.TrangThai}
                        </div> */}
                        <div className="btn_ev">
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
                    </div>
                  </p>
                  </li>
                      ))
                    ) : (
                      <p>Không có phòng nào!.</p>
                    )}
              </ul>
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
                    <div className="pagination_phong">
                  {/* Nút "All" để hiển thị tất cả */}
                  <Link className="all_phong" onClick={showAllRooms}>
                    Tất Cả
                  </Link>

                  {/* Nút "Trước" */}
                  <Link className="prev_phong" onClick={prevPage}>
                    &laquo; Trước
                  </Link>

                  {/* Các trang */}
                  {pageNumbers.map((page, index) => (
                    <Link
                      key={index}
                      className={`page_phong ${currentPage === page ? 'active_phong' : ''}`}
                      onClick={() => {
                        if (page !== '...') {
                          goToPage(page);
                        }
                      }}
                    >
                      {page}
                    </Link>
                  ))}

                  {/* Nút "Tiếp" */}
                  <Link className="next_phong" onClick={nextPage}>
                    Tiếp &raquo;
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section className="section-collection-about-2"style={{"--bg-col-all":" url(//theme.hstatic.net/200000909393/1001269498/14/collection_about_2_banner.jpg?v=2537)"}}>
            <div className="container_homelist">
              <div className="heading-title text-center"  data-aos="fade-up"
     data-aos-anchor-placement="top-bottom" data-aos-duration="3000">
                <p className="more1">Chào mừng bạn đến với Maple Inn</p>
                <h2 className="more2">
                  Trải nghiệm lưu trú thoải mái và tiện nghi
                </h2>
                <p className="heading-desc" style={{color: '#fff'}}>
                  Để tạo sự thoải mái cho tất cả khách, tất cả các tiện nghi và
                  chỗ ở của chúng tôi đều không khói thuốc 100% – bất kể chất
                  liệu hay thiết bị. Tất cả các phòng đều có TV cáp, tủ lạnh
                  mini, máy pha cà phê, lò vi sóng và khăn trải giường và khăn
                  tắm miễn phí.
                </p>
                <div className="about-time">
                  <div>
                    <p className="time">
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24px" viewBox="0 0 24 24"  >
                        <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 6 L 11 12.414062 L 15.292969 16.707031 L 16.707031 15.292969 L 13 11.585938 L 13 6 L 11 6 z"></path>
                      </svg>
                      <span>Thời gian nhận phòng: 12:00 PM</span>
                    </p>
                  </div>
                  <div>
                    <p className="time">
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24px" viewBox="0 0 24 24" >
                        <path d="M 12 2 C 6.4889971 2 2 6.4889971 2 12 C 2 17.511003 6.4889971 22 12 22 C 17.511003 22 22 17.511003 22 12 C 22 6.4889971 17.511003 2 12 2 z M 12 4 C 16.430123 4 20 7.5698774 20 12 C 20 16.430123 16.430123 20 12 20 C 7.5698774 20 4 16.430123 4 12 C 4 7.5698774 7.5698774 4 12 4 z M 11 6 L 11 12.414062 L 15.292969 16.707031 L 16.707031 15.292969 L 13 11.585938 L 13 6 L 11 6 z"></path>
                      </svg>
                      <span>Check-out Time: 10:00 AM</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
{/* // <!-- form email --> */}
          <div className="email_newletter" data-aos="fade-up" data-aos-duration="1000" >
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
                                    modules={[ Autoplay]}
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
      </section>
    </main>
  );
};


export default Phong;
