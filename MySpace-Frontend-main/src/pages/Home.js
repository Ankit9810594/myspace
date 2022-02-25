import React, { Component } from 'react'

import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'


import Welcome from './Welcome'
import Movie from './Movie'
import Book from './Book'
import Settings from './Settings'



class Home extends Component {
	state = {
		view: "welcome",
		payload: ""
	}


	welcome = () => {
		this.setState({
			view: "welcome"
		})
	}

	movie = () => {
		this.setState({
			view: "movie"
		})
	}
	
	book = () => {
		this.setState({
			view: "book"
		})
	}

	
	settings = () => {
		this.setState({
			view: "settings"
		})
	}

	
	
	renderView = () => {
		if (this.state.view==="welcome") {
			return <Welcome />
		}
		else if (this.state.view==="movie") {
			return <Movie />
		}
		else if (this.state.view==="book") {
			return <Book />
		}
		else if (this.state.view==="settings") {
			return <Settings user={this.props.user} />
		}
		
	}

	render() {
		return (
			<div>
				<Navbar expand="lg" bg="dark" variant="dark">
				    <Navbar.Brand>
				    	MySpace
				    </Navbar.Brand>
				    <Nav className="ml-auto">
						
				    <Nav.Link>
				      	<Button variant="dark" onClick={this.movie}>
							Movies
						</Button>{' '}
				    </Nav.Link>

				    <Nav.Link>
				      	<Button variant="dark" onClick={this.book}>
							Books
						</Button>{' '}
				    </Nav.Link>

				    <Nav.Link>
				      	<Button variant="dark" onClick={this.settings}>
							Settings
						</Button>{' '}
				    </Nav.Link>
				  	</Nav>
				</Navbar>
					
				<br />

				{this.renderView()}

				<div>
					<br/><br/>
					<br/><br/>
				</div>	
			</div>
		)
	}
}

export default Home