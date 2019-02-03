new Vue({
  el: '#app',
  data: {
    hasExperimentStarted: false,
    hasExperimentEnded: false,
    hasTrialEnded: false,
    numTrials: 0,
    maxNumTrials: 10,
    amplitudes: [
      {
        start: 'bottom right',
        target: 'bottom left'
      },
      {
        start: 'midrow left',
        target: 'top left'
      },
      {
        start: 'top midcol',
        target: 'bottom midcol'
      },
    ],
    randomAmp: {},
    startSizeAndPosition: '',
    targetSizeAndPosition: '',
    isStartSelected: false,
    results: [],
    clickSpeed: 0,
    timerStarted: false
  },
  methods: {
    startExperiment() {
      this.hasExperimentStarted = true;
      this.hasExperimentEnded = false;
      this.numTrials = 0;
      this.startTrial();
    },
    startTrial() {
      this.hasTrialEnded = false;
      this.numTrials++;
      if (this.numTrials > this.maxNumTrials) {
        this.hasExperimentStarted = false;
        this.hasExperimentEnded = true;
      } else {
        this.generateRandomAmp();
        this.attachRandomClass();
      }
    },
    attachRandomClass() {
      const size = this.getRandomSize();

      const randomClass = this.randomAmp[size].pop();
      this.startSizeAndPosition = size + ' ' + randomClass.start;
      this.targetSizeAndPosition = size + ' ' + randomClass.target;

      if (!this.randomAmp[size].length) {
        delete this.randomAmp[size];
      }
    },
    getRandomSize() {
      let keys = Object.keys(this.randomAmp);

      return keys[this.generateRandomValue(keys.length)];
    },
    generateRandomAmp() {
      this.randomAmp = {
        small: this.shuffleArray(this.amplitudes.slice()),
        medium: this.shuffleArray(this.amplitudes.slice()),
        large: this.shuffleArray(this.amplitudes.slice()),
      }
    },
    shuffleArray(arr) {
      let currIndex = arr.length;
      let temp, randomIndex;

      while (currIndex !== 0) {
        randomIndex = this.generateRandomValue(currIndex);
        currIndex--;

        temp = arr[currIndex];
        arr[currIndex] = arr[randomIndex];
        arr[randomIndex] = temp;
      }

      return arr;
    },
    generateRandomValue(max) {
      return Math.floor(Math.random() * max);
    },
    selectedStart() {
      this.isStartSelected = true;
      this.startTimer();
    },
    selectedTarget() {
      // stop timer
      this.stopTimer();
      this.addRecord();

      this.isStartSelected = false;

      if (Object.keys(this.randomAmp).length === 0) {
        this.hasTrialEnded = true;;
      } else {
        this.attachRandomClass();
      }
    },
    updateTime() {
      if (this.timerStarted) {
        this.clickSpeed++;
      }
    },
    startTimer() {
      if (!this.timerStarted && this.isStartSelected) {
        this.timerStarted = true;
        setInterval(this.updateTime, 1);
      }
    },
    stopTimer() {
      this.timerStarted = false;
      clearInterval();
    },
    addRecord() {
      this.results.push({ trialNum: this.numTrials, record: this.clickSpeed });
      this.clickSpeed = 0;
    },
    // TODO: called when user doesn't click the buttons
    recordError(event) {
      if (!event.target.classList.contains("fitts")) {

        // do something with error
        console.log('Pressed outside button');
      }
    },
  },
  computed: {
    startBtnClass() {
      return [
        this.startSizeAndPosition,
        {
          'is-success': this.isStartSelected,
        }
      ]
    },
    targetBtnClass() {
      return [
        this.targetSizeAndPosition
      ]
    },
    trialScreenMsg() {
      return this.numTrials <= this.maxNumTrials ? `Trial ${this.numTrials} / ${this.maxNumTrials}` : 'Thank you for participating!';
    }
  }
});