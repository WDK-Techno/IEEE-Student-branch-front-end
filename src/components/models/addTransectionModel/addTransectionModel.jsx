import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import CommonButton from "../../common/commonButton/commonButton";
import CommonSearchModel from "../commonSearchModel/commonSearchModel";
import { getAllAccount } from "../../../redux/actions/account";
import { addAccountTransection } from "../../../redux/actions/transection";
import { useSelector } from 'react-redux';
import { PolicyValidate } from "../../../utils/valitations/Valitation";
import { useNavigate } from "react-router-dom";
import { getMainWallet } from "../../../redux/actions/wallet";


const AddTransectionModel = ({
  onHide,
  show,
  setTransectionModelShow,
  disabled,
  editable,
  id,
}) => {
  const [method, setMethod] = useState("Bank");

  const methodsAll = ["Bank", "Inside", "Budget"];
  const methods = ["Inside", "Budget"];
  const userData = useSelector((state) => state.user.userData);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    amount: "",
    from_wallet_id: "",
    to_wallet_id: "",
    wallet_id: "",
    account_id: "",
  });


  const [error, setError] = useState({
    title: false,
    description: false,
    type: false,
    amount: false,
    from_wallet_id: false,
    to_wallet_id: false,
    wallet_id: false,
    account_id: false,
    other: false
  });

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [walletModelShow, setWalletModelShow] = useState(false);
  const [proposalModelShow, setProposalModelShow] = useState(false);
  const [isFinanceAllPolicyAvailable, setIsFinanceAllPolicyAvailable] = useState(false);
  const [isFinanceTransactionPolicyAvailable, setIsFinanceTransactionPolicyAvailable] = useState(false);
  const [isFinanceBudgetPolicyAvailable, setIsFinanceBudgetPolicyAvailable] = useState(false);
  const [mainWallet, setMainWallet] = useState(null);
  const navigate = useNavigate();
  const [isSbChecked, setIsSbChecked] = useState(false);

  useEffect(() => {
    if (show) {
      setIsSbChecked(false);
      reset();
      if (isFinanceAllPolicyAvailable) {
        getMainWallet((res) => {
          if (res?.status == 200) {
            setMainWallet(res?.data?.data?.[0])
          }
        })
      }
      getAllAccount((res) => {
        if (res?.status == 200) {
          setAccounts(res?.data?.data)
        }
      })
    }
  }, [show, isFinanceAllPolicyAvailable]);


  useEffect(() => {
    if (userData) {
      const isFinanceAvailable = PolicyValidate(userData, "FINANCE");
      const FinanceAllPolicyAvailable = PolicyValidate(userData, "FINANCE_ALL");
      const FinanceTransactionPolicyAvailable = PolicyValidate(userData, "FINANCE_TRANSACTION");
      const FinanceBudgetPolicyAvailable = PolicyValidate(userData, "FINANCE_BUDGET_PROPOSAL");
      editable || disabled ? setMethod("Budget") : FinanceAllPolicyAvailable ? setMethod("Bank") : setMethod("Budget");
      if (!isFinanceAvailable) {
        navigate('/dashboard')
      } else {
        setIsFinanceAllPolicyAvailable(FinanceAllPolicyAvailable);
        setIsFinanceBudgetPolicyAvailable(FinanceBudgetPolicyAvailable);
        setIsFinanceTransactionPolicyAvailable(FinanceTransactionPolicyAvailable);
      }
    }
  }, [userData])




  function reset() {
    setFormData({
      title: "",
      description: "",
      type: "",
      amount: "",
      from_wallet_id: "",
      to_wallet_id: "",
      wallet_id: "",
      account_id: "",
    })

    setError({
      title: false,
      description: false,
      type: false,
      amount: false,
      from_wallet_id: false,
      to_wallet_id: false,
      wallet_id: false,
      account_id: false,
      other: false
    })
  }



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setError((prevError) => ({ ...prevError, [name]: false }));
  };


  const handleShowWalletModelShow = () => {
    setWalletModelShow(true);
  };
  const handleShowProposalModelShow = () => {
    setProposalModelShow(true);
  };

  const handleCheckboxChange = (e) => {
    console.warn(e.target.checked, "lllllll")
    setIsSbChecked(e.target.checked);
  };


  function submit() {
    setLoading(true);
    if (method == "Bank") {
      addBankTransection();
    }

  }

  function addBankTransection() {
    setError({
      title: false,
      description: false,
      type: false,
      amount: false,
      from_wallet_id: false,
      to_wallet_id: false,
      wallet_id: false,
      account_id: false,
      other: false
    });

    if (
      !formData.title ||
      !formData.account_id ||
      !formData.type ||
      !formData.amount ||
      !formData.description
    ) {
      setError({
        ...error,
        title: !formData.title,
        description: !formData.description,
        type: !formData.type,
        amount: !formData.amount,
        account_id: !formData.account_id,
      });
      return;
    }
    const data = {
      "title": formData.title,
      "description": formData.description,
      "type": formData.type,
      "amount": formData.amount,
      "account_id": formData.account_id,
      "to_wallet_id": isSbChecked ? mainWallet?.id : null
    }

    addAccountTransection(data, (res) => {
      if (res.status == 201) {
        setLoading(false);
        onHide();
      } else {
        setLoading(false);
        setError({
          ...error,
          other: true,
        });
      }
    })
  }




  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        animation={true}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title
            className="text-cl-primary"
            id="contained-modal-title-vcenter"
          >
            {editable ? "Edit" : disabled ? "View" : ""}Add Transaction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">
            {editable || disabled ? (
              <h3></h3>
            ) : (
              <div
                className="btn-group"
                role="group"
                aria-label="Basic example"
              >
                {(isFinanceAllPolicyAvailable ? methodsAll : methods).map((item, index) => {
                  return (
                    <button
                      onClick={() => {
                        setMethod(item);
                      }}
                      key={index}
                      type="button"
                      className={`btn ${item == method ? "bag-primary text-white" : "text-dark"
                        }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            )}


            <div className="mt-5">
              <div className="">
                <label
                  for="exampleFormControlInput1"
                  className="form-label text-dark"
                >
                  Title
                </label>
                <input
                  type="text"
                  name='title'
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`form-control w-100 ${error.title ? "is-invalid" : ""}`}
                  placeholder="title"
                  disabled={disabled}
                />
                <div className="invalid-feedback">
                  This field is required.
                </div>
              </div>
            </div>

            {method == "Bank" ? (
              <div className="mt-3">
                <label
                  for="exampleFormControlInput1"
                  className="form-label text-dark"
                >
                  Account
                </label>
                <select
                  name='account_id'
                  value={formData.account_id}
                  onChange={handleInputChange}
                  className={`form-control w-100 ${error.account_id ? "is-invalid" : ""}`}
                  aria-label="Large select example"
                  disabled={disabled}
                >
                  <option selected hidden={true}>Select Account</option>
                  {
                    accounts?.map((item, index) => {
                      return (
                        <option key={index} value={item?.id}>{item?.account_number + " - " + item?.bank_name}</option>
                      )

                    })
                  }
                </select>
                <div className="invalid-feedback">
                  This field is required.
                </div>
              </div>
            ) : null}

            {method == "Bank" ? (
              <div class="form-check mt-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  onChange={handleCheckboxChange}
                />
                <label class="form-check-label" for="flexCheckDefault">
                  Transfer to SB
                </label>
              </div>
            ) : null}



            <div className="mt-3">
              <label
                for="exampleFormControlInput1"
                className="form-label text-dark"
              >
                Type
              </label>
              <select
                aria-label="Large select example"
                disabled={disabled}
                name='type'
                value={formData.type}
                onChange={handleInputChange}
                className={`form-control w-100 ${error.type ? "is-invalid" : ""}`}
              >
                <option selected>Select Type</option>
                <option value="CREDIT">Credit</option>
                <option value="DEBIT">Debit</option>
              </select>
              <div className="invalid-feedback">
                This field is required.
              </div>
            </div>

            {disabled ? (
              <div className="mt-3">
                <label
                  for="exampleFormControlInput1"
                  className="form-label text-dark"
                >
                  From Wallet
                </label>
                <select
                  className="form-select w-100"
                  disabled={disabled}
                  aria-label="Large select example"
                >
                  <option selected>Select Wallet</option>
                </select>
              </div>
            ) : null}

            {method == "Budget" || method == "Inside" ? (
              <div className="mt-3">
                <label
                  for="exampleFormControlInput1"
                  className="form-label text-dark"
                >
                  To Wallet
                </label>
                <select
                  className="form-select w-100"
                  disabled={disabled}
                  onClick={() => {
                    setTransectionModelShow(false);
                    handleShowWalletModelShow();
                  }}
                  aria-label="Large select example"
                >
                  <option selected>Select Wallet</option>
                </select>
              </div>
            ) : null}

            {method == "Budget" ? (
              <div className="mt-3">
                <label
                  for="exampleFormControlInput1"
                  className="form-label text-dark"
                >
                  Budget proposal
                </label>
                <select
                  className="form-select w-100"
                  disabled={disabled}
                  onClick={() => {
                    setTransectionModelShow(false);
                    handleShowProposalModelShow();
                  }}
                  aria-label="Large select example"
                >
                  <option selected>Select Proposal</option>
                </select>
              </div>
            ) : null}

            <div className="mt-3">
              <div className="">
                <label
                  for="exampleFormControlInput1"
                  className="form-label text-dark"
                >
                  Amount
                </label>
                <input
                  type="number"
                  name='amount'
                  value={formData.amount}
                  onChange={handleInputChange}
                  className={`form-control w-100 ${error.amount ? "is-invalid" : ""}`}
                  placeholder="amount"
                  disabled={disabled}
                />
                <div className="invalid-feedback">
                  This field is required.
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div class="form-group">
                <label for="exampleFormControlTextarea1">Description</label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`form-control w-100 ${error.description ? "is-invalid" : ""}`}
                  rows="3"
                  disabled={disabled}
                ></textarea>
                <div className="invalid-feedback">
                  This field is required.
                </div>
              </div>
            </div>

            <div className="mt-3 w-100 text-center text-danger">{
              error.other ? "Failed to add transaction" : ''
            }</div>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end">
          <div>
            <CommonButton onClick={onHide} close={true} text={"Close"} />
          </div>
          <div>
            <CommonButton onClick={submit} text={"Add"} />
          </div>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default AddTransectionModel;
