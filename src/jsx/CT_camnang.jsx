import React, { useEffect, useState,useRef } from "react";
import { Link,useNavigate ,useParams } from "react-router-dom"
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
const CT_camnag = () => {
    
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [latestArticles, setLatestArticles] = useState([]);
  const [posts, setPosts] = useState([]);
  const swiperRef = useRef(null); 
  const [rooms, setRooms] = useState([]);
  const [camnang, setcamnang] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  


  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  const fetchArticles = async (page) => {
    try {
      const response = await fetch(`https://tong-api-1.onrender.com/api/articles?page=${page}`);
      const data = await response.json();
      
      // Sắp xếp các bài viết theo ngày giảm dần
      const sortedArticles = data.articles.sort(
        (a, b) => new Date(b.publish_date) - new Date(a.publish_date)
      );

      setArticles(sortedArticles);
      setTotalPages(data.totalPages);

      // Lấy 5 bài viết mới nhất
      setLatestArticles(sortedArticles.slice(0, 5));
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };
  useEffect(() => {
    // Fetch data from API
    axios.get("https://tong-api-1.onrender.com/baivietmoi")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  //lay theo id
  useEffect(() => {
    axios.get(`https://tong-api-1.onrender.com/baiviet/${id}`)
        .then(response => {
            setcamnang(response.data);
        })
        .catch(err => {
            alert("Lỗi khi tải dữ liệu homestay");
        });
}, [id]);

const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

useEffect(() => {
  const fetchPosts = async () => {
    try {
      const response = await axios.get("https://tong-api-1.onrender.com/post_lienquan", {
       
      });
      setPosts(response.data); // Lưu bài viết vào state
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false); // Đánh dấu tải xong
    }
  };

  fetchPosts();
}, []);
const handleNextArticle = () => {
  const currentIndex = articles.findIndex(article => article.id === parseInt(id)); // Tìm index của bài viết hiện tại
  if (currentIndex === -1) return; // Nếu không tìm thấy bài viết, không làm gì

  const nextIndex = (currentIndex + 1) % articles.length; // Lấy index bài viết tiếp theo, quay lại bài đầu tiên nếu là bài cuối
  const nextArticleId = articles[nextIndex].id;
  navigate(`/ct_camnang/${nextArticleId}`); // Điều hướng đến bài viết tiếp theo
};


  // State to track whether the 'Bài viết mới nhất' section is open
  const [isLatestPostsOpen, setLatestPostsOpen] = useState(true);
  const [isLatestCatasOpen, setLatestCatasOpen] = useState(true);


  // Function to toggle the section
  const toggleLatestPosts = () => {
    setLatestPostsOpen(!isLatestPostsOpen);
  };

  // Function to toggle the section
  const toggcata = () => {
    setLatestCatasOpen(!isLatestCatasOpen);
  };


  // Hiển thị trạng thái tải hoặc bài viết khi đã tải xong
  if (loading) {
    return <div className="loading-spinner">Đang tải dữ liệu...</div>; // Hiển thị spinner hoặc thông báo tải
  }

  // Nếu không có bài viết hoặc gặp lỗi khi tải bài viết
  if (!articles.length || !camnang) {
    return <div ></div>;
  }
  return (
    <main className="wrapperMain_content">
      <div className="danh">12233</div>
      <div className="layout-blogs">
        <div className="breadcrumb-shop">
          <div className="min_warp2 ">
            <div className="breadcrumb-list  ">
              <ol
                className="breadcrumb breadcrumb-arrows"
                itemscope
                itemtype="http://schema.org/BreadcrumbList"
              >
                <li
                  itemprop="itemListElement"
                  itemscope
                  itemtype="http://schema.org/ListItem"
                >
                  <Link to="/" target="_self" itemprop="item">
                    <span itemprop="name">Trang chủ</span>
                  </Link>
                  <meta itemprop="position" content="1" />
                </li>

                <li
                  className="active"
                  itemprop="itemListElement"
                  itemscope
                  itemtype="http://schema.org/ListItem"
                >
                  
                  <Link to="/cndulich" target="_self" itemprop="item">
                    <span itemprop="name">Tin tức</span>
                  </Link>
                  <meta itemprop="position" content="2" />
                  
                </li>
                <li
                  className="active"
                  itemprop="itemListElement"
                  itemscope
                  itemtype="http://schema.org/ListItem"
                >
                  <Link to="" target="_self" itemprop="item">
                    <span itemprop="name">Chi tiết</span>
                  </Link>
                  <meta itemprop="position" content="2" />
                  
                </li>
              </ol>
            </div>
          </div>
        </div>
        <div className="wrapper-contentBlogs">
          <div className="min_warp2 pd-top">
            <div className="row6 dFlex-row">
              <div className="col-lg-9 col-md-12 col-12 boxBlog-left">
                <div className="listBlogs-content">               
                    <div className="container_camnang">
                    <h1 className="post-title_camnang">{camnang.title}</h1>
                    <div className="post-meta_camnang">
                      <span>by: {camnang.author}</span>
                      <span>{new Date(camnang.publish_date).toLocaleDateString()}</span>
                    </div>
                    <img
                      src={camnang.image_url || "https://via.placeholder.com/800x400"}
                      alt={camnang.title}
                      className="post-image_camnang"
                    />
                    <div className="post-content_camnang">{camnang.content}</div>
                    <div className="post-navigation_camnang">
                      <span>Đang xem: <strong>{camnang.title}</strong></span>
                      <a onClick={handleNextArticle}>Bài sau <i className="fa-light fa-chevron-right"></i></a>
                    </div>
                    </div>
                    <div className="sp_lienquan"> 
                        <ul class="homestay_list" data-aos="fade-up" data-aos-duration="2000"> </ul>
                        <div className="wap_title_btn">
                            <h2 className='text_24px'>Bài viết liên quan</h2>
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
                        </div>
                        <>
                        {posts.length > 0 ? (
                          <Swiper
                            slidesPerView={3}
                            spaceBetween={30}
                            pagination={{
                              clickable: true,
                            }}
                            autoplay={{
                              delay: 3000,
                              disableOnInteraction: false,
                            }}
                           
                            onSwiper={(swiper) => {
                              swiperRef.current = swiper; // Lưu instance của Swiper
                            }}
                            modules={[Pagination, Autoplay]}
                            className="mySwiper"
                          >
                            {posts.map((post) => (
                              <SwiperSlide key={post.id}>
                           
                                <div className="post-item_camnanglienquan">
                                   <Link to={`/ct_camnang/${post.id}`}> <img src={post.image_url} alt="Paddling Tour" className="post-image_camnanglienquan"/></Link>
                                    <div className="post-info_camnanglienquan">
                                        <h3 className="post-title_camnanglienquan">{post.title}</h3>
                                        <p className="post-meta_camnanglienquan">22 Tháng 08, 2024</p>
                                        <p className="entry_content">{post.content}</p>
                                    </div>
                                </div>
                                
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        ) : (
                          <p>Chưa có bài viết liên quan nào.</p> // Hiển thị thông báo khi không có bài viết
                        )}
                        </>
                            
                        
                    </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-12 col-12 boxBlog-right">
                <aside className="sidebar-blogs blogs-aside--sticky">
                  
                  {/* Bai viet moi nhat */}
                  <div className="group-sidebox">
                    <div className="sidebox-title" onClick={toggleLatestPosts}>
                      <h3 className="htitle">Bài viêt mới nhất</h3>
                    </div>
                    <div
                      className={`sidebox-content ${isLatestPostsOpen ? 'sidebox-content-togged' : ''}`}
                    >
                      <div className="list-blogs-latest">
                        {posts.map((post) => (
                          <div key={post.id} className="item-article clearfix">
                            <div className="post-image">
                              <Link to={`/ct_camnang/${post.id}`}>
                                <img
                                  className="lazyload"
                                  src={post.image_url}
                                  alt={post.title}
                                />
                              </Link>
                            </div>
                            <div className="post-content">
                              <h3>
                                <a href={``}>{post.title}</a>
                              </h3>
                              <p className="post-meta">
                                <span className="cate">Tin tức</span>
                                <span className="author d-none">
                                  <a href={``}></a>
                                </span>
                                <span className="date">- {new Date(post.publish_date).toLocaleDateString()}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* <!-- Menu bai viet --> */}

                  <div className="group-sidebox">
                  <div className="sidebox-title" onClick={toggcata}>
                      <h3 className="htitle">Menu</h3>
                    </div>
                    <div className={`sidebox-content ${isLatestCatasOpen ? 'sidebox-content-togged' : ''}`}>
                      <ul className="menuList-links">
                        <li className="">
                          <Link to="/" title="Trang chủ">
                            <span>Trang chủ</span>
                          </Link>
                        </li>

                        <li className="">
                          <Link to="#" title="Về Paradiso">
                            <span>Về Paradiso</span>
                          </Link>
                        </li>

                        <li className="">
                          <Link to="/phong" title="Phòng">
                            <span>Phòng</span>
                          </Link>
                        </li>

                        <li className="has-submenu level0 ">
                         <Link to="/dichvu"
                            title="Dịch vụ tại Paradiso"
                          >
                            Dịch vụ tại Paradiso
                            <span className="icon-plus-submenu plus-nClick1"></span>
                          </Link>
                          <ul className="submenu-links">
                            <li>
                            <Link to="#" title="Nhà hàng">
                                Nhà hàng
                              </Link >
                            </li>

                            <li>
                               <Link to="#"
                                title="Tiệc & Sự kiện"
                              >
                                Tiệc & Sự kiện
                              </Link>
                            </li>

                            <li>
                              <Link
                                to=""
                                title="Spa & Massage"
                              >
                                Spa & Massage
                              </Link>
                            </li>
                          </ul>
                        </li>

                        <li className=" active ">
                        <Link to="/cn_dulich" title="Cẩm nang du lịch">
                            <span>Cẩm nang du lịch</span>
                          </Link>
                        </li>

                        <li className="">
                        <Link to="/gioithieu" title="Giới thiệu">
                            <span>Giới thiệu</span>
                          </Link>
                        </li>

                        <li className="">
                          <Link to="/lienhe" title="Liên hệ">
                            <span>Liên hệ</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default CT_camnag;
