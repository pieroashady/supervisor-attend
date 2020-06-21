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
import {
	Container,
	Row,
	Col,
	Table,
	Tooltip,
	Button,
	OverlayTrigger,
	Modal,
	Form
} from 'react-bootstrap';

import Card from 'components/Card/Card.jsx';
import { thArray, tdArray } from 'variables/Variables.jsx';
import { Link } from 'react-router-dom';
import moment from 'moment';
import e from 'cors';
import ModalHandler from './ModalHandler';
import Axios from 'axios';
import { baseurl } from 'utils/baseurl';

class QuizList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			reco: [],
			question: '',
			correctAnswers: 0,
			answers: [],
			trainee: [],
			optionA: '',
			optionB: '',
			optionC: '',
			optionD: '',
			loading: false,
			addModal: false,
			editModal: false,
			deleteMode: false,
			questionId: '',
			questionIndex: 0
		};
		this.handleAddQuestion = this.handleAddQuestion.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.handleMergeOption = this.handleMergeOption.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleEdit(id, idx) {
		const data = { quizId: id };
		Axios.post(baseurl('quiz/id'), data)
			.then(({ data }) => {
				this.setState({
					editModal: true,
					questionIndex: idx,
					question: data.question,
					optionA: data.answers[0],
					optionB: data.answers[1],
					optionC: data.answers[2],
					optionD: data.answers[3],
					correctAnswers: data.correctAnswers,
					questionId: data.objectId
				});
			})
			.catch((err) => console.log(err));
	}

	handleUpdate(e) {
		e.preventDefault();
		const { optionA, optionB, optionC, optionD } = this.state;
		const data = {
			quizId: this.state.questionId,
			question: this.state.question,
			categoryId: this.props.match.params.id,
			correctAnswer: parseInt(this.state.correctAnswers),
			option: [ optionA, optionB, optionC, optionD ]
		};

		Axios.post(baseurl('quiz/update'), data)
			.then((x) => {
				console.log('berhasil');
				const newReco = [ ...this.state.reco ];
				newReco.splice(this.state.questionIndex, 1, x.data);
				//window.location.reload(false);
				this.setState({
					reco: newReco,
					editModal: false
				});
			})
			.catch((err) => console.log(err));
	}

	handleDelete() {
		console.log(this.state.questionId);
		const data = { quizId: this.state.questionId };
		//this.setState({ buttonLoading: true });

		Axios.post(baseurl('quiz/delete'), data)
			.then(({ data }) => {
				const newReco = [ ...this.state.reco ];
				newReco.splice(this.state.questionIndex, 1);
				this.setState({
					reco: newReco,
					deleteMode: false
				});
			})
			.catch((err) => console.log(err));
	}

	componentDidMount() {
		this.getData();
	}

	handleAddQuestion(a, b) {}

	baseUrl(route) {
		return `http://localhost:5000/api/${route}`;
	}

	convertAnswer(answer) {
		switch (answer) {
			case 0:
				return 'A';
				break;
			case 1:
				return 'B';
				break;
			case 2:
				return 'C';
				break;
			case 3:
				return 'D';
				break;
		}
	}

	handleMergeOption() {
		const { optionA, optionB, optionC, optionD } = this.state;
		console.log(optionA);
		return [ optionA, optionB, optionC, optionD ];
	}

	handleAdd(e) {
		e.preventDefault();
		const {
			question,
			answers,
			correctAnswers,
			optionA,
			optionB,
			optionC,
			optionD
		} = this.state;
		const data = {
			question,
			option: [ optionA, optionB, optionC, optionD ],
			correctAnswer: parseInt(correctAnswers),
			categoryId: this.props.match.params.id
		};

		Axios.post(baseurl('quiz/add'), data)
			.then((x) => {
				this.setState({ addModal: false, reco: this.state.reco.concat(x.data.x) });
				console.log('success add data');
			})
			.catch((err) => console.log(err));
	}

	getData() {
		const data = {
			categoryId: this.props.match.params.id
		};
		return axios.post(baseurl('quiz/category'), data).then((response) => {
			console.log(response.data);
			this.setState({ reco: response.data });
		});
	}

	render() {
		// console.log([ ...this.state.reco ]);
		console.log(this.state.reco);
		const FORMAT = 'DD/MM/YYYY';
		const FORMAT2 = 'H:mm:ss';
		const {
			reco,
			loading,
			trainee,
			addModal,
			question,
			correctAnswers,
			answers,
			optionA,
			optionB,
			optionC,
			optionD
		} = this.state;
		const tooltip = <Tooltip id="button-tooltip">Simple tooltip</Tooltip>;

		return (
			<div className="content">
				<ModalHandler
					show={this.state.deleteMode}
					title="Delete confirmation"
					handleHide={() => this.setState({ deleteMode: false })}
					handleSave={this.handleDelete}
					body={'Delete question ' + this.state.question + ' ?'}
				/>

				<ModalHandler
					show={this.state.editModal}
					title={`Edit quiz ${this.state.questionIndex}`}
					handleHide={() => {
						this.setState({ editModal: false });
					}}
					body={
						<Form onSubmit={this.handleUpdate}>
							<Form.Group controlId="formCategory">
								<Form.Label>Pertanyaan</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									value={question}
									placeholder="Enter question"
									onChange={(e) => {
										this.setState({ question: e.target.value });
									}}
								/>
							</Form.Group>

							<Form.Group controlId="formSubtitle">
								<Form.Label>Option A</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									value={optionA}
									placeholder="Option A"
									onChange={(e) => {
										this.setState({
											optionA: e.target.value
										});
									}}
								/>
							</Form.Group>

							<Form.Group controlId="formSubtitleB">
								<Form.Label>Option B</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									value={optionB}
									placeholder="Option B"
									onChange={(e) => {
										this.setState({
											optionB: e.target.value
										});
									}}
								/>
							</Form.Group>

							<Form.Group controlId="formSubtitleC">
								<Form.Label>Option C</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									value={optionC}
									placeholder="Option C"
									onChange={(e) => {
										this.setState({
											optionC: e.target.value
										});
									}}
								/>
							</Form.Group>

							<Form.Group controlId="formSubtitleD">
								<Form.Label>Option D</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									value={optionD}
									placeholder="Option D"
									onChange={(e) => {
										this.setState({
											optionD: e.target.value
										});

										console.log(this.state.optionA);
									}}
								/>
							</Form.Group>

							<Form.Group controlId="formGridState">
								<Form.Label>Jawaban</Form.Label>
								<Form.Control
									as="select"
									value={this.state.correctAnswers}
									onChange={(e) => {
										this.setState({ correctAnswers: e.target.value });
										console.log(e.target.value);
									}}
								>
									<option value={0}>A</option>
									<option value={1}>B</option>
									<option value={2}>C</option>
									<option value={3}>D</option>
								</Form.Control>
							</Form.Group>

							<Button variant="primary" type="submit">
								Submit
							</Button>
						</Form>
					}
				/>
				<ModalHandler
					show={this.state.addModal}
					title="Add quiz"
					handleHide={() => this.setState({ addModal: false })}
					body={
						<Form onSubmit={this.handleAdd}>
							<Form.Group controlId="formCategory">
								<Form.Label>Pertanyaan</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									value={question}
									placeholder="Enter question"
									onChange={(e) => {
										this.setState({ question: e.target.value });
									}}
								/>
							</Form.Group>

							<Form.Group controlId="formSubtitle">
								<Form.Label>Option A</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									value={optionA}
									placeholder="Option A"
									onChange={(e) => {
										this.setState({
											optionA: e.target.value
										});
									}}
								/>
							</Form.Group>

							<Form.Group controlId="formSubtitleB">
								<Form.Label>Option B</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									value={optionB}
									placeholder="Option B"
									onChange={(e) => {
										this.setState({
											optionB: e.target.value
										});
									}}
								/>
							</Form.Group>

							<Form.Group controlId="formSubtitleC">
								<Form.Label>Option C</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									value={optionC}
									placeholder="Option C"
									onChange={(e) => {
										this.setState({
											optionC: e.target.value
										});
									}}
								/>
							</Form.Group>

							<Form.Group controlId="formSubtitleD">
								<Form.Label>Option D</Form.Label>
								<Form.Control
									autoCapitalize="true"
									autoComplete="false"
									type="text"
									value={optionD}
									placeholder="Option D"
									onChange={(e) => {
										this.setState({
											optionD: e.target.value
										});

										console.log(this.state.optionA);
									}}
								/>
							</Form.Group>

							<Form.Group controlId="formGridState">
								<Form.Label>Jawaban</Form.Label>
								<Form.Control
									as="select"
									value={this.state.correctAnswers}
									onChange={(e) => {
										this.setState({ correctAnswers: e.target.value });
										console.log(e.target.value);
									}}
								>
									<option value={0}>A</option>
									<option value={1}>B</option>
									<option value={2}>C</option>
									<option value={3}>D</option>
								</Form.Control>
							</Form.Group>

							<Button variant="primary" type="submit">
								Submit
							</Button>
						</Form>
					}
				/>
				<Container fluid>
					<Row>
						<Col md={12}>
							<Card
								category={
									<button
										type="button"
										className="btn btn-labeled btn-primary"
										onClick={() => {
											console.log('clicked');
											this.setState({ addModal: true });
										}}
									>
										<span className="btn-label">
											<i className="glyphicon glyphicon-plus" />
										</span>{' '}
										Add Quiz
									</button>
								}
								ctTableFullWidth
								ctTableResponsive
								content={
									<Table striped hover>
										<thead>
											<tr>
												<th>NO</th>
												<th>QUESTION</th>
												<th>OPTION</th>
												<th>JAWABAN</th>
												<th>ACTION</th>
											</tr>
										</thead>
										<tbody key={1}>
											{reco < 1 ? (
												<tr>
													<td style={{ textAlign: 'center' }} colSpan={5}>
														NO DATA FOUND
													</td>
												</tr>
											) : (
												reco.map((prop, key) => (
													<tr key={key}>
														<td>{key + 1}.</td>
														<td>{prop.question}</td>
														<td>
															<ol
																type="A"
																style={{ paddingLeft: '0' }}
															>
																{prop.answers.map((sult, i) => (
																	<li>{sult}</li>
																))}
															</ol>
														</td>
														<td>
															{this.convertAnswer(
																prop.correctAnswers
															)}
														</td>
														<td>
															<button
																type="button"
																className="btn btn-warning btn-circle mr-1"
																onClick={() => {
																	this.handleEdit(
																		prop.objectId,
																		key
																	);
																}}
															>
																<i className="fa fa-pencil" />
															</button>
															<button
																type="button"
																className="btn btn-danger btn-circle"
																onClick={() => {
																	this.setState({
																		deleteMode: true,
																		questionIndex: key,
																		question: prop.question,
																		questionId: prop.objectId
																	});
																}}
															>
																<i className="fa fa-trash" />
															</button>
														</td>
													</tr>
												))
											)}
											{}
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

export default QuizList;
