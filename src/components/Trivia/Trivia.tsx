import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Trivia.css";
import { useStyles } from "../styles";
import { TriviaData } from "../types";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";

function TriviaGame() {
  const [triviaData, setTriviaData] = useState<TriviaData>();
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showIncorrectMessage, setShowIncorrectMessage] =
    useState<boolean>(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean>(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const classes = useStyles();

  const fetchTriviaData = async () => {
    const response = await axios.get("https://opentdb.com/api.php?amount=1");
    const [result] = response.data.results;
    setTriviaData({
      question: result.question,
      correct_answer: result.correct_answer,
      answers: [...result.incorrect_answers, result.correct_answer].sort(
        () => Math.random() - 0.5
      ),
    });
    setIsCorrect(false);
    setUserAnswer("");
    setShowIncorrectMessage(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const correct = userAnswer === triviaData?.correct_answer;
    setIsCorrect(correct);
    setShowIncorrectMessage(!correct);
    if (correct && !answeredCorrectly) {
      setAnsweredCorrectly(true);
      setScore((prevScore) => prevScore + 1);
      setShowAnimation(true);
      setTimeout(() => {
        setAnsweredCorrectly(false);
        setShowAnimation(false);
        fetchTriviaData();
      }, 2000);
    }
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
              <TextField
                label="Enter your answer here"
                variant="outlined"
                value={userAnswer}
                onChange={(event) => setUserAnswer(event.target.value)}
                required
              />
            </label>
            <button type="submit">Submit</button>
          </form>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={showAnimation}
            autoHideDuration={2000}
            onClose={() => setShowAnimation(false)}
          >
            <SnackbarContent
              message={
                <span className={classes.snackbarMessage}>
                  <CheckCircleOutlineIcon className={classes.checkmark} />
                  Correct!
                </span>
              }
              className={classes.snackbar}
            />
          </Snackbar>
          {!isCorrect && showIncorrectMessage && (
            <p className="incorrect-message" style={{ color: "red" }}>
              Incorrect! The correct answer was {triviaData?.correct_answer}.
            </p>
          )}
        </div>
      </main>
      <footer>
        <Button variant="contained" color="primary" onClick={fetchTriviaData}>
          Next Question
        </Button>
      </footer>
    </div>
  );
}

export default TriviaGame;
