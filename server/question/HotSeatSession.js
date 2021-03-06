const fs = require('fs');

const HotSeatQuestion = require(process.cwd() + '/server/question/HotSeatQuestion.js');

// If we are testing, use the mock question file.
const inTest = process.argv[1].includes('mocha');
const FILE_PATH_PREFIX = inTest ?
    process.cwd() + '/test/server/question/MockHotSeatQuestions' :
    process.cwd() + '/server/question/HotSeatQuestions';
const EASY_QUESTIONS = JSON.parse(fs.readFileSync(FILE_PATH_PREFIX +
    (inTest ? '.json' : 'Easy.json'), 'utf8'));
const MEDIUM_QUESTIONS = JSON.parse(fs.readFileSync(FILE_PATH_PREFIX +
    (inTest ? '.json' : 'Medium.json'), 'utf8'));
const HARD_QUESTIONS = JSON.parse(fs.readFileSync(FILE_PATH_PREFIX +
    (inTest ? '.json' : 'Hard.json'), 'utf8'));

// Generates HotSeatQuestions within a session.
//
// Reads from local JSON files that are separated by easy, medium, and hard difficulties.
class HotSeatSession {

  constructor() {
    this.openEasyQuestions = this._getRefreshedQuestions(EASY_QUESTIONS);
    this.openMediumQuestions = this._getRefreshedQuestions(MEDIUM_QUESTIONS);
    this.openHardQuestions = this._getRefreshedQuestions(HARD_QUESTIONS);
  }

  // Returns an array of indices to indicate available questions in the given question list.
  _getRefreshedQuestions(originalQuestions) {
    var openQuestions = [];

    for (var i = 0; i < originalQuestions.length; i++) {
      openQuestions.push(i);
    }

    return openQuestions;
  }

  // Returns a new question from the given question and open indices, subsequently marking it as
  // used.
  _getNewOpenQuestion(openQuestions, questions) {
    var openIndexIndex = Math.trunc(Math.random() * openQuestions.length);
    var openIndex = openQuestions.splice(openIndexIndex, 1)[0];
    return new HotSeatQuestion(questions[openIndex]);
  }


  // PUBLIC METHODS

  // Returns a new HotSeatQuestion suitable for the given question index
  getNewQuestion(questionIndex) {
    if (questionIndex <= 4) {
      // Easy questions up through $1,000.
      var question = this._getNewOpenQuestion(this.openEasyQuestions, EASY_QUESTIONS);
      if (this.openEasyQuestions.length < 1) {
        this.openEasyQuestions = this._getRefreshedQuestions(EASY_QUESTIONS);
      }
      return question;
    } else if (questionIndex <= 9) {
      // Medium questions up through $32,000.
      var question = this._getNewOpenQuestion(this.openMediumQuestions, MEDIUM_QUESTIONS);
      if (this.openMediumQuestions.length < 1) {
        this.openMediumQuestions = this._getRefreshedQuestions(MEDIUM_QUESTIONS);
      }
      return question;
    } else {
      // Hard questions the rest of the way.
      var question = this._getNewOpenQuestion(this.openHardQuestions, HARD_QUESTIONS);
      if (this.openHardQuestions.length < 1) {
        this.openHardQuestions = this._getRefreshedQuestions(HARD_QUESTIONS);
      }
      return question;
    }
  }
}

module.exports = HotSeatSession;
HotSeatSession.EASY_QUESTIONS = EASY_QUESTIONS;
HotSeatSession.MEDIUM_QUESTIONS = MEDIUM_QUESTIONS;
HotSeatSession.HARD_QUESTIONS = HARD_QUESTIONS;