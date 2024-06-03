import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './AnalyticsPage.module.css';
import DynamicFormModal from '../components/DynamicFormModal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import editicon from "../assets/uil_edit.svg"
import deleteicon from '../assets/material-symbols_delete.svg'
import shareicon from '../assets/material-symbols_share.svg'
import ConfirmationModal from '../components/ConfirmationModal'; // Import ConfirmationModal component

function AnalyticsPage() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State to control modal visibility
  const [deleteMessage, setDeleteMessage] = useState(""); // State to set the delete confirmation message

  const handleShow = () => {
    setSelectedQuiz(null)
    setShowModal(true);
  }

  const handleClose = () => setShowModal(false);

  const handleQuizClick = async (quizId) => {
    const quizLink = `${window.location.origin}/quiz/${quizId}`;
    try {
      await navigator.clipboard.writeText(quizLink);
      toast.success('Quiz link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy the text to clipboard:', err);
      toast.error('Failed to copy the quiz link. Please try again.');
    }
  };

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setShowModal(true);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`/quiz/${quizId}`);
      toast.success('Quiz deleted successfully!');
      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== quizId));
    } catch (error) {
      console.error('Failed to delete the quiz:', error);
      toast.error('Failed to delete the quiz. Please try again.');
    }
  };

  const handleDeleteConfirmation = (quizId, quizName) => {
    setQuizToDelete(quizId);
    setDeleteMessage(`Are you confirm you want to delete?`);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmationClose = () => {
    setQuizToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const handleDeleteConfirmationConfirm = () => {
    handleDeleteQuiz(quizToDelete);
    setShowDeleteConfirmation(false);
  };

  const [quizzes, setQuizzes] = useState([]);
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('/quiz');
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const navigate = useNavigate();
  const handlelogout = () => {
    localStorage.removeItem("JWT")
    navigate("/")
  }

  return (
    <div className={styles.dashboard_container}>
      <div className={styles.menubar}>
        <p className={styles.app_logo}>QUIZZIE</p>
        <div className={styles.menu_items}>
          <Link to='/dashboard'>
            <button className={styles.menu_option}>Dashboard</button>
          </Link>
          <Link to='/analytics'>
            <button className={`${styles.menu_option} ${styles.selected_option}`}>Analytics</button>
          </Link>
          <button className={styles.menu_option} onClick={handleShow}>Create Quiz</button>
          <button className={`${styles.menu_option} ${styles.logout_btn}`} onClick={handlelogout}>LOGOUT</button>
        </div>
      </div>
      <div className={styles.analysis_container}>
        <h1 className={styles.analysis_heading}>Quiz Analysis</h1>
        <div className={styles.quiztable}>
          <div className={styles.quiztable_firstrow}>
            <p className={styles.quiztable_heading}>S.No</p>
            <p className={styles.quiztable_heading}>Quiz Name</p>
            <p className={styles.quiztable_heading}>Created on</p>
            <p className={styles.quiztable_heading}>Impressions</p>
            <p className={styles.quiztable_heading}></p>
            <p className={styles.quiztable_heading}></p>
          </div>
          <ul className={styles.quizlist}>
            {quizzes.map((quiz, index) => (
              <li
                key={quiz._id}
                className={`${styles.quiz_row} ${index % 2 === 0 ? styles.row_odd : styles.row_even}`}
              >
                <span className={styles.quiz_data}>{index + 1}</span>
                <span className={styles.quiz_data}>{quiz.name}</span>
                <span className={styles.quiz_data}>{quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : 'Unknown date'}</span>
                <span className={styles.quiz_data}>{quiz.impressions}</span>
                <span className={styles.quiz_data}>
                  <img src={editicon} alt='edit' className={styles.action_button} onClick={() => handleEditQuiz(quiz)} />
                  <img src={deleteicon} alt='delete' className={styles.action_button} onClick={() => handleDeleteConfirmation(quiz._id, quiz.name)} />
                  <img src={shareicon} alt='share' className={styles.action_button} onClick={() => handleQuizClick(quiz._id)} />
                </span>
                <span className={styles.quiz_data}>
                  <Link to={`/quiz-analysis/${quiz._id}`} className={styles.analysis_link}>Question wise Analysis</Link>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <DynamicFormModal show={showModal} handleClose={handleClose} quizData={selectedQuiz} />
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={handleDeleteConfirmationClose}
        onConfirm={handleDeleteConfirmationConfirm}
        message={deleteMessage}
      />
    </div>
  );
}

export default AnalyticsPage;
