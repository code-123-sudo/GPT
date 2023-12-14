import  React  from 'react';
import './Modal.css';
import Button from '@mui/material/Button';

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
     	  <div className="modalContainer">
        	<div className="confirmationHeading">
        		Are you sure you want to delete chat 
        	</div>
        	<div className="modalButtonContainer">
            <Button variant="outlined" className="yesButton" onClick={() => {handleClose("true")}}>Yes</Button>
            <Button variant="outlined" className="noButton" onClick={() => {handleClose("false")}}>No</Button>
        	</div>
          </div>
      </section>
    </div>
  );
};

export default Modal;