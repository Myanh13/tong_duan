import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import axios from 'axios';
const CamNang = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [latestArticles, setLatestArticles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isLatestPostsOpen, setLatestPostsOpen] = useState(true);
  const [isLatestCatasOpen, setLatestCatasOpen] = useState(false);
  
  
    const toggleLatestPosts = () => {
      setLatestPostsOpen(!isLatestPostsOpen);
    };
  
    const toggcata = () => {
      setLatestCatasOpen(!isLatestCatasOpen);
    };

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
              </ol>
            </div>
          </div>
        </div>
        <div className="wrapper-contentBlogs">
          <div className="min_warp2 pd-top">
            <div className="row6 dFlex-row">
              <div className="col-lg-9 col-md-12 col-12 boxBlog-left">
                <div className="listBlogs-content">
                  <div className="heading-page">
                    <h1>Tin tức</h1>  
                  </div>
                  <div className="list-article-content blog-posts row6">
                    {/* <!-- Begin: Nội dung blog --> */}
                    {articles.map((article) => (
                    <article className="article-loop col-md-6 col-6 col_col"  key={article.id}>
                      <div className="article-inner">
                        <div className="article-image">
                        <Link to={`/ct_camnang/${article.id}`} className="blog-post-thumbnail" title={article.title}>
                          <img src={article.image_url} alt={article.title} />
                        </Link>
                        </div>
                        <div className="article-detail">
                          <div className="article-title">
                            <h3 className="post-title">
                                <Link to={`/blogs/news/${article.slug}`} title={article.title}>
                                  {article.title}
                                </Link>
                            </h3>
                          </div>

                          <p className="entry-content">
                          {article.content}
                          </p>

                          <div className="article-post-meta">
                            <span className="author">bởi: {article.author}</span>
                            <span className="date">
                            <time>{new Date(article.publish_date).toLocaleDateString()}</time>
                              {/* <time pubdate datetime="22 Tháng 08, 2024">
                                22 Tháng 08, 2024
                              </time> */}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                   ))}
                  </div>
                  <div className="pagination-shop pagi  text-center">
                    <div id="pagination">
                      <ul className="pagination">
                        {[...Array(totalPages).keys()].map((page) => (
                        <li  key={page + 1}>
                              <Link   onClick={() => handlePageChange(page + 1)}
                                  className={currentPage === page + 1 ? "current" : ""}
                                  >{page + 1}
                             </Link>
                        </li>
                        ))}
                          <li>
                            <Link  onClick={() => handlePageChange(currentPage + 1)}>
                              <i className="fa fa-angle-double-right"></i>
                            </Link>
                        </li>
                      </ul>
                    </div>
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
export default CamNang;
