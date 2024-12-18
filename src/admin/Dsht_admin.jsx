import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSearch } from "../searchContext";
import { Link } from "react-router-dom";

function Home_admin() {
    const [listSP, ganListSP] = useState([]); // Danh sách sản phẩm
    const { query, setQuery, searchResults, setSearchResults } = useSearch(); // Lấy query từ context
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
    const [error, setError] = useState(""); // Lỗi khi tìm kiếm
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            // Nếu có từ khóa tìm kiếm, gọi API tìm kiếm
            const url = query.trim()
                ? `https://tong-api-1.onrender.com/search_homestay?query=${query}`
                : 'https://tong-api-1.onrender.com/admin/homestay'; // Nếu không có từ khóa, gọi API lấy tất cả sản phẩm

            const response = await fetch(url);
            const data = await response.json();
            console.log('Dữ liệu từ API:', data); // Kiểm tra dữ liệu trả về từ API

            // Cập nhật dữ liệu vào context hoặc state
            if (query.trim()) {
                setSearchResults(data); // Cập nhật kết quả tìm kiếm vào context
            } else {
                ganListSP(data); // Cập nhật tất cả sản phẩm vào state
                setSearchResults([]); // Reset kết quả tìm kiếm khi không tìm kiếm
            }
        } catch (err) {
            setError('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Gọi hàm fetch data khi component được mount hoặc khi query thay đổi
    }, [query]);

    const xoaSP = (id) => {
        if (window.confirm('Xác nhận xóa ') === false) return;
        fetch(`https://tong-api-1.onrender.com/admin/homestay/${id}`, { method: "DELETE" })
            .then((res) => res.json())
            .then((data) => {
                alert('Đã xóa thành công');
                fetchData(); // Tải lại dữ liệu sau khi xóa
                navigate("/admin_danhsach");
            })
            .catch((err) => console.error('Lỗi khi xóa:', err));
    };

    return (
        <div className="admin_table_pra_wrapper">
            {loading && <p>Đang tải...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <h2 className="admin_table_pra_title">{query ? 'Kết quả tìm kiếm' : 'Danh Sách Homestay'}</h2>
            <table className="admin_table_pra">
                <thead>
                    <tr>
                        <th className="admin_table_pra_id">ID</th>
                        <th className="admin_table_pra_name">Tên Homestay</th>
                        <th className="admin_table_pra_image">Hình</th>
                        <th className="admin_table_pra_price">Giá Homestay</th>
                        <th className="admin_table_pra_status">Trạng Thái</th>
                        <th className="admin_table_pra_description">Mô Tả</th>
                        <th className="admin_table_pra_function">Chức Năng</th>
                    </tr>
                </thead>
                <tbody>
                    {query ? (
                        // Nếu có tìm kiếm, hiển thị kết quả tìm kiếm từ context
                        searchResults.length > 0 ? (
                            searchResults.map((sp) => (
                                <tr key={sp.id_homestay}>
                                    <td className="admin_table_pra_id">{sp.id_homestay}</td>
                                    <td className="admin_table_pra_name">{sp.ten_homestay}</td>
                                    <td className="admin_table_pra_image">
                                        <img src={sp.url_hinh || '/path/to/default-image.jpg'} alt={sp.ten_homestay} />
                                    </td>
                                    <td className="admin_table_pra_price">{sp.gia_homestay} <span>VND</span></td>
                                    <td
                                        className={`admin_table_pra_status ${
                                            sp.TrangThai === "Hết phòng" ? "red-text" : "green-text"
                                        }`}
                                    >
                                        {sp.TrangThai}
                                    </td>
                                    <td className="admin_table_pra_description">{sp.mota}</td>
                                    <td className="tooltip_table_admin">
                                        <div className="bisai">
                                            <button className="btn_table_admin btn-primary_table_admin">
                                                <Link to={`/admin_update_homestay/${sp.id_homestay}`}>Sửa</Link>
                                            </button>
                                            &nbsp;
                                            <button
                                                className="btn_table_admin btn-danger_table_admin"
                                                onClick={() => xoaSP(sp.id_homestay)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">Không có sản phẩm nào phù hợp với tìm kiếm.</td>
                            </tr>
                        )
                    ) : (
                        // Nếu không có query (tìm kiếm), hiển thị tất cả sản phẩm
                        listSP.length > 0 ? (
                            listSP.map((sp) => (
                                <tr key={sp.id_homestay}>
                                    <td className="admin_table_pra_id">{sp.id_homestay}</td>
                                    <td className="admin_table_pra_name">{sp.ten_homestay}</td>
                                    <td className="admin_table_pra_image">
                                        <img src={sp.url_hinh || '/path/to/default-image.jpg'} alt={sp.ten_homestay} />
                                    </td>
                                    <td className="admin_table_pra_price">{sp.gia_homestay} <span>VND</span></td>
                                    <td
                                        className={`admin_table_pra_status ${
                                            sp.TrangThai === "Hết phòng" ? "red-text" : "green-text"
                                        }`}
                                    >
                                        {sp.TrangThai}
                                    </td>
                                    <td className="admin_table_pra_description">{sp.mota}</td>
                                    <td className="tooltip_table_admin">
                                        <div className="bisai">
                                            <button className="btn_table_admin btn-primary_table_admin">
                                                <Link to={`/admin_update_homestay/${sp.id_homestay}`}>Sửa</Link>
                                            </button>
                                            &nbsp;
                                            <button
                                                className="btn_table_admin btn-danger_table_admin"
                                                onClick={() => xoaSP(sp.id_homestay)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">Không có sản phẩm nào.</td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Home_admin;
