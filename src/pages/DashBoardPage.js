import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './DashBoardPage.module.css';
import DynamicFormModal from '../components/DynamicFormModal';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Group from '../assets/Group.png'

function DashBoardPage() {
  const [quizData, setQuizData] = useState({
    total_quiz: 0,
    total_question: 0,
    total_impression: 0,
  });
  const [trendingQuizzes, setTrendingQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleLogout = () => {
    localStorage.removeItem("JWT");
    navigate("/");
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('/quiz/dashboard/data');
        const { totalQuizzes, totalQuestions, totalImpressions } = response.data;
        setQuizData({
          total_quiz: totalQuizzes,
          total_question: totalQuestions,
          total_impression: totalImpressions,
        });
      } catch (error) {
        console.error('Error fetching quiz statistics:', error);
      }
    };

    const fetchTrendingQuizzes = async () => {
      try {
        const response = await axios.get('/quiz/dashboard/trending');
        setTrendingQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching trending quizzes:', error);
      }
    };

    fetchQuizData();
    fetchTrendingQuizzes();
  }, []);

  return (
    <div className={styles.dashboard_container}>
      <div className={styles.menubar}>
        <p className={styles.app_logo}>QUIZZIE</p>
        <div className={styles.menu_items}>
          <Link to='/dashboard'>
            <button className={`${styles.menu_option} ${styles.selected_option}`}>Dashboard</button>
          </Link>
          <Link to='/analytics'>
            <button className={styles.menu_option}>Analytics</button>
          </Link>
          <button className={styles.menu_option} onClick={handleShow}>Create Quiz</button>
          <button className={`${styles.menu_option} ${styles.logout_btn}`} onClick={handleLogout}>LOGOUT</button>
        </div>
      </div>
      <div className={styles.dashboard_content}>
        <div className={styles.stats_container}>
          <div className={styles.stats}>
            <div className={styles.card}>
              <span className={styles.no_of_quiz}>{quizData.total_quiz}</span>
              <span className={styles.quiz_text}>Quiz Created</span>
            </div>
            <div className={styles.card}>
              <span className={styles.no_of_question}>{quizData.total_question}</span>
              <span className={styles.question_text}>Questions Created</span>
            </div>
            <div className={styles.card}>
              <span className={styles.no_of_impression}>{quizData.total_impression}</span>
              <span className={styles.impression_text}>Total Impressions</span>
            </div>
          </div>
        </div>
        <div className={styles.trendingquiz}>
          <h2>Trending Quizzes</h2>
          <div className={styles.trendingquiz_container}>
            {trendingQuizzes.length > 0 ? (
              trendingQuizzes.map((quiz) => (
                <div key={quiz._id} className={styles.quiz_card}>
                  <h3>
                    {quiz.name}
                    <span className={styles.impression_count_text}>{quiz.impressions}</span>
                    <img src={Group} alt="eye" className={styles.eye}/>
                  </h3>
                  <div className={styles.date_creation}>Created on: {new Date(quiz.createdAt).toLocaleDateString()}</div>
                </div>
              ))
            ) : (
              <p>No trending quizzes available</p>
            )}
          </div>
        </div>
      </div>
      <DynamicFormModal show={showModal} handleClose={handleClose} />
    </div>
  );
}

export default DashBoardPage;
