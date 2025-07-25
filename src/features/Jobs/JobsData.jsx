import React from 'react'
import Datatable from '../../components/shared/datatable/Datatable';
import { useGetAllJobsByStatusQuery } from '../../app/customerApi/customerApi';
import { formatDateToMDY } from '../../helpers/Utils';
import { getClassAndTitleByStatus } from '../../helpers/Utils';
import { useNavigate } from 'react-router';
const JobsData = ({tabName}) => {
    const navigate = useNavigate();
    const [page, setPage] = React.useState(1);
    const[search,setSearch] = React.useState("")
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
      
   
    const handleSearchJobs = (value)=>{
     setSearch(value);
    }
    const { data: jobsList, isLoading } = useGetAllJobsByStatusQuery({ tabName: tabName, page: page ,search:search});
    console.log(jobsList, "data from jobs api");

    const handleConfirm = async (jobId, poNumber) => {
     try {
    //  await addPONumber({ jobId, po_number: poNumber }).unwrap(); 
    
    } catch (error) {
    
    console.error("PO fill error:", error);
    }
    };


    const columns = [
   {
            label: "Job Id",
            accessor: "id",
            cell: ({ row }) => (
                <span
                  
                >
                    {`job-${row?.id}`}
                </span>
            ),
        },
        { label: "Vehicle", accessor: "vehicle_make" },
        { label: "Vin Number", accessor: "vin_number" },
        { label: "Route", accessor: "vin_number" },
        { label: "Job Link", accessor: "vin_number" },
       {
                  label: "Status",
                  accessor: "actions",
                  cell: ({ row }) => {
                      const { className, title } = getClassAndTitleByStatus(row?.request_status);
      
                      return (
                          <span className={`fn-badge ${className}`}>
                              {title}
                          </span>
                      );
                  },
              },
        {
            label: "Pickup Date",
            accessor: "pickupDate",
            cell: ({ row }) => (
                <span>
                  {formatDateToMDY(row?.pickup_date)}
                </span>
            ),
        },
        {
            label: "Delivery Date",
            accessor: "pickupDate",
            cell: ({ row }) => (
                <span>
                    {formatDateToMDY(row?.dropoff_date)}
                </span>
            ),
        },
        { label: "Driver", accessor: "vin_number" },
        {
            label: "Actions",
            accessor: "actions",
            cell: ({ row }) => (
                <span
                    className="cursor-pointer text-primary"
                    onClick={() => navigate(`/jobs/job-details/${row.id}`, {
                   state: { status: row?.request_status }})}
                >
                   View
                </span>
            ),
        },
    ];
    return (

        <Datatable
            tableData={jobsList?.data}
            columns={columns}
            onPageChange={handlePageChange}
            page={page}
            showPegination={true}
            isLoading={isLoading}
            showFilter={true}
            onFilterSearch ={handleSearchJobs}
            title="Job List"
        />

    )
}

export default JobsData