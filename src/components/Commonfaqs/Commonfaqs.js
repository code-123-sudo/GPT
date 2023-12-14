import  React  from 'react';
import './Commonfaqs.css';
import { connect } from 'react-redux';
import { data, defaultQuestions } from './../../data.js'
import Button from '@mui/material/Button';

const Commonfaqs = ( { addUserQuestionToChat }) => {
	return (
         	<div className="commonfaqs">
            	<div className="faqs1">
					<Button className="faq" variant="contained" onClick={() => {addUserQuestionToChat(defaultQuestions[0].question)}}>{defaultQuestions[0].question}</Button>
              		<Button className="faq" variant="contained" onClick={() => {addUserQuestionToChat(defaultQuestions[1].question)}}>{defaultQuestions[1].question}</Button>
            	</div>
            	<div className="faqs2">
              		<Button className="faq" variant="contained" onClick={() => {addUserQuestionToChat(defaultQuestions[2].question)}}>{defaultQuestions[2].question}</Button>
              		<Button className="faq" variant="contained" onClick={() => {addUserQuestionToChat(defaultQuestions[3].question)}}>{defaultQuestions[3].question}</Button>
            	</div>
          	</div> 
        )
}

export default Commonfaqs;