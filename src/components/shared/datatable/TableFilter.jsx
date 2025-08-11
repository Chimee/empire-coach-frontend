
import { SearchSvg } from "../../../svgFiles/SearchSvg"
import { useState, useEffect } from "react";
const TableFilter = ({ title, buttonTitle, onClick, onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch?.(debouncedSearch);
    }, 500);

    return () => clearTimeout(handler);
  }, [debouncedSearch]);
  return (

    <div className="filter_head">
      <div className='fn-search'>
        <SearchSvg />
        <input onChange={(e) => {
          setSearchText(e.target.value);
          setDebouncedSearch(e.target.value); // update debounce source
        }} type="search" placeholder="Search by Job Id, VIN, PO Number Or Customer" />
      </div>
      <h3 className="flex-grow-1 mb-0">{title}</h3>{" "}
    </div>
  )
}

export default TableFilter