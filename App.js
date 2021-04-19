import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import OrderHistoryScreen from './screens/OrderHistoryScreen'
import OrderItemHistoryScreen from './screens/OrderItemHistoryScreen'
import UserProfileScreen from './screens/UserProfileScreen'
import CheckoutScreen from './screens/CheckoutScreen'
import LandingPageScreen from './screens/LandingPageScreen'
import UserPaymentOptionsScreen from './screens/UserPaymentOptionsScreen'
import ResetPasswordScreen from './screens/ResetPasswordScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'

import AuthRoute from './routes/AuthRoute'
import AddressRoute from './routes/AddressRoute'

import { CartContext } from './context/CartContext'
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import CategoryScreen from './screens/CategoryScreen'
import AddChangeAddressScreen from './screens/AddChangeAddressScreen'
import AuthMenuScreen from './screens/AuthMenuScreen'
import MenuScreen from './screens/MenuScreen'
import SuccessfulOrderPlacedScreen from './screens/SuccessfulOrderPlacedScreen'

function App() {

	const [numCartItems, setNumCartItems] = useState(0);

	function changeNumCartItems(value) {
		if (value == 'add') {
			setNumCartItems(numCartItems + 1)
		}
		else if (value == 'remove') {
			setNumCartItems(numCartItems - 1)
		}
		
	  }

	  function hasAddress() {
		  console.log(`has address is ${localStorage.getItem('delAdd')}`)
		if (localStorage.getItem('delAdd')) {
			if (localStorage.getItem('delAdd') != '') {
			  return true
			} else {
			  return false
			}
		}
		return false
	  }

	return (
    	<Router>
			<CartContext.Provider value={{numCartItems, setNumCartItems}}>
			{/* <Container> */}
				{/* <Header /> */}
			{/* </Container> */}
			<main>
				<Container>
					<Switch>
						{/* USE THIS TO REDIRECT TO ADDRESS FORM IF THERE IS NO ADDRESS IN LOCAL STORAGE */}
						{/* <Route path='/'  exact render={() => (
							hasAddress() ? (
								<HomeScreen />
								// <Redirect to="/landing"/>
							) : (
								<Redirect to="/landing"/>
								
							)
							)} /> */}

						<Route path='/' component={HomeScreen} exact />
						<Route path='/product/:id' component={ProductScreen} />
						<Route path='/cart/:id?' component={CartScreen} />
						<Route path='/login' component={LoginScreen} exact />
						<Route path='/register' component={RegisterScreen} exact />
						<AuthRoute path='/order_history' component={OrderHistoryScreen} exact />
						<AuthRoute path='/order_history/:id' component={OrderItemHistoryScreen} />
						<AuthRoute path='/users/profile' component={UserProfileScreen} exact/>
						<AuthRoute path='/checkout' component={CheckoutScreen} exact/>
						<Route path='/landing' component={LandingPageScreen} exact/>
						<Route path='/category/:category' component={CategoryScreen} />
						<AuthRoute path='/payment_options' component={UserPaymentOptionsScreen} exact />
						<Route path='/forgot_password/:token' component={ResetPasswordScreen} />
						<Route path='/password_reset_request' component={ForgotPasswordScreen} exact />
						<Route path='/add_address' component={AddChangeAddressScreen} exact />
						<AuthRoute path='/auth_menu' component={AuthMenuScreen} exact/>
						<Route path='/menu' component={MenuScreen} exact />
						<AuthRoute path='/success' component={SuccessfulOrderPlacedScreen} exact/>
					</Switch>
				</Container>
			</main>
			<div style={{marginTop: '2rem'}}>
				<Footer />
			</div>
			</CartContext.Provider>
    	</Router>
  	);
}

export default App;
