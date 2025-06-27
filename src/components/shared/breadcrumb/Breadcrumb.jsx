import React from 'react';
import { Link } from 'react-router-dom';
import './breadcrumb.css'
const Breadcrumb = ({ items,title,description }) => {
    if (!items || items.length === 0) return null;

    return (
        <>
            <ul className="cmn_breadcurm ps-0">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const isHidden = item.name === '';

                    return (
                        <li key={index} className={isHidden ? 'd-none' : ''}>
                            {item.path && !isLast ? (
                                <Link to={item.path} className="breadcrumb-link">
                                    {item.name}
                                </Link>
                            ) : (
                                <span className="breadcrumb-current">{item.name}</span>
                            )}

                            {!isLast && !isHidden && (
                                <span className="breadcrumb-separator">
                                   /
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>
           {title && <h2 className='crumb-title'>{title}</h2>}
          {description &&  <p className='crumb-desc'>{description}</p>}
        </>
    );
};

export default Breadcrumb;