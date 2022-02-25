import React, { Component } from 'react'

import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'


class Welcome extends Component {
	
	render() {
		return (
			<div>
				<Container>
				<Alert variant="light">
					<center>
					<Alert.Heading>MySpace</Alert.Heading>
					<p>Welcome To MySpace</p>
					<hr />
					<p>
					</p>
					</center>	
				</Alert>
				</Container>
			</div>
		)
	}
}

export default Welcome