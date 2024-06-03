import "../pages/CreateQuizPage.css";
import styles from "./DynamicForm.module.css";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

const DynamicFormModal = ({ show, handleClose, quizData }) => {
  const [quizName, setQuizName] = useState("");
  const [questions, setQuestions] = useState([]);
  //const [optionType, setOptionType] = useState("text");
  const [activeQuestion, setActiveQuestion] = useState(0);

  const [selectedType, setSelectedType] = useState("QnA");
  const [timerTime, setTimerTime] = useState(0);

  useEffect(() => {
    if (quizData) {
      setQuizName(quizData.name);
      setQuestions(quizData.questions);
      //setOptionType(quizData.optionType);
      setSelectedType(quizData.selectedType);
      // setTimerTime(quizData.timerTime);
    }
  }, [quizData]);

  const handleQnAType = () => {
    setSelectedType("QnA");
  };
  const handlePollType = () => {
    setSelectedType("Poll");
  };
  // const setTimerOff = () => {
  //   setTimerTime("OFF");
  // };
  // const set5SecTimer = () => {
  //   setTimerTime("5Sec");
  // };
  // const set10SecTimer = () => {
  //   setTimerTime("10Sec");
  // };

  const addQuestion = () => {
    if (questions.length < 5) {
      setQuestions([
        ...questions,
        {
          id: questions.length + 1,
          name: "",
          OptionType: 0,
          options: [
            {
              text: "",
              image: "",
            },
            {
              text: "",
              image: "",
            },
          ],
          correctOption: 0,
          time: 0,
          // correctClicked:{},
          // wrongClicked:{},
          // Attempt:{},
        },
      ]);
      setActiveQuestion(questions.length);
    }
  };

  const addOption = (index) => {
    if (questions[index].options.length < 4) {
      const newQuestions = questions.map((question, i) =>
        i === index
          ? {
              ...question,
              options: [
                ...question.options,
                {
                  text: "",
                  image: "",
                },
              ],
            }
          : question,
      );
      setQuestions(newQuestions);
    }
  };
  const deleteOption = (index, optionIndex) => {
    const newQuestions = questions.map((question, i) =>
      i === index
        ? {
            ...question,
            options: question.options.filter((option, j) => j !== optionIndex),
          }
        : question,
    );
    setQuestions(newQuestions);
  };

  const deleteQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
      setActiveQuestion(Math.max(0, activeQuestion - 1));
    }
  };

  const handleQuizNameChange = (event) => {
    setQuizName(event.target.value);
  };

  const handleQuestionNameChange = (index, event) => {
    const newQuestions = questions.map((question, i) =>
      i === index ? { ...question, name: event.target.value } : question,
    );
    setQuestions(newQuestions);
  };

  const handleTextOptionChange = (index, optionIndex, event) => {
    const newQuestions = questions.map((question, i) =>
      i === index
        ? {
            ...question,
            options: question.options.map((option, j) =>
              j === optionIndex
                ? { ...option, text: event.target.value }
                : option,
            ),
          }
        : question,
    );
    setQuestions(newQuestions);
  };
  const handleImageOptionChange = (index, optionIndex, event) => {
    const newQuestions = questions.map((question, i) =>
      i === index
        ? {
            ...question,
            options: question.options.map((option, j) =>
              j === optionIndex
                ? { ...option, image: event.target.value }
                : option,
            ),
          }
        : question,
    );
    setQuestions(newQuestions);
  };
  const handleOptionTypeChange = (index, e) => {
    const newQuestions = questions.map((question, i) =>
      i === index
        ? { ...question, OptionType: parseInt(e.target.value) }
        : question,
    );
    setQuestions(newQuestions);
  };
  const handleOffTimerChange = (index, e) => {
    const newQuestions = questions.map((question, i) =>
      i === index ? { ...question, time: 0 } : question,
    );
    setQuestions(newQuestions);
  };
  const handle5secTimerChange = (index, e) => {
    const newQuestions = questions.map((question, i) =>
      i === index ? { ...question, time: 5 } : question,
    );
    setQuestions(newQuestions);
  };
  const handle10secTimerChange = (index, e) => {
    const newQuestions = questions.map((question, i) =>
      i === index ? { ...question, time: 10 } : question,
    );
    setQuestions(newQuestions);
  };
  // const handleTextOptionType = () => {
  //   setOptionType("text");
  // };
  // const handleImageOptionType = () => {
  //   setOptionType("Image");
  // };
  // const handleText_ImageOptionType = () => {
  //   setOptionType("text&Image");
  // };
  const handleCorrectOptionChange = (index, event) => {
    const newQuestions = questions.map((question, i) =>
      i === index
        ? { ...question, correctOption: parseInt(event.target.value) }
        : question,
    );
    setQuestions(newQuestions);
  };

  const handleFormSubmit = async () => {
    const quizPayload = {
      name: quizName,
      selectedType,
      // optionType,
      questions,
      // timerTime,
    };
    // if(questions.length == index)

    console.log(quizData);
    try {
      if (quizData) {
        // Editing an existing quiz
        const response = await axios.put(`/quiz/${quizData._id}`, quizPayload);
        console.log("Quiz updated successfully:", response.data);
      } else {
        // Creating a new quiz
        const response = await axios.post("/quiz", quizPayload);
        console.log("Quiz created successfully:", response.data);
      }
      // const response = await axios.post("/quiz",quizData);
      // console.log("Success:", response.data);

      handleClose(); // Optionally close the modal on success
      setQuizName("");
      setQuestions([]);
      // setTimerTime("OFF");
      setSelectedType("QnA");
      // setOptionType("text");
      toast.success("Submitted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed!");
    }
  };
  return (
    <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        {!questions.length && (
          <div className={styles.first_model}>
            <input
              type="text"
              value={quizName}
              onChange={handleQuizNameChange}
              placeholder="Quiz Name"
              className={styles.Quiz_name}
            />
            <div className={styles.place_row}>
              <div>Quiz Type</div>
              <div
                className={styles.QnAType}
                // style={style}
                onClick={handleQnAType}
                style={
                  selectedType === "QnA"
                    ? { backgroundColor: "#60b84b", color: "white" }
                    : {}
                }
              >
                Q&A
              </div>
              <div
                className={styles.PollType}
                // style={sstyle}
                onClick={handlePollType}
                style={
                  selectedType === "Poll"
                    ? { backgroundColor: "#60b84b", color: "white" }
                    : {}
                }
              >
                Poll Name
              </div>
            </div>
            <div className={styles.action_item}>
              <div className={styles.cancel_button} onClick={handleClose}>
                Cancel
              </div>
              <div
                className={styles.continue_button}
                onClick={() =>
                  setQuestions([
                    {
                      id: questions.length + 1,
                      name: "",
                      OptionType: 0,
                      options: [
                        {
                          text: "",
                          image: "",
                        },
                        {
                          text: "",
                          image: "",
                        },
                      ],
                      correctOption: 0,
                      time: 0,
                      // correctClicked:{},
                      // wrongClicked:{},
                      // Attempt:{},  
                    },
                  ])
                }
              >
                Continue
              </div>
            </div>
          </div>
        )}
        {!!questions.length && (
          <>
            <div className={styles.tabs}>
              {questions.map((question, index) => (
                <div
                  key={index}
                  className={`${styles.tab_container} ${activeQuestion === index ? "active" : ""}`}
                >
                  <div
                    className={`${styles.tab} ${styles.One_tab} ${activeQuestion === index ? "active" : ""}`}
                  >
                    {questions.length > 1 && index !== 0 && (
                      <div
                        className={styles.close_question} // "delete-button"
                        onClick={() => deleteQuestion(index)}
                      >
                        &times;
                      </div>
                    )}
                    <div
                      onClick={() => setActiveQuestion(index)}
                      className={styles.Question_number_one}
                    >
                      {index + 1}
                    </div>
                  </div>
                </div>
              ))}
              <div
                className={styles.add_button}
                onClick={addQuestion} //addQuestion
                disabled={questions.length >= 5}
              >
                +
              </div>
            </div>
            <div className="form-container">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className={`form-content ${activeQuestion === index ? "active" : ""}`}
                >
                  <form>
                    <div className="form-group">
                      {selectedType === "QnA" && (
                        <input
                          className={styles.Question_name}
                          type="text"
                          id={`questionName${index}`}
                          value={question.name}
                          onChange={(e) => handleQuestionNameChange(index, e)}
                          placeholder="Q&A Question"
                        />
                      )}
                      {selectedType === "Poll" && (
                        <input
                          className={styles.Question_name}
                          type="text"
                          id={`questionName${index}`}
                          value={question.name}
                          onChange={(e) => handleQuestionNameChange(index, e)}
                          placeholder="Poll Question"
                        />
                      )}
                    </div>

                    {index === activeQuestion && (
                      <div className={styles.option_type}>
                        <div className={styles.option_type}>
                          <div className={styles.option_One}>Option Type</div>
                        </div>
                        <div className={styles.option_type}>
                          <input
                            type="radio"
                            id={`optionTypeText${index}`}
                            name={`optionType${index}`}
                            value={0}
                            checked={question.OptionType === 0}
                            onChange={(e) => handleOptionTypeChange(index, e)}
                            // onChange={handleTextOptionType}
                          />
                          <div className={styles.option_One}>Text</div>
                        </div>

                        <div className={styles.option_type}>
                          <input
                            type="radio"
                            id={`optionTypeText${index}`}
                            name={`optionType${index}`}
                            value={1}
                            checked={question.OptionType === 1}
                            onChange={(e) => handleOptionTypeChange(index, e)}
                            //onChange={handleImageOptionType}
                          />
                          <div className={styles.option_One}>Image URL</div>
                        </div>
                        <div className={styles.option_type}>
                          <input
                            type="radio"
                            id={`optionTypeText${index}`}
                            name={`optionType${index}`}
                            value={2}
                            checked={question.OptionType === 2}
                            onChange={(e) => handleOptionTypeChange(index, e)}
                            // onChange={handleText_ImageOptionType}
                          />
                          <div className={styles.option_One}>
                            Text & Image URL
                          </div>
                        </div>
                      </div>
                    )}
                    <div className={styles.options_timer_container}>
                      <div className={styles.options_container}>
                        {question.options.map((option, optionIndex) => (
                          <div className={styles.Options} key={optionIndex}>
                            {selectedType === "QnA" && (
                              <input
                                className={styles.radio_button}
                                type="radio"
                                id={`correctOption${optionIndex}${index}`}
                                name={`correctOption${index}`}
                                value={optionIndex}
                                checked={question.correctOption === optionIndex}
                                onChange={(e) =>
                                  handleCorrectOptionChange(index, e)
                                }
                              />
                            )}
                            {question.OptionType === 0 && (
                              <input
                                style={
                                  question.correctOption === optionIndex &&
                                  selectedType == "QnA"
                                    ? {
                                        backgroundColor: "#60b84b",
                                        color: "white",
                                      }
                                    : {}
                                }
                                type="text"
                                id={`option${optionIndex}${index}`}
                                value={option.text}
                                onChange={(e) =>
                                  handleTextOptionChange(index, optionIndex, e)
                                }
                                placeholder="Text"
                                className={`${styles.option_input} ${styles.button}
                                `}
                              />
                            )}
                            {question.OptionType === 1 && (
                              <input
                                style={
                                  question.correctOption === optionIndex
                                    ? {
                                        backgroundColor: "#60b84b",
                                        color: "white",
                                      }
                                    : {}
                                }
                                className={`${styles.option_input} ${styles.button}`}
                                type="text"
                                id={`option${optionIndex}${index}`}
                                value={option.image}
                                onChange={(e) =>
                                  handleImageOptionChange(index, optionIndex, e)
                                }
                                placeholder="Image URL"
                              />
                            )}
                            {question.OptionType === 2 && (
                              <>
                                <input
                                  style={
                                    question.correctOption === optionIndex
                                      ? {
                                          backgroundColor: "#60b84b",
                                          color: "white",
                                        }
                                      : {}
                                  }
                                  className={`${styles.option_Text_input} ${styles.button}`}
                                  type="text"
                                  id={`optionText${optionIndex}${index}`}
                                  value={option.text}
                                  onChange={(e) =>
                                    handleTextOptionChange(
                                      index,
                                      optionIndex,
                                      e,
                                    )
                                  }
                                  placeholder="Text"
                                />
                                <input
                                  style={
                                    question.correctOption === optionIndex
                                      ? {
                                          backgroundColor: "#60b84b",
                                          color: "white",
                                        }
                                      : {}
                                  }
                                  className={`${styles.option_input} ${styles.button}`}
                                  type="text"
                                  id={`optionImage${optionIndex}${index}`}
                                  value={option.image}
                                  onChange={(e) =>
                                    handleImageOptionChange(
                                      index,
                                      optionIndex,
                                      e,
                                    )
                                  }
                                  placeholder="Image URL"
                                />
                              </>
                            )}
                            {optionIndex > 1 && (
                              <div
                                className={styles.delete_option}
                                onClick={() => deleteOption(index, optionIndex)}
                              >
                                X
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      {selectedType === "QnA" && (
                        <div className={styles.timer_container}>
                          <div className={`${styles.timer_header} `}>Timer</div>
                          <div
                            className={`${styles.timer_button} ${styles.button}`}
                            onClick={(e) => handleOffTimerChange(index, e)}
                            value={0}
                            style={
                              question.time === 0
                                ? {
                                    backgroundColor: "#D60000",
                                    color: "white",
                                  }
                                : {}
                            }
                          >
                            OFF
                          </div>
                          <div
                            className={`${styles.timer_button} ${styles.button}`}
                            onClick={(e) => handle5secTimerChange(index, e)}
                            value={5}
                            style={
                              question.time === 5
                                ? {
                                    backgroundColor: "#D60000",
                                    color: "white",
                                  }
                                : {}
                            }
                          >
                            5 Sec
                          </div>
                          <div
                            className={`${styles.timer_button} ${styles.button}`}
                            onClick={(e) => handle10secTimerChange(index, e)}
                            value={10}
                            style={
                              question.time === 10
                                ? {
                                    backgroundColor: "#D60000",
                                    color: "white",
                                  }
                                : {}
                            }
                          >
                            10 Sec
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`${styles.Add_option} ${styles.button}`}
                      onClick={() => addOption(index)}
                    >
                      Add Option
                    </div>
                  </form>
                </div>
              ))}
            </div>
            <div className={styles.action_item}>
              <div className={styles.cancel_button} onClick={handleClose}>
                Cancel
              </div>
              <div
                className={styles.continue_button}
                onClick={handleFormSubmit}
                disabled={questions.length !== 5}
              >
                {quizData ? "Update" : "Create"}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DynamicFormModal;