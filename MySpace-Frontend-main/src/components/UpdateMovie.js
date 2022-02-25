import React, { Component } from 'react'
import { getMovie, updateMovie } from '../services/movieService'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'

import { ToastContainer, toast } from  'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Joi from "joi-browser"


class UpdateMovie extends Component {
	state = {
		_id: this.props.id,

		name: "",
		watched: "",
		date: "",
		description: "",
		
		buttonDisabled: false		
	}

	async componentDidMount() {
		const oldData = await getMovie(this.props.id);
		
		this.setState({
			name: oldData.data.name.toString(),
			watched: oldData.data.watched,
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

	validateMovie = (m) => {
	    const schema = {
	        date: Joi.date().allow(''),
	        name: Joi.string().min(2).max(255).required(),
	        watched: Joi.boolean().allow(''),
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

		const {error} = this.validateMovie(data);
		if (error) {
			toast.error(error.details[0].message); 
		}
		else {
			this.setState({buttonDisabled: true});
			try {
				await updateMovie(data, id);	
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
					    		placeholder="Movie Name"
					    		name="name" 
					    		value={this.state.name} 
					    		onChange={this.handleChange}
				    		/>
						</Form.Group>

						<Form.Group as={Col} controlId="">
							<Form.Label>Watched</Form.Label>
							<Form.Control 
								type="text"
								placeholder="Watched" 
								name="watched" 
				    			value={this.state.watched}
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
						Update Movie
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


export default UpdateMovie