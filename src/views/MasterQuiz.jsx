/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from 'react';
import axios from 'axios';
import { Container, Row, Col, Table, Tooltip, Button, OverlayTrigger } from 'react-bootstrap';

import Card from 'components/Card/Card.jsx';
import { thArray, tdArray } from 'variables/Variables.jsx';
import { Link } from 'react-router-dom';
import moment from 'moment';

class MasterQuiz extends Component {
	constructor(props) {
		super(props);
		this.state = {
			reco: [],
			loading: false,
			fetched: false
		};
		this.handleAddQuestion = this.handleAddQuestion.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	handleAddQuestion(a, b) {
		let x = a + b;
		console.log('clicked', x);
		this.setState({ loading: true });
	}

	baseUrl(route) {
		return `http://localhost:5000/api/${route}`;
	}

	getData() {
		return axios.get(this.baseUrl('quiz/list')).then((response) => {
			console.log(response.data);
			this.setState({ reco: response.data, fetched: true });
		});
	}

	render() {
		const { reco, loading } = this.state;
		const FORMAT = 'DD/MM/YYYY';
		const FORMAT2 = 'H:mm:ss';
		const tooltip = <Tooltip id="button-tooltip">Simple tooltip</Tooltip>;
		return (
			<div className="content">
				<Container fluid>
					<Row>
						<Col md={12}>
							<Card
								category={
									<Link to="/quiz/add">
										<button
											type="button"
											className="btn btn-labeled btn-primary"
											onClick={() => {
												this.handleAddQuestion(1, 2);
											}}
										>
											<span className="btn-label">
												<i className="glyphicon glyphicon-plus" />
											</span>{' '}
											{loading ? 'Loading...' : 'Add Question'}
										</button>
									</Link>
								}
								ctTableFullWidth
								ctTableResponsive
								content={
									<Table striped hover>
										<thead>
											<tr>
												<th>NO</th>
												<th>CATEGORY</th>
												<th>QUESTION</th>
												<th>SCHEDULE</th>
												<th>START TIME</th>
												<th>END TIME</th>
												<th>ACTION</th>
											</tr>
										</thead>
										<tbody key={1}>
											{reco.map((prop, key) => (
												<tr key={key}>
													<td>{key + 1}</td>
													<td>{prop.categoryId.category}</td>
													<td>{prop.question}</td>
													<td>
														{moment(prop.schedule.iso).format(FORMAT)}
													</td>
													<td>
														{moment(prop.startTime.iso).format(FORMAT2)}
													</td>
													<td>
														{moment(prop.endTime.iso).format(FORMAT2)}
													</td>
													<td>
														<Link to={`quiz/${prop.objectId}/view`}>
															<button
																type="button"
																className="btn btn-primary btn-circle mr-2"
															>
																<i className="fa fa-eye" />
															</button>
														</Link>{' '}
														<Link to={`quiz/${prop.objectId}/edit`}>
															<button
																type="button"
																className="btn btn-warning btn-circle"
															>
																<i className="fa fa-pencil" />
															</button>
														</Link>{' '}
														<Link to={`quiz/${prop.objectId}/delete`}>
															<button
																type="button"
																className="btn btn-danger btn-circle"
															>
																<i className="fa fa-trash" />
															</button>
														</Link>
													</td>
												</tr>
											))}
										</tbody>
									</Table>
								}
							/>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default MasterQuiz;
