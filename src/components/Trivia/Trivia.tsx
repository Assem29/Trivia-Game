import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Trivia.css';

interface TriviaData {
  question: string;
  correct_answer: string;
  answers: string[];
}

function TriviaGame() {
  const [triviaData, setTriviaData] = useState<TriviaData>();
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showIncorrectMessage, setShowIncorrectMessage] = useState<boolean>(false);

  const fetchTriviaData = async () => {
    const response = await axios.get('https://opentdb.com/api.php?amount=1');
    const [result] = response.data.results;
    setTriviaData({
      question: result.question,
      correct_answer: result.correct_answer,
      answers: [...result.incorrect_answers, result.correct_answer].sort(() => Math.random() - 0.5)
    });
    setIsCorrect(false);
    setUserAnswer('');
    setShowIncorrectMessage(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCorrect(userAnswer === triviaData?.correct_answer);
    setScore((prevScore) => (userAnswer === triviaData?.correct_answer ? prevScore + 1 : prevScore));
    setShowIncorrectMessage(userAnswer !== triviaData?.correct_answer);
  };

  useEffect(() => {
    fetchTriviaData();
  }, []);

  return (
    <div className="TriviaGame">
      <header>
        <h1>Trivia Game</h1>
        <div className="score-container">
          <span className="score-label">Score:</span>
          <span className="score-value">{score}</span>
        </div>
      </header>
      <main>
        <div className="question-container">
          <p className="question">{triviaData?.question}</p>
          <form onSubmit={handleSubmit}>
            <label>
              <input
                type="text"
                placeholder="Enter your answer here"
                value={userAnswer}
                onChange={(event) => setUserAnswer(event.target.value)}
              />
            </label>
            <button type="submit">Submit</button>
          </form>
          {isCorrect && <p className="correct-message">Correct!</p>}
          {!isCorrect && showIncorrectMessage && (
            <p className="incorrect-message" style={{ color: 'red' }}>Incorrect! The correct answer was {triviaData?.correct_answer}.</p>
          )}
        </div>
      </main>
      <footer>
        <button className="next-question" onClick={fetchTriviaData}>
          Next Question
        </button>
      </footer>
    </div>
  );
}

export default TriviaGame;
