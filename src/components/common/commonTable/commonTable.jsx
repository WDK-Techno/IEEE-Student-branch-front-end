import React from 'react'
import financeIncome from '../../../assets/icons/financeIncome.png'
import financeExpence from '../../../assets/icons/financeExpence.png'
import editPrimary from '../../../assets/icons/editPrimary.png'
import viewPrimary from '../../../assets/icons/viewPrimary.png'
import deleteicon from '../../../assets/icons/delete.png'
import moreicon from '../../../assets/icons/info.png'
import moreiconPrimary from '../../../assets/icons/info_primary.png'
import viewDark from '../../../assets/icons/darkView.png'
import editDark from '../../../assets/icons/darkEdit.png'
import CommonStatusContainer from '../commonStatusContainer/commonStatusContainer'
import CommonPriorityContainer from '../commonPriorityContainer/commonPriorityContainer'


const CommonTable = ({ tableHeading, tableData, finance, primary, viewAction, editAction, deleteAction, moreAction, loading, report, serviceMyRequest, serviceAllRequests }) => {

    return (
        <div className='table-responsive overflow-y-scroll custom-scrollbar' style={{ maxHeight: report ? null : 500 }}>
            <table className="table table-hover">
                <thead className='sticky-top z-1'>
                    <tr>
                        {tableHeading?.map((item, index) => {
                            return (
                                <th key={index} scope="col" className={`${primary ? "bag-primary text-white" : finance ? "white text-cl-primary" : "bg-third text-white"}`}>{item.label}</th>
                            )
                        })}

                    </tr>
                </thead>
                <tbody>
                    {
                        loading ? (

                            <tr>
                                <td colSpan={tableHeading.length}>
                                    <div className="d-flex justify-content-center p-5 m-5">
                                        <div className={`spinner-border ${finance || primary ? "text-cl-primary" : "text-third"}`} role="status">
                                         </div>
                                    </div>
                                </td>
                            </tr>

                        ) :

                            tableData?.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        {tableHeading?.map((head, headIndex) => {
                                            if (head.value === "ACTION") {
                                                // Render buttons for actions
                                                return (
                                                    <td key={headIndex}>
                                                        {head.type.map((action, actionIndex) => {
                                                            let iconSrc = null;
                                                            let actionFunction = null;

                                                            if (action === "VIEW") {
                                                                iconSrc = primary || finance ? viewPrimary : viewDark;
                                                                actionFunction = viewAction;
                                                            } else if (action === "EDIT") {
                                                                iconSrc = primary || finance ? editPrimary : editDark;
                                                                actionFunction = editAction;
                                                            } else if (action === "DELETE") {
                                                                iconSrc = deleteicon;
                                                                actionFunction = deleteAction;
                                                            } else if (action === "MORE") {
                                                                iconSrc = primary || serviceAllRequests ? moreiconPrimary : moreicon;
                                                                actionFunction = moreAction;
                                                            }
                                                            if(serviceMyRequest && action == "DELETE" && item?.item?.status  == "REVIEWED"){
                                                                return null;   
                                                            }
                                                            return (
                                                                <button key={actionIndex} className='border-0 bg-transparent' onClick={() => actionFunction(item)}>
                                                                    <img src={iconSrc} style={{ width: 24 }} />
                                                                </button>
                                                            );  
                                                            
                                                        })}
                                                    </td>
                                                );
                                            } else if (finance) {
                                                // Render finance-related content
                                                if (head.value === "STARTIMAGE") {
                                                    return (
                                                        <td key={headIndex}>
                                                            <img
                                                                src={item.type === "INCOME" ? financeIncome : financeExpence}
                                                                style={{ width: 24 }}
                                                                alt={item.type === "INCOME" ? "Income" : "Expense"}
                                                            />
                                                        </td>
                                                    );
                                                } else if (head.value === "DEBIT") {
                                                    return (
                                                        <td key={headIndex}>
                                                            {item.type === "DEBIT" ? (
                                                                <div style={{ color: "#FE5C73" }}>-{item["amount"]}</div>
                                                            ) : (
                                                                null
                                                            )}
                                                        </td>
                                                    );
                                                } else if (head.value === "CREDIT") {
                                                    return (
                                                        <td key={headIndex}>
                                                            {item.type === "CREDIT" ? (
                                                                <div style={{ color: "#16DBAA" }}>+{item["amount"]}</div>
                                                            ) : (
                                                                null
                                                            )}
                                                        </td>
                                                    );
                                                } else if (head.value === "TRANSECTION") {
                                                    return (
                                                        <td key={headIndex}>
                                                            <h5>{item["title"]}</h5>
                                                            <p>{item["description"]}</p>
                                                        </td>
                                                    );
                                                } else if (head.value === "amount") {
                                                    return (
                                                        <td key={headIndex}>
                                                            {item.type === "INCOME" ? (
                                                                <div style={{ color: "#16DBAA" }}>+{item[head.value]}</div>
                                                            ) : (
                                                                <div style={{ color: "#FE5C73" }}>-{item[head.value]}</div>
                                                            )}
                                                        </td>
                                                    );
                                                } else if (head.value === "status") {
                                                    return (
                                                        <td key={headIndex}>
                                                            <CommonStatusContainer status={item[head.value]} />
                                                        </td>
                                                    );
                                                } else {
                                                    return (
                                                        <td key={headIndex}>
                                                            {item[head.value]}
                                                        </td>
                                                    );
                                                }
                                            } else if (head.value === "status") {
                                                // Render status using CommonStatusContainer when finance is false
                                                return (
                                                    <td key={headIndex}>
                                                        <CommonStatusContainer status={item[head.value]} />
                                                    </td>
                                                );
                                            } else if (head.value === "priority") {
                                                return (
                                                    <td key={headIndex}>
                                                        <CommonPriorityContainer priority={item[head.value]} />
                                                    </td>
                                                );
                                            } else {
                                                // Render regular item value
                                                return (
                                                    <td key={headIndex}>
                                                        {item[head.value]}
                                                    </td>
                                                );
                                            }
                                        })}
                                    </tr>
                                );
                            })}
                </tbody>

            </table>
        </div>

    )
}

export default CommonTable
