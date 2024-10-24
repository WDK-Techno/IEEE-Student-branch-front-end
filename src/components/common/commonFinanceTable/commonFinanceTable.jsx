import React, { useEffect, useState } from 'react'
import CommonSearch from '../commonSearch/commonSearch';
import CommonTable from '../commonTable/commonTable';
import CommonPagination from '../commonPagination/commonPagination';
import AddTransectionModel from '../../models/addTransectionModel/addTransectionModel';


const CommonFinanceTable = ({ transectionPermission }) => {

  const [selectedType, setSelectedType] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [transectionModelShow, setTransectionModelShow] = useState(false);
  const [disable, setDisable] = useState(false);
  const [editable, setEditable] = useState(false);
  const [id, setId] = useState(null);

  const handleCloseTransectionModel = () => {
    setTransectionModelShow(false);
    setDisable(false)
    setEditable(false)
    setId(null)

  }
  const handleShowTransectionModel = () => { setTransectionModelShow(true); }

  function viewTransection(id) {
    setId(id)
    setDisable(true)
    setEditable(false)
    handleShowTransectionModel()
  }

  function editTransection(id) {
    setId(id)
    setDisable(false)
    setEditable(true)
    handleShowTransectionModel()
  }


  const typeDetail = [
    {
      label: "All Transactions",
      value: "ALL"
    },
    {
      label: "Income",
      value: "INCOME"
    },
    {
      label: "Expense",
      value: "EXPENSE"
    },
  ]

  const tableHeading = [
    {
      label: "",
      value: "STARTIMAGE"
    },
    {
      label: "ID",
      value: "id"
    },
    {
      label: "Description",
      value: "description"
    },
    {
      label: "Type",
      value: "type"
    },
    {
      label: "Date",
      value: "date"
    },
    {
      label: "Balance",
      value: "balance"
    },
    {
      label: "Amount",
      value: "amount"
    },
    {
      label: "",
      value: "ACTION",
      type: transectionPermission ? ["EDIT", "VIEW"] : ["VIEW"]
    },
  ]

  const tableData = [
    {
      id: "#12548796",
      description: "Spotify Subscription",
      type: "INCOME",
      date: "28 Jan, 12.30 AM",
      balance: "5750.00",
      amount: "2500.00",
    },
    {
      id: "#12548796",
      description: "Spotify Subscription",
      type: "EXPENCE",
      date: "28 Jan, 12.30 AM",
      balance: "5750.00",
      amount: "2500.00",
    }
  ]

  useEffect(() => {
    setSelectedType("ALL")
  }, [])
  return (
    <>
      <div>
        <div className='d-flex align-items-center gap-4'>
          {typeDetail.map((item, index) => {
            return (
              <div key={index} className='d-flex flex-column gap-1'>
                <div>
                  <button onClick={() => { setSelectedType(item.value) }} className='border-0 bg-transparent'>{item.lable}</button>
                </div>
                {item.value == selectedType ? <div className='bg-third' style={{ height: 2 }}></div> : null}
              </div>
            )
          })}
        </div>
        <div className='d-flex justify-content-end mt-3'>
          <CommonSearch primary={true} />
        </div>
        <div className='mt-3 p-3 rounded-4 bg-white common-shadow d-flex flex-column justify-content-between table-container'>
          <CommonTable tableHeading={tableHeading} tableData={tableData} finance={true} loading={false} viewAction={(id) => { viewTransection(id) }} editAction={(id) => { editTransection(id) }} />
          <div className='mt-4 d-flex justify-content-end'>
            <CommonPagination pages={10} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </div>

        </div>

      </div>
      <AddTransectionModel disabled={disable} editable={editable} id={id} show={transectionModelShow} onHide={handleCloseTransectionModel} setTransectionModelShow={setTransectionModelShow} />
    </>
  )
}

export default CommonFinanceTable
