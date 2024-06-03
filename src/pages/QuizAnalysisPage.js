import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './QuizAnalysisPage.module.css';

function QuizAnalysisPage() {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    const fetchQuizAnalysis = async () => {
      try {
        const response = await axios.get(`/${id}/quiz-analysis`);
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching quiz analysis:', error);
      }
    };

    fetchQuizAnalysis();
  }, [id]);

  return (
    <div className={styles.quizAnalysisPage}>
      <h1>Question-wise Analysis</h1>
      <div className={styles.tableContainer}>
        <table className={styles.analysisTable}>
          <thead>
            <tr>
              <th>Question</th>
              <th>Correct Clicks</th>
              <th>Wrong Clicks</th>
              <th>Attempts</th>
            </tr>
          </thead>
          <tbody>
            {analytics.map((question, index) => (
              <tr key={index}>
                <td>{question.question}</td>
                <td>{question.correctClicks}</td>
                <td>{question.wrongClicks}</td>
                <td>{question.attempts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QuizAnalysisPage;
