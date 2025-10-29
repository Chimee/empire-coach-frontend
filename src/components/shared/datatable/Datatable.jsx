// Datatable.js
import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import TableFilter from "./TableFilter";
import Pagination from "../pagination/Pagination";
import { capitalize, formatPhoneNumber } from "../../../helpers/Utils";

const Datatable = ({
  tableData,
  columns,
  title,
  onPageChange,
  page,
  showPegination = true,
  showFilter = {},
  isLoading = false,
  buttonTitle,
  onClick,
  onFilterSearch,
  dropdownItems,
  onDropdownSelect,
  dropdownView,
  onClickRow
}) => {
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

 

  useEffect(() => {
    if (tableData && tableData.data && Array.isArray(tableData.data)) {
      setTotalItems(tableData?.total);
    } else {
      setTotalItems(0);
    }
  }, [tableData]);

  if (!columns || !Array.isArray(columns)) {
    console.warn("columns is undefined or not an array:", columns);
    columns = [];
  }

  const getNestedValue = (obj, accessor, capi) => {
    let value = accessor
      ?.split(".")
      .reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : ""),
        obj
      );

    if (value && capi) {
      value = capitalize(value);
    }

    return value;
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div
      className={
        totalPages > 1
          ? "table_wrapper d-flex flex-column"
          : "table_wrapper d-flex flex-column singlePage"
      }
    >
      {showFilter === true && <TableFilter
        title={title}
        buttonTitle={buttonTitle}
        onClick={onClick}
        onSearch={onFilterSearch}
        dropdownItems={dropdownItems}
        onDropdownSelect={onDropdownSelect}
        dropdownView={dropdownView}
      />}
      <div className={"flex-grow-1"}>
        <Table responsive className="mb-0">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData?.data?.length > 0 ? (
              tableData?.data?.map((row, rowIndex) => (
                <tr key={rowIndex} onClick={() => onClickRow && onClickRow(row?.id)}>
                  {columns.map((column, colIndex) => {
                    let cellContent;

                    if (column.cell) {            
                      cellContent = column.cell({
                        row,
                        value: getNestedValue(
                          row,
                          column.accessor,
                          column.captialize || false
                        ),
                        index: rowIndex,
                      });
                    } else {
                      let value = getNestedValue(
                        row,
                        column.accessor,
                        column.captialize || false
                      );
                      cellContent = value;
                    }

                    return <td key={colIndex}>{cellContent}</td>;
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  {isLoading ? "Loading..." : "No data available"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <br />
      {showPegination && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default Datatable;