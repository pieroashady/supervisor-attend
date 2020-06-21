import React, { Component, useState } from 'react';
import { Form, Col, Row } from 'react-bootstrap';

class Quiz extends Component {
	constructor(props) {
		super(props);
		this.state = {
			questionCounter: 0,
			answer: '',
			score: 0,
			collectAnswers: [],
			myQuestion: [
				{
					question: 'Who invented JavaScript?',
					answers: [ 'Douglas Crockford', 'Sheryl Sandberg', 'Brendan Eich' ],
					correctAnswer: 2
				},
				{
					question: 'Which one of these is a JavaScript package manager?',
					answers: [ 'Node.js', 'TypeScript', 'npm' ],
					correctAnswer: 2
				},
				{
					question: 'Which tool can you use to ensure code quality?',
					answers: [ 'Angular', 'jQuery', 'RequireJS' ],
					correctAnswer: 2
				},
				{
					question: 'Foxy joxe?',
					answers: [ 'Nore', 'Fret', 'RequireJS' ],
					correctAnswer: 2
				}
			],
			answerKey: [ 2, 2, 2, 2 ]
		};
		this.onSelect = this.onSelect.bind(this);
	}
	componentDidMount() {
		// if (this.state.questionCounter >= 2) {
		// 	this.setState({ questionCounter: 0 });
		// }
	}

	checkAnswer = (answer, correctAnswer) => {
		if (answer === correctAnswer) {
			this.setState({
				score: this.state.score + 10
			});
		}
		this.setState({ responses: this.state.responses < 10 ? this.state.responses + 1 : 10 });
	};

	onSelect(e) {
		e.preventDefault();
		this.setState({ answer: e.target.label });
		console.log(this.state.answer);
	}
	checkResult() {}
	shuffle(array) {
		var currentIndex = array.length,
			temporaryValue,
			randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}
	render() {
		const { myQuestion, questionCounter } = this.state;
		const answerKey = myQuestion[questionCounter].correctAnswer;
		return (
			<div>
				<Form.Group as={Row}>
					<Form.Label as="legend" column sm={2}>
						Radios
					</Form.Label>
					<Col sm={10}>
						{/* {myQuestion.map((x, i) => ( */}
						<QuestionBox
							question={myQuestion[questionCounter].question}
							option={myQuestion[questionCounter].answers}
							correctAnswer={myQuestion[questionCounter].correctAnswer}
							currentIndex={questionCounter}
							totalQuestion={this.state.myQuestion.length}
							result={(answer) => this.checkAnswer(answer, answerKey)}
						/>
						{/* ))} */}
					</Col>
				</Form.Group>
				<button
					onClick={() => {
						if (this.state.questionCounter == this.state.myQuestion.length - 1) {
							console.log(this.state.questionCounter);
							return this.setState({ questionCounter: 0 });
						}
						if (this.state.answer !== '')
							this.setState((prevState) => ({
								questionCounter: prevState.questionCounter + 1
							}));
						console.log(this.state.questionCounter);
					}}
				>
					Next
				</button>
			</div>
		);
	}
}

function QuestionBox({ question, option, correctAnswer, currentIndex, totalQuestion, result }) {
	const [ click, setClicked ] = useState(false);
	const [ answer, setAnswer ] = useState('');
	const [ answerIndex, setIndex ] = useState(0);
	const [ select, setSelected ] = useState([]);
	let selected = [];

	const handleSelected = (indexing) => {
		const newArr = [ ...select ];
		newArr.splice(indexing, 0);
		setSelected(newArr);
	};

	return (
		<div>
			<p>
				{currentIndex + 1} of {totalQuestion}
			</p>
			<p>{question}</p>
			{option.map((text, index) => (
				<p
					style={{
						color: answer === text ? 'red' : 'black',
						border: '1px solid rgba(0, 0, 0, 0.2)',
						borderColor: answer === text ? 'red' : 'black'
					}}
					onClick={(e) => {
						setClicked(true);
						setAnswer(text);
						setIndex(index);
						result(index);
						handleSelected(currentIndex);

						console.log(select);
						console.log(index);
					}}
				>
					{text}
				</p>
			))}
		</div>
	);
}

export default Quiz;
