import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Ql_baiviet = () => {
  const [posts, setPosts] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().slice(0, 10)); // Ngày mặc định
  const [imageUrl, setImageUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Lấy danh sách bài viết từ API
  const fetchPosts = () => {
    fetch('https://tong-api-1.onrender.com/baiviet')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error('Dữ liệu không phải là mảng:', data);
        }
      })
      .catch((error) => {
        console.error('Có lỗi khi lấy dữ liệu bài viết!', error);
      });
  };
const [imageFile, setImageFile] = useState(null);  // State lưu file ảnh

// Hàm xử lý khi người dùng chọn file ảnh
const handleImageChange = (e) => {
  const file = e.target.files[0]; // Lấy file đầu tiên
  if (file) {
    setImageFile(file);  // Lưu file vào state
  }
};
  // Thêm bài viết mới
  const handleAddPost = () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', author);
    formData.append('publish_date', publishDate);
    if (imageFile) {
      formData.append('image', imageFile);  // Đính kèm file ảnh
    }
  
    fetch('https://tong-api-1.onrender.com/baiviet', {
      method: 'POST',
      body: formData,  // Gửi dữ liệu dạng FormData
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Bài viết đã được thêm:', data);
        setIsAdding(false);
        setTitle('');
        setContent('');
        setAuthor('');
        setPublishDate(new Date().toISOString().slice(0, 10)); // Reset lại ngày mặc định
        setImageUrl('');
        fetchPosts();
      })
      .catch((error) => {
        console.error('Có lỗi khi thêm bài viết mới!', error);
      });
  };
  
  const handleDelete = (id) => {
    // Hiển thị thông báo xác nhận trước khi xóa
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?');
  
    if (isConfirmed) {
      fetch(`https://tong-api-1.onrender.com/baiviet/${id}`, { method: 'DELETE' })
        .then(() => {
          alert('Bài viết đã được xóa thành công!');
          fetchPosts(); // Cập nhật danh sách bài viết sau khi xóa
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
      + Thêm bài viết
        </button> 
    <h1 className="admin_table_pra_title">Quản lý bài viết</h1>
    {isAdding && (
  <div className="add-user-form">
    <h2>Thêm bài viết mới</h2>
    <input
      type="text"
      placeholder="Tiêu đề"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
    />
    <input
      type="text"
      placeholder="Tác giả"
      value={author}
      onChange={(e) => setAuthor(e.target.value)}
      required
    />
    <textarea
      placeholder="Nội dung"
      value={content}
      onChange={(e) => setContent(e.target.value)}
      required
    />
     <input
      type="date"
      value={publishDate}
      onChange={(e) => setPublishDate(e.target.value)}
      required
    />
    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      required
    />
    {imageFile && (
      <div>
        <h4>Ảnh đã chọn:</h4>
        <img
          src={URL.createObjectURL(imageFile)}
          alt="Selected"
          style={{ width: '100px', height: 'auto' }}
        />
      </div>
    )}
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
          <th className="admin_table_pra_name">Tiêu đề</th>
          <th className="admin_table_pra_role">Ảnh</th>
          <th className="admin_table_pra_content">Nội dung</th>
          <th className="admin_table_pra_role">Tác giả</th>
          <th className="admin_table_pra_role">Ngày</th>
          <th className="admin_table_pra_function">Hành động</th>
        </tr>
      </thead>
      <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="admin_table_pra_id">{post.id}</td>
              <td className="admin_table_pra_name">
                {post.title}  {/* Hiển thị title mà không có input */}
              </td>
              <td className="admin_table_pra_role">
                <img src={post.image_url} alt={post.title} className="thumbnail" />  {/* Hiển thị ảnh mà không có input */}
              </td>
               <td className="admin_table_pra_description">
                {post.content}  {/* Hiển thị content mà không có input */}
              </td>
              <td className="admin_table_pra_role">
                {post.author}  {/* Hiển thị author mà không có input */}
              </td>
              <td className="admin_table_pra_role">
                {new Date(post.publish_date).toLocaleDateString("vi-VN")} {/* Hiển thị publish_date theo định dạng ngày/tháng/năm */}
              </td>
              <td className="atooltip_table_admin">
                <div className="bisai">
                <button
                      className="btn_table_admin btn-primary_table_admin"
                    >
                    <Link to={`/admin_postsua/${post.id}`}> Sửa</Link>
                    </button>
                    &nbsp;
                    <button
                      className="btn_table_admin btn-danger_table_admin"
                      onClick={() => handleDelete(post.id)}  
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

export default Ql_baiviet;
