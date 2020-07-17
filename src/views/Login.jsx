import React, { Component } from 'react';
import axios from 'axios';
import { Form, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { login } from 'utils';
import { useHistory } from 'react-router';
import '../assets/css/my.css';
import Parse from 'parse';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hello: '',
			username: '',
			password: '',
			loading: false,
			error: null
		};

		this.handleLogin = this.handleLogin.bind(this);
	}

	componentDidMount() {}

	handleLogin(e) {
		e.preventDefault();
		this.setState({ loading: true });
		const { username, password } = this.state;
		Parse.User
			.logIn(username, password)
			.then((x) => {
				login();
				this.setState({ loading: false });
				this.props.history.push('/admin/absen');
			})
			.catch((err) => {
				console.log(err);
				this.setState({ error: err.message, loading: false });
			});
	}

	// getHelloWorld() {
	// 	const url = 'http://35.247.147.177:3001/hello';
	// 	axios.get(url).then(({ data }) => {
	// 		this.setState({ hello: data });
	// 	});
	// }
	render() {
		const { hello, loading, error } = this.state;

		return (
			<div className="containerz">
				<div className="login">
					<p style={{ textAlign: 'center', fontWeight: 'bolder' }}>
						{error ? error + ' Try again' : 'Login First'}
					</p>
					<Form onSubmit={this.handleLogin}>
						<Form.Group controlId="formBasicEmail">
							<Form.Label>Username</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter username"
								onChange={(e) => {
									this.setState({ username: e.target.value });
								}}
							/>
						</Form.Group>

						<Form.Group controlId="formBasicPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Password"
								onChange={(e) => {
									this.setState({ password: e.target.value });
								}}
							/>
						</Form.Group>
						<Button variant="primary" type="submit">
							{loading ? (
								<div>
									<Spinner
										as="span"
										animation="grow"
										size="sm"
										role="status"
										aria-hidden="true"
									/>
									<Spinner
										as="span"
										animation="grow"
										size="sm"
										role="status"
										aria-hidden="true"
									/>
									<Spinner
										as="span"
										animation="grow"
										size="sm"
										role="status"
										aria-hidden="true"
									/>
								</div>
							) : (
								'Login'
							)}
						</Button>
					</Form>
				</div>
			</div>
		);
	}
}

export default Login;
