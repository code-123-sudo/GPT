import { render as rtlRender, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Provider } from 'react-redux';
import store from '../../store.js'
import UserInput from '../UserInput/UserInput.js'


const render = component => rtlRender(
	<Provider store={store}>
		{component}
	</Provider>
)

test('should render userInput component',() => {
	console.log(store)
	render(<UserInput/>)
	const userInputElement = screen.getByTestId('userinput-1');	
	expect(screen.getByTestId('userinput-1')).toBeInTheDocument()
    expect(userInputElement).toHaveTextContent('Who is Nelson Mandela')
})

