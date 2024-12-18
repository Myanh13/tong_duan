// import './dv.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
function Dichvu(){
    
    const scrollToService = (serviceId) => {
        const target = document.getElementById(serviceId);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 100,  // Giả sử header cao 100px
                behavior: 'smooth'
            });
        }
    };
    return (
        <div className="service">
            <div className="banner phong">
            <div className="wap_name_dt_rr">
              <div className="min_warp2">
                <div className="name_menu_date_restaurant" data-aos="fade-up"  data-aos-duration="3000">
                  <p className="name_menu">Khám phá dịch vụ & tiện nghi </p>
                  <h1 className="restaurant">Dịch Vụ</h1>
                </div>
              </div>
            </div>
          </div>
         <div className="min_warp4">
               {/* <!-- Thanh menu dịch vụ --> */}
               <div class="page_dv-services-menu">
                <div class="page_dv-horizontal-line"></div>
                <div class="page_dv-icon-start"></div>
                <div class="page_dv-icon-end"></div>

                <div class="page_dv-menu-item" onClick={() => scrollToService('service1')} >
                    <div class="page_dv-icon"><i class="fa-sharp-duotone fa-solid fa-car"></i></div>
                    Dịch vụ cho thuê xe
                </div>
                <div class="page_dv-menu-item" onClick={() => scrollToService('service2')}>
                    <div class="page_dv-icon"><i class="fa-solid fa-user-tie"></i></div>
                    Dịch vụ quản gia
                </div>
                <div class="page_dv-menu-item" onClick={() => scrollToService('service3')}>
                    <div class="page_dv-icon"><i class="fa-light fa-wifi"></i></div>
                    Wifi & Internet
                </div>
                <div class="page_dv-menu-item" onClick={() => scrollToService('service4')}>
                    <div class="page_dv-icon"><i class="fa-solid fa-jug-detergent"></i></div>
                    Dịch vụ giặt ủi
                </div>
                <div class="page_dv-menu-item" onClick={() => scrollToService('service5')}>
                    <div class="page_dv-icon"><i class="fas fa-utensils"></i></div>
                    Bữa sáng tại phòng
                </div>
                <div class="page_dv-menu-item" onClick={() => scrollToService('service6')}>
                    <div class="page_dv-icon"><i class="fa-solid fa-car-tunnel"></i></div>
                    Chỗ đậu xe riêng
                </div>
                <div class="page_dv-menu-item" onClick={() => scrollToService('service7')}>
                    <div class="page_dv-icon"><i class="fa-light fa-bell"></i></div>
                    Dịch vụ đặc biệt
                </div>
              </div>
         </div>
           <div class="min_warp2">
                {/* <!-- Nội dung dịch vụ --> */}
                <div class="page_dv-content page_dv-content-1"  id="service1">
                {/* <!-- Phần văn bản mô tả dịch vụ --> */}
                    <div class="page_dv-content-text">
                        <h2>Dịch vụ cho thuê xe</h2>
                        <p>Dịch vụ cho thuê xe mang đến sự tiện lợi và linh hoạt cho khách hàng khi di chuyển. Với nhiều loại xe từ xe máy, ô tô đến xe du lịch, người dùng có thể lựa chọn theo nhu cầu và ngân sách. Thủ tục thuê xe thường đơn giản, nhanh chóng, giúp tiết kiệm thời gian cho khách hàng. Dịch vụ này đặc biệt hữu ích cho những ai cần di chuyển trong thời gian ngắn mà không muốn mua xe.</p>
                        <ul>
                        <li>Xe máy: 100.000 - 150.000 VND/ngày</li>
                        <li>Xe ô tô 4 chỗ: 700.000 - 1.000.000 VND/ngày</li>
                        <li>Xe ô tô 7 chỗ: 1.000.000 - 1.500.000 VND/ngày</li>
                        </ul>
                        <div class="page_dv-buttons">
                        {/* <button class="page_dv-button">Thêm vào giỏ</button>
                        <button class="page_dv-button">Đặt ngay</button> */}
                        </div>
                    </div>

                    {/* <!-- Phần hình ảnh dịch vụ --> */}
                    <div class="page_dv-image" data-aos="fade-down-left" data-aos-duration="2000">
                        <img src="../../image/lx600.jpg" alt="Dịch vụ cho thuê xe"/>
                    </div>
                </div>
                <div class="page_dv-content page_dv-content-2"  id="service2">
                {/* <!-- Phần văn bản mô tả dịch vụ --> */}
                <div class="page_dv-content-text">
                    <h2>Dịch vụ cho Quản gia</h2>
                    <p> Khi nói đến việc cung cấp các dịch vụ quản gia, <strong>Paradiso</strong> hiểu nhu cầu và mong đợi của những quý khách hàng, những người sẵn sàng trả tiền cho chất lượng và dịch vụ hàng đầu.
                        Với trọng tâm là nhắm đến khách hàng cao cấp, chúng tôi đảm bảo rằng mỗi quản gia của chúng tôi được tuyển chọn kỹ lưỡng, có kinh nghiệm và có kỹ năng chuyên môn cao để đáp ứng tốt nhất các yêu cầu của khách hàng.
                    </p>
                    <ul>
                    <li>Xe máy: 100.000 - 150.000 VND/ngày</li>
                    <li>Xe ô tô 4 chỗ: 700.000 - 1.000.000 VND/ngày</li>
                    <li>Xe ô tô 7 chỗ: 1.000.000 - 1.500.000 VND/ngày</li>
                    </ul>
                    <div class="page_dv-buttons">
                    {/* <button class="page_dv-button">Thêm vào giỏ</button>
                    <button class="page_dv-button">Đặt ngay</button> */}
                    </div>
                </div>

                {/* <!-- Phần hình ảnh dịch vụ --> */}
                <div class="page_dv-image" data-aos="fade-down-right" data-aos-duration="2000">
                    <img src="../../image/dichvuquangia.jpg" alt="Dịch vụ cho thuê xe"/>
                </div>
                </div>
                <div class="page_dv-content page_dv-content-3" id="service3">
                {/* <!-- Phần văn bản mô tả dịch vụ --> */}
                <div class="page_dv-content-text">
                    <h2>Dịch vụ Wifi & Internet</h2>
                    <p>"Tốc độ mạng nhanh không chỉ tiết kiệm thời gian mà còn mở ra những cơ hội không ngờ." Tại <strong>Paradiso</strong> , chúng tôi hiểu rằng kết nối internet mượt mà là yếu tố không thể thiếu trong mỗi chuyến đi. Với dịch vụ Wi-Fi tốc độ cao, bạn có thể thoải mái làm việc, giải trí hoặc giữ liên lạc với gia đình và bạn bè mà không gặp bất kỳ trở ngại nào. Chỉ cần một cú nhấp chuột, cả thế giới sẽ nằm trong tầm tay của bạn."</p>
                    <ul>
                    </ul>
                    <div class="page_dv-buttons">
                    {/* <button class="page_dv-button">Thêm vào giỏ</button>
                    <button class="page_dv-button">Đặt ngay</button> */}
                    </div>
                </div>

                {/* <!-- Phần hình ảnh dịch vụ --> */}
                <div class="page_dv-image" data-aos="fade-down-left" data-aos-duration="2000">
                    <img src="../../image/wifi.jpg" alt="Dịch vụ cho thuê xe"/>
                </div>
                </div>
                 <div class="page_dv-content page_dv-content-4" id="service4">
                {/* <!-- Phần văn bản mô tả dịch vụ --> */}
                <div class="page_dv-content-text">
                    <h2>Dịch vụ Dịch vụ giặt ủi</h2>
                    <ul>
                    <p>"Không cần phải mang theo cả tủ đồ hay lo lắng về quần áo bẩn khi nghỉ tại <strong>Paradiso</strong>. Chúng tôi cung cấp dịch vụ giặt ủi nhanh chóng và chu đáo, để bạn có thêm thời gian tận hưởng kỳ nghỉ mà không phải bận tâm về những chi tiết nhỏ.
                    dịch vụ giặt ủi được thực hiện với tiêu chuẩn cao nhất. Chúng tôi sử dụng những sản phẩm chất lượng và kỹ thuật chuyên nghiệp để đảm bảo từng món đồ của bạn được chăm sóc cẩn thận. Quần áo của bạn không chỉ sạch mà còn được là ủi tinh tươm, sẵn sàng cho mọi hoạt động trong ngày"</p>
                  
                    </ul>
                    <div class="page_dv-buttons">
                    {/* <button class="page_dv-button">Thêm vào giỏ</button>
                    <button class="page_dv-button">Đặt ngay</button> */}
                    </div>
                </div>

                {/* <!-- Phần hình ảnh dịch vụ --> */}
                <div class="page_dv-image" data-aos="fade-down-right" data-aos-duration="2000">
                    <img src="../../image/giacui.jpg" alt="Dịch vụ cho thuê xe"/>
                </div>
                </div>
                <div class="page_dv-content page_dv-content-5" id="service5">
                {/* <!-- Phần văn bản mô tả dịch vụ --> */}
                <div class="page_dv-content-text">
                    <h2>Dịch vụ Bữa sáng tại phòng</h2>
                    <ul>
                    <p>"Thức dậy tại <strong>Paradiso</strong>, bạn sẽ cảm nhận được sự giao thoa giữa thiên nhiên và không gian sống. Ánh sáng buổi sáng dịu dàng tràn vào phòng, mời bạn bước ra ban công để hít thở không khí trong lành. Buổi sáng tại đây không chỉ là thời gian bắt đầu ngày mới mà còn là một khoảnh khắc thư thái mà bạn không thể bỏ lỡ,húng tôi mang đến cho bạn sự tiện nghi tối đa với dịch vụ bữa sáng tận phòng. Hãy thưởng thức những món ăn tươi ngon, nóng hổi ngay trên giường hoặc tại ban công riêng của bạn."</p>
                  
                    </ul>
                    <div class="page_dv-buttons">
                    {/* <button class="page_dv-button">Thêm vào giỏ</button>
                    <button class="page_dv-button">Đặt ngay</button> */}
                    </div>
                </div>

                {/* <!-- Phần hình ảnh dịch vụ --> */}
                <div class="page_dv-image" data-aos="fade-down-left" data-aos-duration="2000">
                    <img src="../../image/buasang2.jpg" alt="Dịch vụ cho thuê xe"/>
                </div>
                </div>
                <div class="page_dv-content page_dv-content-6" id="service6">
                {/* <!-- Phần văn bản mô tả dịch vụ --> */}
                <div class="page_dv-content-text">
                    <h2>Dịch vụ Chỗ đậu xe riêng</h2>
                    <ul>
                    <p>"Tại <strong>Paradiso</strong>, chúng tôi luôn đặt sự tiện lợi và an toàn của bạn lên hàng đầu. Homestay cung cấp chỗ đậu xe rộng rãi và được thiết kế đảm bảo an ninh, giúp bạn yên tâm tận hưởng kỳ nghỉ mà không cần lo lắng về phương tiện của mình "Dịch vụ chỗ đậu xe của chúng tôi không chỉ đáp ứng nhu cầu của xe máy mà còn đủ rộng rãi và thuận tiện cho cả ô tô. Với hệ thống quản lý chỗ đỗ hiện đại, bạn có thể an tâm về phương tiện của mình trong suốt thời gian lưu trú."."</p>
                
                    </ul>
                    <div class="page_dv-buttons">
                    {/* <button class="page_dv-button">Thêm vào giỏ</button>
                    <button class="page_dv-button">Đặt ngay</button> */}
                    </div>
                </div>

                {/* <!-- Phần hình ảnh dịch vụ --> */}
                <div class="page_dv-image" data-aos="fade-down-right" data-aos-duration="2000">
                    <img src="../../image/doxe.jpg" alt="Dịch vụ cho thuê xe"/>
                </div>
                </div>
                <div class="page_dv-content page_dv-content-7" id="service7">
                {/* <!-- Phần văn bản mô tả dịch vụ --> */}
                <div class="page_dv-content-text">
                    <h2>Dịch vụ theo yêu cầu</h2>
                    <ul>
                    <p>"Tại <strong>Paradiso</strong>, chúng tôi luôn sẵn sàng đáp ứng mọi nhu cầu đặc biệt của bạn. Dù đó là một bữa sáng theo khẩu vị riêng, dịch vụ giặt ủi nhanh, hay hỗ trợ sắp xếp các chuyến tham quan, đội ngũ của chúng tôi sẽ làm hết mình để mang đến cho bạn một kỳ nghỉ trọn vẹn và đáng nhớ  được thiết kế để phù hợp với từng khách hàng. Hãy cho chúng tôi biết những gì bạn cần, từ việc trang trí phòng cho dịp đặc biệt, tổ chức bữa ăn lãng mạn đến chuẩn bị phương tiện di chuyển. Chúng tôi sẽ biến mong muốn của bạn thành hiện thực."</p>
                    <li>Xe máy: 100.000 - 150.000 VND/ngày</li>
                    <li>Xe ô tô 4 chỗ: 700.000 - 1.000.000 VND/ngày</li>
                    <li>Xe ô tô 7 chỗ: 1.000.000 - 1.500.000 VND/ngày</li>
                    </ul>
                    <div class="page_dv-buttons">
                    {/* <button class="page_dv-button">Thêm vào giỏ</button>
                    <button class="page_dv-button">Đặt ngay</button> */}
                    </div>
                </div>

                {/* <!-- Phần hình ảnh dịch vụ --> */}
                <div class="page_dv-image" data-aos="fade-down-left"data-aos-duration="2000" >
                    <img src="../../image/yeucau.png" alt="Dịch vụ cho thuê xe"/>
                </div>
                </div>
           </div>
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
}

export default Dichvu;