import React from 'react';
import { quizData } from './quizData';
// import '../assets/css/quiz.css';
import Axios from 'axios';

class MainQuiz extends React.Component {
	state = {
		currentQuestion: 0,
		myAnswer: null,
		options: [],
		score: 0,
		disabled: true,
		isEnd: false,
		answerKey: [],
		scorex: 0,
		correctAnswer: [ 'New Delhi', 'Elon Musk', 'Jeff Bezo', 'River Nile' ]
	};

	loadQuizData = () => {
		// console.log(quizData[0].question)
		this.setState(() => {
			return {
				questions: quizData[this.state.currentQuestion].question,
				answer: quizData[this.state.currentQuestion].answer,
				options: quizData[this.state.currentQuestion].options,
				key: quizData[this.state.currentQuestion].key
			};
		});
	};

	componentDidMount() {
		this.loadQuizData();
		console.log(this.state.score);
	}
	nextQuestionHandler = (xc) => {
		// console.log('test')
		const { myAnswer, answer, score, key, currentQuestion } = this.state;
		// const answerKey = { ...this.state };
		// answerKey[this.state.currentQuestion] = myAnswer;
		// const newArr = [...this.state.myAnswer];
		// newArr.splice(currentQuestion, 0);
		// this.setState({answerKey: newArr});
		// this.setState({ answerKey: this.state.answerKey.concat(myAnswer) }, () =>
		// 	console.log(answerKey)
		// );

		// this.setState(
		// 	(prevState) => {
		// 		return {
		// 			answerKey: prevState.answerKey.concat(xc)
		// 		};
		// 	},
		// 	() => console.log(this.state.answerKey)
		// );
		this.state.answerKey.splice(currentQuestion, 1, xc);
		console.log('update', this.state.answerKey);

		if (myAnswer === answer) {
			this.setState({
				score: score + 1
			});
		}

		this.setState({
			currentQuestion: this.state.currentQuestion + 1
		});
		console.log(this.state.currentQuestion);
		// console.log(this.state.answerKey);
	};

	previousHandler = () => {
		//this.state.answerKey.splice(this.state.currentQuestion, 0, xc);
		this.setState((prevState) => {
			return {
				currentQuestion: prevState.currentQuestion - 1
			};
		});
	};

	componentDidUpdate(prevProps, prevState) {
		if (this.state.currentQuestion !== prevState.currentQuestion) {
			this.setState(() => {
				return {
					disabled: true,
					questions: quizData[this.state.currentQuestion].question,
					options: quizData[this.state.currentQuestion].options,
					answer: quizData[this.state.currentQuestion].answer
				};
			});
		}
	}
	//check answer
	checkAnswer = (answer) => {
		this.setState({ myAnswer: answer, disabled: false });
		console.log(this.state.myAnswer);
	};

	totalScore = () => {
		let scorez = 0;
		this.state.answerKey.map((x, i) => {
			if (x === this.state.correctAnswer[i]) {
				scorez += 10;
				// this.setState(
				// 	(prev) => {
				// 		return {
				// 			scorex: prev.scorex + 10
				// 		};
				// 	},
				// 	() => console.log(this.state.scorex)
				// );
			} else {
				scorez += 0;
				// this.setState((prev) => {
				// 	return { scorex: prev.scorex + 0 };
				// });
			}
		});
		this.setState({ scorex: scorez }, () => console.log(this.state.scorex));
	};

	finishHandler = (xc) => {
		this.state.answerKey.push(this.state.myAnswer);
		console.log(this.state.answerKey);
		if (this.state.currentQuestion === quizData.length - 1) {
			this.setState({
				isEnd: true
			});
		}
		if (this.state.myAnswer === this.state.answer) {
			this.setState({
				score: this.state.score + 1
			});
		}
		this.totalScore();
		const data = {
			option: this.state.answerKey
		};
		Axios.post('http://localhost:5000/api/quiz/add', data)
			.then((x) => console.log(x.data.message))
			.catch((err) => console.log(err));
	};
	render() {
		const { options, myAnswer, currentQuestion, isEnd } = this.state;

		if (isEnd) {
			return (
				<div className="result">
					<h3>Game Over your Final score is {this.state.score} points </h3>
					<p>
						The correct answer's for the questions was
						<ul>
							{quizData.map((item, index) => (
								<li className="ui floating message options" key={index}>
									{item.answer}
								</li>
							))}
						</ul>
					</p>
				</div>
			);
		} else {
			return (
				<div className="App">
					<h1>{this.state.questions} </h1>
					<span>{`Questions ${currentQuestion}  out of ${quizData.length -
						1} remaining `}</span>
					{options.map((option, index) => (
						<p
							key={option.id}
							className={`ui floating message options
         ${myAnswer === option ? 'selected' : null}
         `}
							onClick={() => this.checkAnswer(option)}
						>
							{option}
						</p>
					))}
					{currentQuestion > 0 && (
						<button
							className="ui inverted button"
							disabled={this.state.disabled}
							onClick={() => this.previousHandler(this.state.myAnswer)}
						>
							Previous
						</button>
					)}
					{currentQuestion < quizData.length - 1 && (
						<button
							className="ui inverted button"
							disabled={this.state.disabled}
							onClick={() => this.nextQuestionHandler(this.state.myAnswer)}
						>
							Next
						</button>
					)}
					{/* //adding a finish button */}
					{currentQuestion === quizData.length - 1 && (
						<button
							className="ui inverted button"
							onClick={() => this.finishHandler(this.state.answerKey)}
						>
							Finish
						</button>
					)}
				</div>
			);
		}
	}
}

export default MainQuiz;
