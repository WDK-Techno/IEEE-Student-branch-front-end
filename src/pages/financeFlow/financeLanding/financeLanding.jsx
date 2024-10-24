import React, { useEffect, useState } from 'react'
import CommonButton from '../../../components/common/commonButton/commonButton'
import BankAccountCard from '../../../components/common/bankAccountCard/bankAccountCard'
import FinanceChart from '../../../components/common/financeChart/financeChart'
import CommonBalanceCard from '../../../components/common/commonBalanceCard/commonBalanceCard'
import CommonFinanceTable from '../../../components/common/commonFinanceTable/commonFinanceTable'
import { useNavigate } from 'react-router-dom'
import AddTransectionModel from '../../../components/models/addTransectionModel/addTransectionModel'
import AddBankAccountModel from '../../../components/models/addBankAccountModel/addBankAccountModel'
import { useSelector } from 'react-redux';
import CommonLoader from '../../../components/common/commonLoader/commonLoader'
import { PolicyValidate } from '../../../utils/valitations/Valitation'
import { getAllAccount } from '../../../redux/actions/account'
import { getAllOuWallet, getMainWallet } from '../../../redux/actions/wallet'



const FinanceLanding = () => {


    const userData = useSelector((state) => state.user.userData);
    const [transectionModelShow, setTransectionModelShow] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [addBankModelShow, setAddBankModelShow] = useState(false);
    const [disable, setDisable] = useState(false);
    const [editable, setEditable] = useState(false);
    const [isFinanceAllPolicyAvailable, setIsFinanceAllPolicyAvailable] = useState(false);
    const [isFinanceTransactionPolicyAvailable, setIsFinanceTransactionPolicyAvailable] = useState(false);
    const [isFinanceBudgetPolicyAvailable, setIsFinanceBudgetPolicyAvailable] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [ouWallets, setOuWallets] = useState([]);
    const [mainWallet, setMainWallet] = useState([]);


    useEffect(() => {
        setPageLoading(true)
        if (userData) {
            const isFinanceAvailable = PolicyValidate(userData, "FINANCE");
            const FinanceAllPolicyAvailable = PolicyValidate(userData, "FINANCE_ALL");
            const FinanceTransactionPolicyAvailable = PolicyValidate(userData, "FINANCE_TRANSACTION");
            const FinanceBudgetPolicyAvailable = PolicyValidate(userData, "FINANCE_BUDGET_PROPOSAL");
            if (!isFinanceAvailable) {
                navigate('/dashboard')
            } else {
                setIsFinanceAllPolicyAvailable(FinanceAllPolicyAvailable);
                setIsFinanceBudgetPolicyAvailable(FinanceBudgetPolicyAvailable);
                setIsFinanceTransactionPolicyAvailable(FinanceTransactionPolicyAvailable);
                getAllAccounts();
                setPageLoading(false);
            }
        }
    }, [userData])



    useEffect(() => {
        if (isFinanceAllPolicyAvailable) {
            getMainWallet((res) => {
                if (res?.status == 200) {
                    setMainWallet(res?.data?.data)
                }
            })

            getAllOuWallet((res) => {
                if (res?.status == 200) {
                    setOuWallets(res?.data?.data)
                }
            })
        }
    }, [isFinanceAllPolicyAvailable])


    function getAllAccounts() {
        getAllAccount((res) => {
            if (res?.status == 200) {
                setAccounts(res?.data?.data)
            }
        })
    }

    const handleCloseTransectionModel = () => { setTransectionModelShow(false); }
    const handleShowTransectionModel = () => { setTransectionModelShow(true); }
    const handleCloseAddBankModel = () => {
        setAddBankModelShow(false);
        setDisable(false)
        setEditable(false)
    }

    function editAccount(item) {
        setDisable(false)
        setSelectedAccount(item)
        setEditable(true)
        handleShowAddBankModel()
    }

    function viewAccount(item) {
        setDisable(true)
        setSelectedAccount(item)
        setEditable(false)
        handleShowAddBankModel()
    }
    const handleShowAddBankModel = () => { setAddBankModelShow(true); }
    const navigate = useNavigate()
    function navigateToProposal() {
        navigate('proposal')
    }


    return (
        <>

            {pageLoading ? (
                <CommonLoader />
            ) : (
                <div className='container'>

                    <div className='d-flex justify-content-between align-items-center gap-3'>
                        <div className='text-cl-primary'>Accounts</div>
                        <div className='d-flex gap-3 flex-row'>
                            {
                                isFinanceAllPolicyAvailable && (
                                    <div className=''>
                                        <select class="form-select" aria-label="Default select example">
                                            <option selected hidden={true}>Select a Wallet</option>
                                            {
                                                mainWallet?.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.id}>Student Branch</option>
                                                    )
                                                })
                                            }
                                            {
                                                ouWallets?.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.id}>{item.ou.ouName}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                )
                            }

                            {
                                isFinanceTransactionPolicyAvailable && (
                                    <div>
                                        <CommonButton text={"Report"} onClick={() => { navigate('report') }} />
                                    </div>
                                )
                            }

                            {
                                isFinanceAllPolicyAvailable && (
                                    <div>
                                        <CommonButton onClick={handleShowAddBankModel} text={"Add Account"} />
                                    </div>
                                )
                            }

                        </div>


                    </div>
                    <div className='d-flex flex-wrap mt-3 gap-4'>
                        {
                            isFinanceAllPolicyAvailable && (

                                <div className='pb-3 d-flex flex-column align-items-center gap-3 overflow-scroll hide-scrollbar' style={{ maxHeight: 410 }}>
                                    {accounts?.map((item, index) => {
                                        return (
                                            <BankAccountCard key={index} Account={item} ViewAction={viewAccount} editAction={editAccount} />
                                        )
                                    })}
                                </div>


                            )
                        }

                        <div className='flex-grow-1'>
                            <FinanceChart />
                        </div>
                    </div>

                    <div className='d-flex justify-content-center justify-content-lg-between align-items-center flex-wrap gap-3 mt-5'>
                        <CommonBalanceCard wallet={true} text={"Wallet Balance"} amount={"5,680.00"} />
                        <CommonBalanceCard text={"Income"} amount={"5,680.00"} />
                        <CommonBalanceCard text={"Expense"} amount={"2,000.00"} />
                    </div>

                    <div className='mt-5 d-flex justify-content-between align-items-center gap-4 flex-wrap'>
                        <div className='text-cl-primary'>Accounts</div>
                        <div className='d-flex justify-content-end gap-4'>
                            {
                                isFinanceBudgetPolicyAvailable && (
                                    <div>
                                        <CommonButton text={"Go to proposal"} onClick={() => { navigateToProposal() }} />
                                    </div>
                                )
                            }


                            {
                                isFinanceTransactionPolicyAvailable && (
                                    <div>
                                        <CommonButton text={"Add Transaction"} onClick={handleShowTransectionModel} />
                                    </div>
                                )
                            }




                        </div>
                    </div>

                    <div className='mt-4'>
                        <CommonFinanceTable transectionPermission={isFinanceTransactionPolicyAvailable} />
                    </div>
                </div>
            )}


            <AddTransectionModel show={transectionModelShow} onHide={handleCloseTransectionModel} setTransectionModelShow={setTransectionModelShow} />
            <AddBankAccountModel show={addBankModelShow} onHide={handleCloseAddBankModel} disabled={disable} editable={editable} item={selectedAccount} change={getAllAccounts} />
        </>
    )
}

export default FinanceLanding
