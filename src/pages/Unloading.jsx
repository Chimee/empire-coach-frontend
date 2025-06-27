import React,{useState} from 'react'
import Button from '../components/shared/buttons/button'
import { LeftChevronSvg } from '../svgFiles/LeftChevronSvg'
import { RightChevronSvg } from '../svgFiles/RightChevronSvg'
import { CalendarSvg } from '../svgFiles/CalendarSvg'
import GridCard from '../components/shared/gridCard/GridCard'
import Datatable from '../components/shared/datatable/Datatable'
import AddRowMaterialModal from '../components/shared/modalContent/AddRowMaterialModal'
const Unloading = () => {
  const[addRowMaterial, setAddRowMaterial] = useState(false);
 const AddRowMaterial = () =>{
  setAddRowMaterial(true)
 }
    const tableHeadings = ["Supplier Name","Email", "Gender", "Phone Number", "Adress", "Date of Hire","Role","Status","Edit/Delete"]

  return (
    <div>
      {addRowMaterial && <AddRowMaterialModal show={addRowMaterial} setShow={setAddRowMaterial}/> }
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
      <Datatable title="Unloading Log" tabelHeadings={tableHeadings} onClick={AddRowMaterial} buttonTitle={"Add Raw Material"}>  
            <tr>
              <td className='highlight'>Jane Doe</td>
              <td>xyz@gmail.com</td>
              <td>Male</td>
              <td>9822576757</td>
              <td>South Jakarta xyz</td>
              <td>20/12/2024</td>
              <td><span className='cmn_badge'>Receiving Manager</span></td>
              <td><span className='cmn_badge'>Active</span></td>
              <td><Button size="xs" label="Edit"/></td>
            </tr>
        </Datatable>
    </div>
  )
}

export default Unloading