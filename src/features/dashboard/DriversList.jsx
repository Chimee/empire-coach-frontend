

import React, { useEffect, useCallback, useState, useRef, use } from 'react'
import { ClockSvg } from '../../svgFiles/ClockSvg'
import { LocationSvg } from '../../svgFiles/LocationSvg'
import { useGetDriversListQuery } from '../../app/driverApi/driverApi'

const DriversList = () => {
    const [page, setPage] = useState(1);
    const { data, isFetching, isLoading } = useGetDriversListQuery({ page, limit: 10, search: "" }, { keepPreviousData: true });
    const [driverList, setDriverList] = useState([]);
    const scrollRef = useRef(null);
    const hasMore = data?.data?.data?.length > 0;

    useEffect(() => {
        if (data?.data?.data?.length) {
            setDriverList(prev =>
                page === 1 ? data.data.data : [...prev, ...data.data.data]
            );
        }
    }, [data]);

    const handleScroll = useCallback(() => {
        const scrollcontaner = scrollRef.current
        if (!scrollcontaner) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollcontaner;

        if (
            scrollTop + clientHeight >= scrollHeight - 50 &&
            !isFetching &&
            hasMore
        ) {
            setPage((prev) => prev + 1);
        }
    }, [isFetching, hasMore]);

    useEffect(() => {
        const scrollcontaner = scrollRef.current
        if (!scrollcontaner) return;
        scrollcontaner.addEventListener("scroll", handleScroll);
        return () => scrollcontaner.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);



    return (
        <div className='dashboard_card' ref={scrollRef}>
            <div className='d-flex gap-10px align-items-center justify-content-between dashboad-filter'>
                <h6 className='sub_heading mb-0'>Drivers</h6>
                <div className='d-flex gap-3 align-items-center'>
                    <span>Status :</span>
                    <select name="" id="">
                        <option value="">Submitted</option>
                    </select>
                </div>
            </div>
            <ul className='job_list d-flex flex-column gap-3 p-0'>
                {data.data.data.map((driver, i) => (
                    <li key={i}><div className='d-flex justify-content-between align-items-center mb-3'>
                        <div className='job_head'>
                            <p className='mb-2'>Job #44102</p>
                            <h6 className='mb-0'>driver.name</h6>
                        </div>
                    </div>
                        <h2 className='company_name'>2022 Blue Bird All American</h2>
                        <h2 className='company_name'>Progress </h2>
                        <div className='d-flex justify-content-between align-items-center'>
                            <div className='locations w-100  pr-3'>
                                <div className='location_inner'>
                                    <h6 className='pb-0 text-black'>Pickups</h6>
                                    <div className='d-flex align-items-center gap-2'>
                                        <LocationSvg className="flex-shrink-0" /> <span>Orlando, FL</span>
                                    </div>


                                </div>
                            </div>
                            <div className='locations w-100 text-end' >
                                <div className='location_inner d-inline-block text-start'>
                                    <h6 className='pb-0 text-black'>Dropoff</h6>
                                    <div className='d-flex align-items-center gap-2'>
                                        <LocationSvg className="flex-shrink-0" /> <span>Tampa, FL</span>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </li>
                ))}


            </ul>
             {isFetching && <p className="text-center">Loading more...</p>}
        </div>
    )
}

export default DriversList