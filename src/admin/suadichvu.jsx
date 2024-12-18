import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SuaDichvu = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Define state for title, content, author, publishDate, imageFile, and imageUrl
  const [Ten_DV, setTen_DV] = useState('');
  const [Mo_ta, setMo_ta] = useState('');
  const [Gia, setGia] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data for the post
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`https://tong-api-1.onrender.com/dichvu/${id}`);
        if (!response.ok) {
          throw new Error(`Lỗi: Không thể lấy dữ liệu bài viết với ID ${id}`);
        }
        const data = await response.json();
        console.log(data);
        
        setTen_DV(data.Ten_DV);
        setMo_ta(data.Mo_ta);
        setGia(data.Gia);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

    fetchService();
  }, [id]);

  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const data = { Ten_DV, Mo_ta, Gia };    
    try {
        const response = await fetch(`https://tong-api-1.onrender.com/suadichvu/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
  
      if (!response.ok) {
        throw new Error('Cập nhật bài viết thất bại');
      }
  
      alert('Dịch vụ đã được cập nhật!');
      navigate('/admin_service');
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật!');
    }
  };


  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p>Lỗi: {error}</p>;
  }
  return (
    <div className="container_admin_pra _add_form_pra">
      <h2>Cập nhật Dịch vụ</h2>
      <form>
        <div className="form-group_admin_pra">
          <label htmlFor="Ten_DV">Tên Dịch vụ</label>
          <input
            type="text"
            id="Ten_DV"
            name="Ten_DV"
            className="form-control"
            value={Ten_DV}
            onChange={(e) => setTen_DV(e.target.value)}
            required
          />
        </div>

        <div className="form-group_admin_pra">
          <label htmlFor="Mo_ta">Mô tả</label>
          <input
            type="text"
            id="Mo_ta"
            name="Mo_ta"
            className="form-control"
            value={Mo_ta}
            onChange={(e) => setMo_ta(e.target.value)}
            required
          />
        </div>

        <div className="form-group_admin_pra">
          <label htmlFor="Gia">Giá </label>
          <input
            type="number"
            id="Gia"
            name="Gia"
            className="form-control"
            value={Gia}
            onChange={(e) => setGia(e.target.value)}
            required
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

export default SuaDichvu;
