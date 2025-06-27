import React,{useState} from 'react'
import Button from '../components/shared/buttons/button'
import { LeftChevronSvg } from '../svgFiles/LeftChevronSvg'
import { RightChevronSvg } from '../svgFiles/RightChevronSvg'
import { CalendarSvg } from '../svgFiles/CalendarSvg'
import GridCard from '../components/shared/gridCard/GridCard'
import Datatable from '../components/shared/datatable/Datatable'
import AddRowMaterialModal from '../components/shared/modalContent/AddRowMaterialModal'
const RejectionLog = () => {
  const[addWashing, setAddWashing] = useState(false);
 const AddWashing = () =>{
  setAddWashing(true)
 }
    const tableHeadings = ["Date","Supplier Name","Time", "Batch Code", "Cases Entered", "KG Entered ", "Cases Rejected","KG Rejected"]

  return (
    <div>
      {addWashing && <AddRowMaterialModal show={addWashing} setShow={setAddWashing}/> }
      <div className='overview cmn_card mb-3'>
            <div className='overview_header d-flex gap-2 align-items-center'>
            <h6 className='mb-0 flex-grow-1'>Overview</h6>
            <Button className="noTitleBtn" icon={LeftChevronSvg}/>
            <Button size="small" className="borderredBtn" icon={CalendarSvg} label="Date: 25-10-2024" />
            <Button className="noTitleBtn" icon={RightChevronSvg}/>
            </div>
            <ul className='m-0 grid_card_wrapper'>
                {Array(4).fill().map((_, index) => (        
            <GridCard key={index}/>
            ))}
        
            </ul>
      </div>
      <Datatable title="RejectionLog Log" tabelHeadings={tableHeadings} onClick={AddWashing} buttonTitle={"Add Raw Material"}>  
            <tr>
              <td>05-10-2025</td>
              <td className='highlight'>Jane Doe</td>
              <td>11:30 PM</td>
              <td>JDAUG12-1145</td>
              <td>200</td>
              <td>20/12/2024</td>
              <td>5600</td>
              <td>6.4</td>
              <td>180 KG</td>
            </tr>
        </Datatable>
    </div>
  )
}

export default RejectionLog