import React, { useEffect, useState } from 'react'
import CommonSearch from '../../../components/common/commonSearch/commonSearch'
import CommonTable from '../../../components/common/commonTable/commonTable'
import CommonPagination from '../../../components/common/commonPagination/commonPagination'
import ProposalStatusChangeModel from '../../../components/models/proposalStatusChangeModel/proposalStatusChangeModel'
import { useSelector } from 'react-redux'
import CommonLoader from '../../../components/common/commonLoader/commonLoader'
import { useNavigate } from 'react-router-dom'
import { PolicyValidate } from '../../../utils/valitations/Valitation'



const Proposal = () => {
    const userData = useSelector((state) => state.user.userData);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusChangeModelShow, setStatusChangeModel] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        setPageLoading(true)
        if (userData) {
            const isFinanceAvailable = PolicyValidate(userData, "FINANCE");
            const isFinanceBudgetAvailable = PolicyValidate(userData, "FINANCE_BUDGET_PROPOSAL");
            if (isFinanceAvailable && isFinanceBudgetAvailable) {
                setPageLoading(false);
            } else {
                navigate('/dashboard')

            }
        }
    }, [userData])

    const handleCloseStatusChangeModel = () => { setStatusChangeModel(false); }
    const handleShowStatusChangeModel = () => { setStatusChangeModel(true); }
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
            label: "Date",
            value: "date"
        },
        {
            label: "From",
            value: "from"
        },
        {
            label: "Title",
            value: "title"
        },
        {
            label: "Amount(LKR)",
            value: "amount"
        },
        {
            label: "Status",
            value: "status"
        },
        {
            label: "",
            value: "ACTION",
            type: ["EDIT", "VIEW"]
        },
    ]

    const tableData = [
        {
            id: "P001",
            date: "28 Jan, 12.30 AM",
            from: "CS chapter",
            title: "Fund for Shopping",
            amount: "2500.00",
            status: "RECIEVED"
        }
    ]
    return (
        <>
            {pageLoading ? (
                <CommonLoader />
            ) : (
                <div className='container'>
                    <div className='text-cl-primary'>Proposal</div>
                    <div className='mt-3 pt-4 p-3 rounded-4 bg-white common-shadow'>
                        <div className='d-flex justify-content-between flex-wrap align-items-center p-3'>
                            <div>
                                <CommonSearch primary={true} />
                            </div>
                            <div>
                                <select className="form-select" aria-label="Default select example">
                                    <option selected>Select Status</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                        </div>

                        <div className='mt-3 p-3 rounded-4 bg-white d-flex flex-column justify-content-between table-container'>
                            <CommonTable tableHeading={tableHeading} tableData={tableData} primary={true} loading={false} editAction={(id) => { handleShowStatusChangeModel() }} />
                            <div className='mt-4 d-flex justify-content-end'>
                                <CommonPagination pages={10} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                            </div>
                        </div>

                    </div>
                </div>
            )}
            <ProposalStatusChangeModel show={statusChangeModelShow} onHide={handleCloseStatusChangeModel} />
        </>
    )
}

export default Proposal
