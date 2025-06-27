import React from 'react'
import ReactPaginate from 'react-paginate';
import { PageRightSvg } from '../../../svgFiles/PageRightSvg';
import { PageLeftSvg } from "../../../svgFiles/PageLeftSvg";
const Pagination = ({totalPages,onPageChange}) => {
 
  return (
    <div className='pagination'>
        <ReactPaginate
        breakLabel="..."
        nextLabel={<PageRightSvg/>}
        onPageChange={(e)=>{onPageChange(e.selected + 1)}}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel={<PageLeftSvg/>}
        renderOnZeroPageCount={null}
      />
    </div>
  )
}

export default Pagination