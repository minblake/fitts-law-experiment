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
        amplitude: 'short',
        start: 'bottom right',
        target: 'bottom left'
      },
      {
        amplitude: 'normal',
        start: 'midrow left',
        target: 'top left'
      },
      {
        amplitude: 'long',
        start: 'top midcol',
        target: 'bottom midcol'
      },
    ],
    currentButtonState: { size: '', amplitude: '' },
    randomAmp: {},
    startSizeAndPosition: '',
    targetSizeAndPosition: '',
    isStartSelected: false,
    results: [],
    clickSpeed: 0,
    timer: null,
    timerStarted: false
  },
  methods: {
    startExperiment() {
      this.hasExperimentStarted = true;
      this.hasExperimentEnded = false;
      this.numTrials = 0;
      this.startTrial();
    },
    endExperiment() {
      this.hasExperimentStarted = false;
      this.hasExperimentEnded = false;
      this.numTrials = 0;
      this.results = [];
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

      const { amplitude, start, target } = this.randomAmp[size].pop();
      this.currentButtonState = { size, amplitude };
      this.startSizeAndPosition = size + ' ' + start;
      this.targetSizeAndPosition = size + ' ' + target;

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
        this.timer = setInterval(this.updateTime, 1);
      }
    },
    stopTimer() {
      this.timerStarted = false;
      clearInterval(this.timer);
    },
    addRecord() {
      const { amplitude, size } = this.currentButtonState;
      this.results.push({
        trialNum: this.numTrials,
        record: this.clickSpeed,
        amplitude,
        size
      });
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
    }
  }
});