import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import styles from './TestPage.module.css';
import trophy from '../assets/image 2.jpg'

const TestPage = () => {
  const { id } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizType ,setQuizType]=useState("");

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`/quiz/${id}`);
        const data = response.data;
        setQuizData(data);
        setQuizType(data.selectedType);
        if (data.questions.length > 0 && data.questions[0].time > 0) {
          setTimeLeft(data.questions[0].time);
        }
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    const incrementImpressions = async () => {
      try {
        await axios.post(`/quiz/${id}/increment-impressions`);
      } catch (error) {
        console.error('Error incrementing impressions:', error);
      }
    };

    fetchQuizData();
    incrementImpressions();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && quizData && quizData.questions[currentQuestionIndex].time > 0) {
      handleNextQuestion();
    }
  }, [timeLeft, quizData, currentQuestionIndex]);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    if (selectedOption !== null && selectedOption === currentQuestion.correctOption) {
      setScore(prevScore => prevScore + 1);
    }
    setSelectedOption(null);

    if (currentQuestionIndex + 1 < quizData.questions.length) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      const nextQuestion = quizData.questions[currentQuestionIndex + 1];
      if (nextQuestion.time > 0) {
        setTimeLeft(nextQuestion.time);
      } else {
        setTimeLeft(0);
      }
    } else {
      setQuizCompleted(true);
      handleSubmitReport();
    }
  };

  const handleSubmitReport = async () => {
    try {
      await axios.put(`/quiz/${id}/reportadd`, { score });
      toast.success('Submitted successfully');
    } catch (error) {
      console.error('Error submitting quiz report:', error);
      toast.error('Not submitted');
    }
  };

  if (!quizData) {
    return <div>Loading...</div>;
  }

  if (quizCompleted) {
    if(quizType==="QnA"){
      return <div className={styles.QnACompleted}><div>Congrats Quiz completed!</div> <img src={trophy} alt='trophy'/><div>Your score is: <div className={styles.score}> {score}/ {quizData.questions.length}</div></div></div>;
    }else{
      return <div className={styles.pollCompleted}>Thank you for Participating in the Poll</div>;
    }
   
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className={styles.background}>
      <div className={styles.test_container}>
        <div className={styles.s_no_container}>
          <span>{currentQuestion.id}/{quizData.questions.length}</span>
          {currentQuestion.time > 0 && <span className={styles.timer}>{timeLeft}s</span>}
        </div>
        <div className={styles.question}>
          <h3 className={styles.question_name}>{currentQuestion.name}</h3>
          <div className={styles.question_options}>
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index} 
                onClick={() => handleOptionSelect(index)} 
                className={`${styles.option} ${selectedOption === index ? styles.selected : ''}`}
              >
                {option.text}
                {option.image && <img src={option.image} alt="option" className={styles.option_image} />}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.nextbtn}><button className={styles.testNextButton} onClick={handleNextQuestion}>Next</button></div>
      </div>
    </div>
  );
};

export default TestPage;
