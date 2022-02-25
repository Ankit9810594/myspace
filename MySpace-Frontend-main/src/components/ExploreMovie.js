import React, { Component } from 'react'

import { getMovies, deleteMovie, updateMovie } from '../services/movieService';

import UpdateMovie from './UpdateMovie'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'

import Select from 'react-select'

import { ToastContainer, toast } from  'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


class ExploreMovie extends Component {
	_isMounted = false;

	state = {
		movieId: "",
		
		name: "",
		description: "",
		watched: "",
		date: "",
		
		movies: [],

		totalWatched: 0.0,
		totalPending: 0.0,
		total: 0.0,
		
		view: false,
		buttonDisabled: false,
		selectDisabled: false,

		update: false,
		loading: true
	}

	populateMovies = async () => {
		const { data: movies } = await getMovies();
		this._isMounted && this.setState({ movies })
	}	

	
	async componentDidMount(){
		this._isMounted = true;

		this._isMounted && await this.populateMovies();
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

		const m = this.state.movies.filter(i => i._id === this.state.movieId);		
		
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
				watched: m[0].watched
			})
		}

		// Calculate Totals
		if (m.length !== 0) {
			
			const totalWatched = this.state.movies.filter(i => i.watched === true).length;
			const totalPending  =  this.state.movies.filter(i => i.watched === false).length;

			const total = this.state.movies.length*1;

			this.setState({ totalWatched, totalPending, total });
		}

	}

	handleMovieSelect = e => {
		this.setState({
			movieId: e.value, 
			name: e.name
		})
	}

	handleReset = async () => {
		await this.populateMovies();
		this.setState({
			movieId: "",

			name: "",
			description: "",
			watched: "",
			date: "",

			totalPending: 0.0,
			totalWatched: 0.0,
			total: 0.0,
			
			view: false,
			buttonDisabled: false,
			selectDisabled: false		
		})
	}
	
	handleUpdate = async e => {
		if (this.state.movieId !== "") {
			this.setState({ update: true });
		}
	}

	handleDelete = async e => {
		e.preventDefault();
		try {
			this.setState({
				movieId: "",
				name: "",
				description: "",
				watched: "",
				date: "",
			})
	    	await deleteMovie(this.state.movieId)
	    	toast.dark("Deleted successfully");
	    }	
	    catch (ex) {
	    	toast.error(ex);
	    }
	}

	handleWatch = async e => {
		e.preventDefault();console.log(this.state)
		try {
	    	if (this.state.watched === true) {
	    		this.setState({
	    			"watched": false, 
	    			"totalWatched": this.state.totalWatched*1 - 1,
					"totalPending": this.state.totalPending*1 + 1,
				})
	    		
	    		const data = {
	    			"name": this.state.name,
	    			"description": this.state.description,
	    			"watched": false,
	    			"date": this.state.date,
	    		}
	    		
	    		await updateMovie(data, this.state.movieId)
	    		toast.dark("Added to pending");
	    	}
	    	else {
	    		this.setState({
	    			"watched": true, 
	    			"totalWatched": this.state.totalWatched*1 + 1,
					"totalPending": this.state.totalPending*1 - 1,	
	    		});
	    		
	    		const data = {
	    			"name": this.state.name,
	    			"description": this.state.description,
	    			"watched": true,
	    			"date": this.state.date
	    		}
	    		
	    		await updateMovie(data, this.state.movieId)
	    		toast.dark("Added to watched");
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
		await this.populateMovies();

		const c = this.state.movies.filter(i => i._id === this.state.movieId);
		
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
				watched: c[0].watched
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
						<Alert.Heading>Update Movie</Alert.Heading>				
						</center>
					</Alert>	
					<br />
					<UpdateMovie id={this.state.movieId} handleCancel={this.setCancel} handleUpdate={this.setUpdate}/>
				</div>
				:
				<div>
				<br />
				<Form onSubmit={this.handleSubmit}>
					<Form.Row>
						<Col xs={6}>
						    <Form.Label>Movie Name</Form.Label>
					    </Col>
					    <Col>
					    	<Form.Label></Form.Label>
					    </Col>
				    </Form.Row>

				    <Form.Row>
					    <Col xs={4}>	
					    	<Select 
					   			onChange={this.handleMovieSelect}
								options = {this.state.movies.map(i => {
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
										<h5>Movies Watched</h5>
										<hr />
										<p>{this.state.totalWatched}</p>
									</center>
								</Alert>
							</Col>
							<Col>
								<Alert variant='warning'>
									<center>
										<h5>Pending Movies</h5>
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
							Movie Details
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
							<Col xs={4}><p><b>Watched</b></p></Col>
							<Col>
								<Button 
									variant="outline-primary" 
									onClick={this.handleWatch}
									>
									{this.state.watched ? "True" : "False"}
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
					<p>Choose a movie name.</p>}
			</div>
			}
		</div>
		}	
		</div>
		)
	}
}

export default ExploreMovie