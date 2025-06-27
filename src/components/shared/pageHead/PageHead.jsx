import React from 'react'
import { PlusButtonSvg } from '../../../svgFiles/PlusButtonSvg'
const PageHead = ({onClick,title,description,addTitle,addDescritpion}) => {
  return (
   <div className='d-flex gap-3 align-items-center'>
                <div className='content_list flex-grow-1 '>
                    <div className='d-flex justify-content-between align-items-center user-block p-0 border-0'>
                        <div className='user-details'>
                            <h2>{title}</h2>
                            <p className='mb-0'>{description}</p>
                        </div>

                    </div>
                </div>
               {onClick && <div className='right_list'>
                    <div className='d-flex job_req justify-content-between align-items-center'>
                        <div className='create_job'>
                            <h6 className='text-white'>{addTitle}</h6>
                            <p>{addDescritpion}</p>
                        </div>
                        <PlusButtonSvg onClick={onClick} />
                    </div>
                </div>}
            </div>
  )
}

export default PageHead