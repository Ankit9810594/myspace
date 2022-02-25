import React, { Component } from 'react'
import { saveBook } from '../services/bookService';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'

import { ToastContainer, toast } from  'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Joi from "joi-browser";


class CreateBook extends Component {
	_isMounted = false;

	state = {
		
			name: "",
			description: "",

			buttonDisabled: false,
			//loading: true		
	}

	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	}

	validateBook = (m) => {
	    const schema = {
	        date: Joi.date().allow(''),
	        name: Joi.string().min(2).max(255).required(),
	        read: Joi.boolean().allow(''),
	        description: Joi.string().max(1024).allow('')        
	    };

	    return Joi.validate(m, schema);
	}

	handleSubmit = async ( event ) => {
		event.preventDefault();

		const data = {...this.state};
		delete data.buttonDisabled;
		delete data.loading;

		const {error} = this.validateBook(data)
		if (error) {
			toast.error(error.details[0].message) 
		}
		else {
			this.setState({buttonDisabled: true});
			try {
				await saveBook(data);	
				toast.dark("Added successfully")
			}	
			catch(error) {
				toast.error(error)
			}
		}	
	}

	handleClear = async () => {
		this.setState({
			name: "",
			description: "",

			buttonDisabled: false
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
				<Form onSubmit={this.handleSubmit}>
					<Form.Row>
						<Form.Group as={Col} controlId="">
				    		<Form.Label>Name</Form.Label>
				    		<Form.Control 
				    			type="text"
					    		placeholder="Book Name"
					    		name="name" 
					    		value={this.state.name} 
					    		onChange={this.handleChange}
				    		/>
						</Form.Group>
					</Form.Row>
					<Form.Row>
						<Form.Group as={Col} controlId="">
							<Form.Label>Description</Form.Label>
							<Form.Control 
								type="text"
								placeholder="some description..." 
								name="description" 
				    			value={this.state.description} 
				    			onChange={this.handleChange}
							/>
						</Form.Group>
					</Form.Row>

					<Button 
						variant="dark" 
						type="submit"
						disabled={this.state.buttonDisabled}
					>
						Add Book
					</Button>

					<Button 
						variant="danger" 
						className="ml-2"
						onClick={this.handleClear}
					>
						Clear
					</Button>
				</Form>
			</div>
			}	
		</div>
		)
	}
}

export default CreateBook
