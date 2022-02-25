import React, { Component } from 'react'

import { getBooks } from '../services/bookService';

import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'

import CreateBook from '../components/CreateBook'
import ExploreBook from '../components/ExploreBook'


class Book extends Component {
	_isMounted = false;

	state = {
		view: "explore",
		id: "",
		bookName: "",

		loading: true
	}

	async componentDidMount(){
		this._isMounted = true;
		
		if (this._isMounted) {
			const { data: books } = await getBooks();
			
			
			this.setState({loading: false})	
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	bookForm = () => {
		this.setState({
			view: "bookForm"
		})
	}

	report = () => {
		this.setState({
			view: "report"
		})
	}

	explore = () => {
		this.setState({
			view: "explore"
		})
	}


	renderView = () => {
		if (this.state.view==="explore") {
			return (
				<div>
					<Alert variant="dark">
						<center>
						<Alert.Heading>Explore Books</Alert.Heading>				
						</center>
					</Alert>	
					<ExploreBook/>
				</div>
			)
		}
		else if (this.state.view==="bookForm") {
			return (
				<div>
					<Alert variant="success">
						<center>
						<Alert.Heading>Add New Book</Alert.Heading>				
						</center>
					</Alert>	
					<br />
					<CreateBook />
				</div>
			)
		}
	}

	render() {
		return (
			<div>

				{ this.state.loading
						?
						<div>
							<center>
							<br />
							<br />
							<br />
							<Spinner size="sm" animation="grow" variant="danger" />{' '}
							<Spinner size="sm" animation="grow" variant="warning" />{' '}
							<Spinner size="sm" animation="grow" variant="success" />
							</center>
						</div>
						: 
						<div>
				
				<Container>
					<br />
					<h3>Books</h3>
					<br />

					<Button variant="dark" onClick={this.explore}>
						Explore
					</Button>{' '}

					<Button variant="dark" onClick={this.bookForm}>
						Add New
					</Button>{' '}

					<hr />
					<br />

					{this.renderView()}

				</Container>			
			</div>
			}	
		</div>
		)
	}
}

export default Book