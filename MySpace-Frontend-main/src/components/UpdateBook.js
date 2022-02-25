import React, { Component } from 'react'
import { getBook, updateBook } from '../services/bookService'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'

import { ToastContainer, toast } from  'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Joi from "joi-browser"


class UpdateBook extends Component {
	state = {
		_id: this.props.id,

		name: "",
		read: "",
		date: "",
		description: "",
		
		buttonDisabled: false		
	}

	async componentDidMount() {
		const oldData = await getBook(this.props.id);
		
		this.setState({
			name: oldData.data.name.toString(),
			read: oldData.data.read,
			date: oldData.data.date,
			description: oldData.data.description.toString()
		});

		if (oldData.data.description === "") {
			this.setState({description: ""})
		}
	}

	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value
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
		const id = data._id;
		delete data._id;

		const {error} = this.validateBook(data);
		if (error) {
			toast.error(error.details[0].message); 
		}
		else {
			this.setState({buttonDisabled: true});
			try {
				await updateBook(data, id);	
				toast.dark("Updated successfully");
			}	
			catch(error) {
				toast.error(error);
			}
			this.props.handleUpdate();
		}	
	}


	render() {
		return (
			<div>
				<ToastContainer hideProgressBar position="bottom-right"  />

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

						<Form.Group as={Col} controlId="">
							<Form.Label>Read</Form.Label>
							<Form.Control 
								type="text"
								placeholder="read" 
								name="read" 
				    			value={this.state.read}
				    			disabled
							/>
						</Form.Group>
					</Form.Row>

					<Form.Group controlId="">
						<Form.Label>Date Added</Form.Label>
						<Form.Control 
							type="text"
							placeholder="" 
							name="date" 
				    		value={this.state.date}
				    		disabled
						/>
					</Form.Group>

					<Form.Group controlId="">
				    	<Form.Label>Description</Form.Label>
				    	<Form.Control  
				    		placeholder="some description..." 
				    		name="description" 
				    		value={this.state.description} 
				    		onChange={this.handleChange}
				    	/>
				  	</Form.Group>

					<br />
					
					<br />
					
					<Button 
						variant="dark" 
						type="submit"
						disabled={this.state.buttonDisabled}
					>
						Update Book
					</Button>{" "}

					<Button 
						variant="outline-dark"
						onClick={this.props.handleCancel}
					>
						Cancel
					</Button>
				</Form>
			</div>
		)
	}
}


export default UpdateBook