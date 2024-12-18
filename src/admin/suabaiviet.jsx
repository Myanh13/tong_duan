import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SuaPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Define state for title, content, author, publishDate, imageFile, and imageUrl
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // For holding the current image URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data for the post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://tong-api-1.onrender.com/baiviet/${id}`);
        if (!response.ok) {
          throw new Error(`Lỗi: Không thể lấy dữ liệu bài viết với ID ${id}`);
        }
        const data = await response.json();
        setTitle(data.title);
        setContent(data.content);
        setAuthor(data.author);
        setPublishDate(data.publish_date);
        setImageUrl(data.image_url); // Set the current image URL
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', author);
    formData.append('publish_date', publishDate);
  
    // Gửi URL hình cũ nếu không chọn ảnh mới
    if (imageFile) {
      formData.append('image', imageFile); // Đính kèm file ảnh mới
    } else {
      formData.append('image_url', imageUrl); // Gửi URL của ảnh cũ
    }
  
    try {
      const response = await fetch(`https://tong-api-1.onrender.com/baiviet/${id}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Cập nhật bài viết thất bại');
      }
  
      const data = await response.json();
      alert('Bài viết đã được cập nhật!');
      navigate('/admin_post');
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật bài viết!');
    }
  };

  // Formatting date for the input field
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  if (loading) {
    return <p>Đang tải dữ liệu bài viết...</p>;
  }

  if (error) {
    return <p>Lỗi: {error}</p>;
  }
  return (
    <div className="container_admin_pra _add_form_pra">
      <h2>Cập nhật Bài Viết</h2>
      <form>
        <div className="form-group_admin_pra">
          <label htmlFor="title">Tiêu đề</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group_admin_pra">
          <label htmlFor="author">Tác giả</label>
          <input
            type="text"
            id="author"
            name="author"
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="form-group_admin_pra">
          <label htmlFor="publish_date">Ngày xuất bản</label>
          <input
            type="date"
            id="publish_date"
            name="publish_date"
            className="form-control"
            value={publishDate ? formatDateForInput(publishDate) : ''}
            onChange={(e) => setPublishDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group_admin_pra">
          <label htmlFor="content">Nội dung</label>
          <textarea
            id="content"
            name="content"
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* Display current image */}
        {imageUrl && (
          <div className="form-group_admin_pra">
            <label>Hình ảnh hiện tại:</label>
            <img
              src={imageUrl}
              alt="Current Post"
              className="img-thumbnail"
              style={{ width: '150px', height: '140px' }}
            />
          </div>
        )}

        {/* Choose new image */}
        <div className="form-group_admin_pra">
          <label htmlFor="image">Chọn ảnh mới:</label>
          <input
            type="file"
            id="image"
            name="image"
            className="form-control"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        <div className="form-group_admin_pra">
          <button
            className="btn btn-warning"
            type="button"
            onClick={handleSave}
          >Cập nhật
          </button>
          &nbsp;
          <button className="btn btn-warning" type="button">
            <a href="/admin_post" className="btn btn-info">Danh sách</a>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SuaPost;
