import './Modal.css';

const Modal = ({ handleClose, show, children }) => {
  console.log("----1------")
  console.log(show)
  console.log("----2-----")
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
     	  <div className="modalContainer">
        	<div className="confirmationHeading">
        		Are you sure you want to delete chat 
        	</div>
        	<div className="modalButtonContainer">
        		<div className="yesButton" onClick={() => {handleClose("true")}}> Yes </div>
        		<div className="noButton" onClick={() => {handleClose("false")}}> No </div>
        	</div>
          </div>
      </section>
    </div>
  );
};

export default Modal;