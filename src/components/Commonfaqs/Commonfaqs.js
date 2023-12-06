import  React  from 'react';
import './Commonfaqs.css';
import { connect } from 'react-redux';
import { data, defaultQuestions } from './../../data.js'

const Commonfaqs = ( { addUserQuestionToChat }) => {
	return (
         	<div className="commonfaqs">
            	<div className="faqs1">
              		<div className="faq" onClick={() => {addUserQuestionToChat(defaultQuestions[0].question)}}>{defaultQuestions[0].question}</div>
              		<div className="faq" onClick={() => {addUserQuestionToChat(defaultQuestions[1].question)}}>{defaultQuestions[1].question}</div>
            	</div>
            	<div className="faqs2">
              		<div className="faq" onClick={() => {addUserQuestionToChat(defaultQuestions[2].question)}}>{defaultQuestions[2].question}</div>
              		<div className="faq" onClick={() => {addUserQuestionToChat(defaultQuestions[3].question)}}>{defaultQuestions[3].question}</div>
            	</div>
          	</div> 
        )
}

export default Commonfaqs;