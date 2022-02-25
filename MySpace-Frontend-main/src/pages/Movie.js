import React, { Component } from 'react'

import { getMovies } from '../services/movieService';

import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'

import CreateMovie from '../components/CreateMovie'
import ExploreMovie from '../components/ExploreMovie'


class Movie extends Component {
	_isMounted = false;

	state = {
		view: "explore",
		id: "",
		movieName: "",

		loading: true
	}

	async componentDidMount(){
		this._isMounted = true;
		
		if (this._isMounted) {
			const { data: movies } = await getMovies();
			
			
			this.setState({loading: false})	
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	movieForm = () => {
		this.setState({
			view: "movieForm"
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
						<Alert.Heading>Explore Movies</Alert.Heading>				
						</center>
					</Alert>	
					<ExploreMovie />
				</div>
			)
		}
		else if (this.state.view==="movieForm") {
			return (
				<div>
					<Alert variant="success">
						<center>
						<Alert.Heading>Add New Movie</Alert.Heading>				
						</center>
					</Alert>	
					<br />
					<CreateMovie />
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
					<h3>Movies</h3>
					<br />

					<Button variant="dark" onClick={this.explore}>
						Explore
					</Button>{' '}

					<Button variant="dark" onClick={this.movieForm}>
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

export default Movie