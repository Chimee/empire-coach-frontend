import React ,{useRef} from 'react'
import Datatable from '../../components/shared/datatable/Datatable';
import { EditTableSvg } from '../../svgFiles/EditTableSvg';
import { useGetAllJobsByStatusQuery ,useFillingPoNumberMutation} from '../../app/customerApi/customerApi';
import { formatDateToMDY } from '../../helpers/Utils';
import { getClassByType } from '../../helpers/Utils';
import { useNavigate } from 'react-router';
import Button from '../../components/shared/buttons/button';
import VehicleDetailsModal from '../../components/shared/modalContent/FillingPoModel';
import toast from "react-hot-toast";

const JobsData = ({ tabName }) => {
    const navigate = useNavigate();
    const [page, setPage] = React.useState(1);
    const [search, setSearch] = React.useState("")
    const modalRef = useRef();
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleSearchJobs = (value) => {
        setSearch(value);
    }
    const[addPONumber,{isLoading :isFilling}] = useFillingPoNumberMutation();
    const { data: jobsList, isLoading, error } = useGetAllJobsByStatusQuery({ tabName: tabName, page: page, search: search });
    console.log(jobsList, "data from jobs api");

    const handleConfirm = async (jobId, poNumber) => {
        debugger;
  try {
    await addPONumber({ jobId, po_number: poNumber }).unwrap(); 
    
  } catch (error) {
    
    console.error("PO fill error:", error);
  }
};

  debugger;
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
        { label: "Route", accessor: "vin_number",
            cell:({row}) =>(
                <span className='adress-data'>
                {`${row.pickup_location} To ${row.dropoff_location}`}
                </span>
            )
         },
        // { label: "Job Link", accessor: "-" },
        {
            label: "Status",
            accessor: "actions",
            cell: ({ row }) => (
                <span
                    className={`fn-badge ${getClassByType(row?.request_status)}`}
                >
                    {row?.request_status}
                </span>
            ),
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
    {
    label: "PO Number",
    accessor: "po_number",
    cell: ({ row }) => (
      <>
        {row?.po_number ? (
          <span>{row?.po_number}</span>
        ) : (
        <Button
          size="xs"
          className="text-nowrap"
          label="Add PO"
          onClick={() => modalRef.current?.open(row)}
        />
      )}
    </>
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
                        state: { status: row?.request_status }
                    })}
                >
                    View
                </span>
            ),
        },
    ];
    return (
  <>
        <Datatable
            tableData={jobsList?.data}
            columns={columns}
            onPageChange={handlePageChange}
            page={page}
            showPegination={true}
            isLoading={false}
            showFilter={true}
            onFilterSearch={handleSearchJobs}
            title="Job List"
        />

        <VehicleDetailsModal 
         ref={modalRef}
         onConfirm={handleConfirm}
        
        />
        </>

    )
}

export default JobsData