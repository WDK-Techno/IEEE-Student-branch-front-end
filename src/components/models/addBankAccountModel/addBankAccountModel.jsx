
import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import CommonButton from '../../common/commonButton/commonButton';
import { addAccount, editAccount } from '../../../redux/actions/account';


const AddBankAccountModel = ({ onHide, show, disabled, editable, id, item, change }) => {

    const [formData, setFormData] = useState({
        account_number: "",
        bank_name: "",
        branch: "",
        description: "",
    });

    const [error, setError] = useState({
        account_number: false,
        bank_name: false,
        branch: false,
        description: false,
        otherError: '',
    });

    const [loading, setLoading] = useState(false);



    useEffect(() => {
        if (!show) return;

        if (editable) {
            setFormData(item);
            setError({
                account_number: false,
                bank_name: false,
                branch: false,
                description: false,
                otherError: '',
            });
        } else if (disabled) {
            setFormData(item);
        } else {
            setFormData({
                account_number: "",
                bank_name: "",
                branch: "",
                description: "",
            });
        }
    }, [show, editable, disabled, item]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setError((prevError) => ({ ...prevError, [name]: false }));
    };



    function handleAddAccount() {

        setError({
            account_number: false,
            bank_name: false,
            branch: false,
            description: false,
            otherError: '',
        });
        if (!formData.account_number || !formData.bank_name || !formData.branch || !formData.description) {
            setError({
                ...error,
                account_number: !formData.account_number,
                bank_name: !formData.bank_name,
                branch: !formData.branch,
                description: !formData.description,
            });
            return;
        }

        setLoading(true);

        if (editable) {
            editAccount(item?.id, formData, (res) => {
                setLoading(false);
                if (res?.status === 200) {
                    change();
                    onHide();
                } else {
                    setError({
                        ...error,
                        otherError: "Failed to Edit Account",
                    });
                }
            })
            return;
        } else {
            addAccount(formData, (res) => {
                setLoading(false);
                if (res?.status === 201) {
                    change();
                    onHide();
                } else {
                    setError({
                        ...error,
                        otherError: "Failed to Add Account",
                    });
                }
            });
        }
    }





    return (
        <>
            <Modal
                show={show} onHide={onHide} animation={true}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className='text-cl-primary' id="contained-modal-title-vcenter">
                        {editable ? "Edit" : disabled ? "View" : "Add"} Account
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='d-flex flex-column'>
                        <div className="mt-3">
                            <label for="exampleFormControlInput1" className="form-label text-dark">Bank</label>
                            <select
                                name='bank_name'
                                value={formData.bank_name}
                                onChange={handleInputChange}
                                className={`form-select w-100 ${error.bank_name ? "is-invalid" : ""}`}
                                aria-label="Large select example" disabled={disabled}>
                                <option selected hidden={true}>Select bank</option>
                                <option value="Bank of Ceylon">Bank of Ceylon</option>
                                <option value="People's Bank">People's Bank</option>
                            </select>
                            <div className="invalid-feedback">
                                This field is required.
                            </div>
                        </div>
                        <div className='mt-3'>
                            <div className="">
                                <label for="exampleFormControlInput1" className="form-label text-dark">Branch</label>
                                <input
                                    name='branch'
                                    value={formData.branch}
                                    onChange={handleInputChange}
                                    className={`form-select ${error.branch ? "is-invalid" : ""}`}
                                    type="text" id="exampleFormControlInput1" placeholder="branch" disabled={disabled} />
                                <div className="invalid-feedback">
                                    This field is required.
                                </div>
                            </div>
                        </div>
                        <div className='mt-3'>
                            <div className="">
                                <label for="exampleFormControlInput1" className="form-label text-dark">Account Number</label>
                                <input type="number"
                                    name='account_number'
                                    value={formData.account_number}
                                    onChange={handleInputChange}
                                    className={`form-select ${error.account_number ? "is-invalid" : ""}`}
                                    id="exampleFormControlInput1" placeholder="account number" disabled={disabled} />
                                <div className="invalid-feedback">
                                    This field is required.
                                </div>
                            </div>
                        </div>
                        <div className='mt-3'>
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Description</label>
                                <textarea
                                    name='description'
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className={`form-select ${error.description ? "is-invalid" : ""}`}
                                    id="exampleFormControlTextarea1" rows="3" disabled={disabled}></textarea>
                                <div className="invalid-feedback">
                                    This field is required.
                                </div>
                            </div>
                        </div>

                        <div className='w-100 text-center text-danger'>{error.otherError}</div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='d-flex justify-content-end'>
                    <div>
                        <CommonButton onClick={onHide} close={true} text={"Close"} />
                    </div>
                    {
                        disabled ? null : (
                            <div>
                                <CommonButton load={loading} onClick={() => { handleAddAccount() }} text={editable ? "Save" : "Add"} />
                            </div>
                        )
                    }


                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddBankAccountModel
