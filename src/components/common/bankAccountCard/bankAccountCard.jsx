import React from 'react'
import circle from '../../../assets/images/Circles.png'
import Spiral from '../../../assets/images/Spiral.png'
import Spiral2 from '../../../assets/images/Spiral2.png'
import Edit from '../../../assets/icons/editWhite.png'
import View from '../../../assets/icons/viewWhite.png'

const BankAccountCard = ({ editAction, ViewAction, Account }) => {

    return (
        <>

            <div className='bag-primary d-flex flex-column rounded-3 p-3 common-transition' style={{ width: 310 }}>
                <div className='text-center' style={{ marginTop: -10 }}>
                    <img src={Spiral} className='w-50' />
                </div>

                <div className='d-flex justify-content-between align-items-center gap-2' style={{ marginTop: -30 }}>
                    <div className='d-flex gap-2 justify-content-end w-100'>
                        <div>
                            <button onClick={() => { editAction(Account) }} className='border-0 bg-transparent'>
                                <img style={{ width: 21, height: 17 }} src={Edit} />
                            </button>

                        </div>
                        <div>
                            <button onClick={() => { ViewAction(Account) }} className='border-0 bg-transparent'>
                                <img style={{ width: 21, height: 17 }} src={View} />
                            </button>
                        </div>
                    </div>

                </div>

                <div>
                    <div className='text-white' style={{ fontSize: 10 }}>
                        Account Number
                    </div>
                    <div className='text-white'>
                        <h6>{Account?.account_number}</h6>
                    </div>
                </div>

                <div className='d-flex justify-content-between align-items-center'>
                    <div>
                        <div className='text-white' style={{ fontSize: 10 }}>
                            Bank
                        </div>
                        <div className='text-white'>
                            <h6>{Account?.bank_name}</h6>
                        </div>
                    </div>
                    <div>
                        <div className='text-white text-end' style={{ fontSize: 10 }}>
                            Branch
                        </div>
                        <div className='text-white text-end'>
                            <h6>{Account?.branch}</h6>
                        </div>
                    </div>
                </div>
                <div className='text-start' style={{ marginBottom: -15, marginRight: -15, marginTop: -70 }}>
                    <img src={Spiral2} />
                </div>
                <div className='text-end' style={{ marginBottom: -15, marginRight: -15, marginTop: -50 }}>
                    <img src={circle} />
                </div>
            </div>

        </>
    )
}

export default BankAccountCard
