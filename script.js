// root of the element
const root = document.getElementById("root");

// Type of Question
type Question = {
  question: string;
  options: Array<string>;
  answerIndex: number;
  successMessage: string;
};

// Collection of questions
const data: Question[] = [
  {
    question: "This is a question",
    options: ["option 1", "option 2", "option 3", "option 4"],
    answerIndex: 1,
    successMessage: "The message is correct",
  },
  {
    question: "This is a question",
    options: ["option 1", "option 2", "option 3", "option 4"],
    answerIndex: 1,
    successMessage: "The message is correct",
  },
  {
    question: "This is a question",
    options: ["option 1", "option 2", "option 3", "option 4"],
    answerIndex: 1,
    successMessage: "The message is correct",
  },
  {
    question: "This is a question",
    options: ["option 1", "option 2", "option 3", "option 4"],
    answerIndex: 1,
    successMessage: "The message is correct",
  },
];

// Various constants across the application
const ERROR_MESSAGE = "The selected option is incorrect";
const TOTAL_ANSWER_ID = "answer";
const TOTAL_CORRECT_ANSWER_ID = "correct";

/**
 * @typedef ElementProperties
 * Properties of the element
 * @property {string} elementType Type of the element
 * @property {string} text Text node of the element
 * @property {Array} children Collection of childrens of the element
 * @property {string} id Id of the element
 * @property {string} className Class of element
 * @property {string} name Name of element if elementType is input
 * @property {string} inputType Type of input if elementType is input
 * @property {string} inputValue Value of element is elementType is input
 */

/**
 * Element function to create HTML Element
 * @param {ElementProperties} props Properties of the element
 * @returns {HTMLElement|HTMLInputElement}
 */
const element = (props: {
  elementType: string;
  text?: string | undefined;
  children?: Array<HTMLElement> | undefined;
  id?: string | undefined;
  className?: string | undefined;
  name?: string | undefined;
  inputType?: string | undefined;
  inputValue?: string | undefined;
  action?:
    | {
        type: string;
        method: EventListenerOrEventListenerObject;
      }
    | undefined;
}): HTMLElement | HTMLInputElement => {
  let element = document.createElement(props.elementType);

  if (props.text) {
    element.innerText = props.text;
  }

  if (props.id) {
    element.id = props.id;
  }

  if (props.children) {
    props.children.map((child) => element.append(child));
  }

  if (props.name && element instanceof HTMLInputElement) {
    element.name = props.name;
    if (props.inputType) {
      element.type = props.inputType;
    }
    if (props.inputValue) {
      element.value = props.inputValue;
    }
  }

  if (props.className) {
    element.className = props.className;
  }

  if (props.action) {
    element.addEventListener(props.action.type, props.action.method);
  }

  return element;
};

/**
 * Container to show option in form
 * @param {string} optionValue Value of option
 * @param {number} index name of radio input
 * @returns {HTMLElement}
 */
const optionContainer = (optionValue: string, index: number): HTMLElement => {
  return element({
    elementType: "div",
    className: "flex flex-row items-center space-x-3",
    children: [
      element({
        elementType: "input",
        className: "radio radio-primary radio-sm",
        name: String(index),
        inputType: "radio",
        inputValue: optionValue,
      }),
      element({
        elementType: "span",
        text: optionValue,
      }),
    ],
  });
};

/**
 * Container to hold question of the quiz
 * @param {string} question
 * @param {Array<string>} options Collection of options
 * @param {number} index a unique identifier
 * @returns {HTMLElement}
 */
const questionContainer = (
  question: string,
  options: Array<string>,
  index: number
): HTMLElement => {
  return element({
    elementType: "div",
    className: "p-5",
    children: [
      element({
        elementType: "h5",
        className: "font-semibold",
        text: question,
      }),
      element({
        elementType: "div",
        className: "flex flex-col space-y-3 p-3",
        children: options.map((option) => optionContainer(option, index)),
      }),
    ],
  });
};

/**
 * Method to set success/error message of each question
 * @param {HTMLElement} parentContainer Selected container of question
 * @param {string} message message to be displayed
 * @param {"success"|"error"} type Type of message
 */
const setPromptData = (
  parentContainer: HTMLElement,
  message: string,
  type: "success" | "error"
): void => {
  const promptField = parentContainer.getElementsByClassName("prompt")[0];

  if (promptField) {
    promptField.textContent = message;
    if (type === "success") {
      promptField.classList.remove("text-error");
      promptField.classList.add("text-success");
    }

    if (type === "error") {
      promptField.classList.remove("text-success");
      promptField.classList.add("text-error");
    }
  } else {
    parentContainer.append(
      element({
        elementType: "span",
        className: `text-${type} font-semibold text-sm prompt`,
        text: message,
      })
    );
  }
};

/**
 * Method to handle submission when form is submitted
 */
const handleSubmission = (e: Event) => {
  e.preventDefault();
  let correctAnswers = 0;
  let totalAnswered = 0;
  if (e.target) {
    const values = Object.values(e.target).reduce((obj, field) => {
      if (field.checked) {
        // select question from given question collection
        const selectedQuestion = data[field.name];
        // check if answer matches
        const answerMatches =
          selectedQuestion.answerIndex ===
          selectedQuestion.options.indexOf(field.value);

        totalAnswered++;
        if (answerMatches) {
          correctAnswers++;
          setPromptData(
            field.parentElement.parentElement,
            selectedQuestion.successMessage,
            "success"
          );
        } else {
          setPromptData(
            field.parentElement.parentElement,
            ERROR_MESSAGE,
            "error"
          );
        }
      }
      return obj;
    }, {});
  }

  const totalAnsweredContainer = document.getElementById(TOTAL_ANSWER_ID);
  if (totalAnsweredContainer) {
    totalAnsweredContainer.innerText = String(totalAnswered);
  }

  const correctAnswersContainer = document.getElementById(
    TOTAL_CORRECT_ANSWER_ID
  );
  if (correctAnswersContainer) {
    correctAnswersContainer.innerText = String(correctAnswers);
  }
};

/**
 * Method to render question list
 * @param {Array<Question>} data Array of questions
 * @returns {HTMLElement}
 */
const questionList = (data: Question[]): HTMLElement => {
  return element({
    elementType: "form",
    className: "flex flex-col divide-y-2 divide-primary",
    children: [
      ...data.map((qa, index) =>
        questionContainer(qa.question, qa.options, index)
      ),
      ...[
        element({
          elementType: "button",
          inputType: "submit",
          className: "btn btn-primary",
          text: "Submit",
        }),
      ],
    ],
    action: {
      type: "submit",
      method: handleSubmission,
    },
  });
};

document.addEventListener("DOMContentLoaded", () => {
  if (root) {
    root.append(
      element({
        elementType: "div",
        className:
          "sticky top-0 p-5 bg-primary text-primary-content flex justify-around text-xl",
        children: [
          element({
            elementType: "div",

            children: [
              element({ elementType: "span", text: "Questions answered: " }),
              element({ elementType: "span", text: "0", id: TOTAL_ANSWER_ID }),
            ],
          }),
          element({
            elementType: "div",
            children: [
              element({ elementType: "span", text: "Correct answers: " }),
              element({
                elementType: "span",
                text: "0",
                id: TOTAL_CORRECT_ANSWER_ID,
              }),
            ],
          }),
        ],
      })
    );
    root.append(questionList(data));
  }
});
