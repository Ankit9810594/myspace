import React, { Component } from 'react'

import { getBooks, deleteBook, updateBook } from '../services/bookService';

import UpdateBook from './UpdateBook'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'

import Select from 'react-select'

import { ToastContainer, toast } from  'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


class ExploreBook extends Component {
	_isMounted = false;

	state = {
		bookId: "",
		
		name: "",
		description: "",
		read: "",
		date: "",
		
		books: [],

		totalread: 0.0,
		totalPending: 0.0,
		total: 0.0,
		
		view: false,
		buttonDisabled: false,
		selectDisabled: false,

		update: false,
		loading: true
	}

	populateBooks = async () => {
		const { data: books } = await getBooks();
		this._isMounted && this.setState({ books })
	}	

	
	async componentDidMount(){
		this._isMounted = true;

		this._isMounted && await this.populateBooks();
		this._isMounted && this.setState({loading: false})
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	handleChange = event => {
		const {name, value} = event.target
		this.setState({
			[name]: value
		})
	}

	handleSubmit = event => {
		event.preventDefault();

		const m = this.state.books.filter(i => i._id === this.state.bookId);		
		
		this.setState({
			view: true,
			buttonDisabled: true,
			selectDisabled: true
		})

		if (m.length !== 0) {
			this.setState({
				name: m[0].name,
				description: m[0].description,
				date: m[0].date,
				read: m[0].read
			})
		}

		// Calculate Totals
		if (m.length !== 0) {
			
			const totalRead = this.state.books.filter(i => i.read === true).length;
			const totalPending  =  this.state.books.filter(i => i.read === false).length;

			const total = this.state.books.length*1;

			this.setState({ totalRead, totalPending, total });
		}

	}

	handleBookSelect = e => {
		this.setState({
			bookId: e.value, 
			name: e.name
		})
	}

	handleReset = async () => {
		await this.populateBooks();
		this.setState({
			bookId: "",

			name: "",
			description: "",
			read: "",
			date: "",

			totalPending: 0.0,
			totalRead: 0.0,
			total: 0.0,
			
			view: false,
			buttonDisabled: false,
			selectDisabled: false		
		})
	}
	
	handleUpdate = async e => {
		if (this.state.bookId !== "") {
			this.setState({ update: true });
		}
	}

	handleDelete = async e => {
		e.preventDefault();
		try {
			this.setState({
				bookId: "",
				name: "",
				description: "",
				read: "",
				date: "",
			})
	    	await deleteBook(this.state.bookId)
	    	toast.dark("Deleted successfully");
	    }	
	    catch (ex) {
	    	toast.error(ex);
	    }
	}

	handleRead = async e => {
		e.preventDefault();console.log(this.state)
		try {
	    	if (this.state.read === true) {
	    		this.setState({
	    			"read": false, 
	    			"totalRead": this.state.totalRead*1 - 1,
					"totalPending": this.state.totalPending*1 + 1,
				})
	    		
	    		const data = {
	    			"name": this.state.name,
	    			"description": this.state.description,
	    			"read": this.state.read,
	    			"date": this.state.date,
	    		}
	    		
	    		await updateBook(data, this.state.bookId)
	    		toast.dark("Added to pending");
	    	}
	    	else {
	    		this.setState({
	    			"read": true, 
	    			"totalRead": this.state.totalRead*1 + 1,
					"totalPending": this.state.totalPending*1 - 1,	
	    		});
	    		
	    		const data = {
	    			"name": this.state.name,
	    			"description": this.state.description,
	    			"read": this.state.read,
	    			"date": this.state.date
	    		}
	    		
	    		await updateBook(data, this.state.bookId)
	    		toast.dark("Added to read");
	    	} 
	    }	
	    catch (ex) {
	    	if (ex.response && ex.response.status === 404) {
	    		toast.error("Some error");
	    	}
	    }
	}

	setCancel = e => {
		this.setState({
			update: false
		})
	}

	setUpdate = async () => {
		await this.populateBooks();

		const c = this.state.books.filter(i => i._id === this.state.bookId);
		
		this.setState({
			view: true,
			buttonDisabled: true,
			selectDisabled: true
		})

		if (c.length !== 0) {
			this.setState({
				name: c[0].name,
				description: c[0].description,
				date: c[0].date,
				read: c[0].read
			})
		}

		this.setState({
			update: false
		})
	}


	render() {
		return (
			<div>
			<ToastContainer hideProgressBar position="bottom-right"  />

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
			{ this.state.update 
				? <div>
					<br />
					<Alert variant="danger">
						<center>
						<Alert.Heading>Update Book</Alert.Heading>				
						</center>
					</Alert>	
					<br />
					<UpdateBook id={this.state.bookId} handleCancel={this.setCancel} handleUpdate={this.setUpdate}/>
				</div>
				:
				<div>
				<br />
				<Form onSubmit={this.handleSubmit}>
					<Form.Row>
						<Col xs={6}>
						    <Form.Label>Book Name</Form.Label>
					    </Col>
					    <Col>
					    	<Form.Label></Form.Label>
					    </Col>
				    </Form.Row>

				    <Form.Row>
					    <Col xs={4}>	
					    	<Select 
					   			onChange={this.handleBookSelect}
								options = {this.state.books.map(i => {
									return ({
										value: i._id, 
										label: `${i.name}`,
										name: i.name
									})
								})}
								isDisabled={this.state.selectDisabled} 
							/>
						</Col>
						<Col>
							<Button 
								variant="dark" 
								type="submit"
								disabled={this.state.buttonDisabled}
							>
								Choose
							</Button>
							{' '}
							<Button 
								variant="danger" 
								onClick={this.handleReset}
							>
								Reset
							</Button>
						</Col>
					</Form.Row>
				</Form>

				<br />

				{ this.state.view 
					? 
					<div>
						<br />
						<h4>{this.state.name}</h4>
						<br />

						<Row>
							<Col>
								<Alert variant='danger'>
									<center>
										<h5>Books Read</h5>
										<hr />
										<p>{this.state.totalRead}</p>
									</center>
								</Alert>
							</Col>
							<Col>
								<Alert variant='warning'>
									<center>
										<h5>Pending Books</h5>
										<hr />
										<p>{this.state.totalPending}</p>
									</center>
								</Alert>
							</Col>

							<Col>
								<Alert variant='success'>
									<center>
										<h5>Total</h5>
										<hr />
										<p>{this.state.total}</p>
									</center>
								</Alert>
							</Col>
						</Row>

						<br/>
						<h4>
							Book Details
							<Button 
								variant="outline-warning" 
								size="sm" 
								style={{float: 'right'}}
								onClick={this.handleUpdate}
							>
								Update
							</Button>
							
							<Button 
								variant="outline-danger" 
								size="sm" 
								style={{float: 'right', marginRight: 5}}
								onClick={this.handleDelete}
							>
								Delete
							</Button>
						</h4>
						
						<hr/>

						<Row>
							<Col xs={4}><p><b>Read</b></p></Col>
							<Col>
								<Button 
									variant="outline-primary" 
									onClick={this.handleRead}
									>
									{this.state.read ? "True" : "False"}
								</Button>
							</Col>
						</Row>

						< br />
							
						<Row>
							<Col xs={4}><p><b>Date Added</b></p></Col>
							<Col><p>{this.state.date}</p></Col>
						</Row>

						<Row>
							<Col xs={4}><p><b>Description</b></p></Col>
							<Col><p>{this.state.description}</p></Col>
						</Row>

						
						
					</div>
					:  
					<p>Choose a book name.</p>}
			</div>
			}
		</div>
		}	
		</div>
		)
	}
}

export default ExploreBook