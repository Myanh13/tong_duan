import React, { createContext, useState, useContext } from 'react';

// Tạo context
const SearchContext = createContext();

// Tạo Provider để chia sẻ trạng thái tìm kiếm
export const SearchProvider = ({ children }) => {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    return (
        <SearchContext.Provider value={{ query, setQuery, searchResults, setSearchResults }}>
            {children}
        </SearchContext.Provider>
    );
};

// Hook để sử dụng context
export const useSearch = () => {
    return useContext(SearchContext);
};
