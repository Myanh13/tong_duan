import React from "react";
import { useSearch } from "../searchContext";
function Nav_admin() {

    const { query, setQuery, setSearchResults } = useSearch();  // Lấy query và setQuery từ context

    const handleSearchChange = async (e) => {
        setQuery(e.target.value);
        
      if (e.target.value) {
        // Gửi yêu cầu tìm kiếm đến API
        const response = await fetch(`https://tong-api-1.onrender.com/search?query=${e.target.value}`);
        const data = await response.json();
        setSearchResults(data);  // Cập nhật kết quả tìm kiếm
      } else {
        setSearchResults([]);  // Nếu không có gì tìm kiếm, reset kết quả
      }
    };
      
    return(
            <div>
                {/* <!-- Main Content --> */}
                <div className="main-content_admin_para">
                    <contens>
                        <div className="header-left_admin_para">
                            <button className="menu-toggle_admin_para">☰</button>

                            <input  type="text"
                                    placeholder="Enter keyword..."
                                    value={query}
                                    onChange= {handleSearchChange}
                                    style={{ padding: "10px", width: "300px" }}
                                />
                            
                        </div>

                      
                        <div className="header-right_admin_para">
                            <span>English</span>
                            <div className="notifications_admin_para">
                                <span>🔔</span>
                                <span className="badge_admin_para">4</span>
                            </div>
                        </div>
                    </contens>
                </div>
            </div>
    )
}

export default Nav_admin;