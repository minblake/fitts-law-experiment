new Vue({
  el: '#app',
  data: {
    MAX_NUM_TRIAL_SET: 2,
    MAX_NUM_TRIALS: 1,
    hasExperimentStarted: false,
    hasExperimentEnded: false,
    hasTrialEnded: false,
    hasTrialsSetEnded: true,
    beforeTrialsSetStart: true,
    numTrials: 0,
    numTrialsSet: 0,
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
    isErrorSelected: false,
    results: [],
    clickSpeed: 0,
    timer: null,
    timerStarted: false,
    inputDev: {
       indexFinger: 'Hold the phone with your left hand and use the index finger of your right hand',
       thumb: 'Hold the phone with your right hand and use its thumb'
    },
    randomInputDev: {}
  },
  methods: {
    startExperiment() {
      this.hasExperimentStarted = true;
      this.hasExperimentEnded = false;
      this.beforeTrialsSetStart = true;
      this.numTrials = 0;
      this.startTrial();
    },
    startTrial() {
      this.hasTrialEnded = false;
      this.numTrials++;
      if (this.numTrials > this.MAX_NUM_TRIALS) {
	this.numTrialsSet++;
        if(this.numTrialsSet > this.MAX_NUM_TRIAL_SET - 1){
          this.hasExperimentStarted = false;
          this.hasExperimentEnded = true;
        }
        this.hasTrialsSetEnded = true;
        this.beforeTrialsSetStart = true;
      } else {
        this.generateRandomAmp();
        this.attachRandomClass();
      }
    },
    startTrialSet() {
      this.numTrials = 0;
      this.hasTrialsSetEnded = false;
      this.beforeTrialsSetStart = false;
      this.startTrial();
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
    getRandomInputDev() {
       let keys = Object.keys(this.inputDev);

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
      this.results.push(
        [this.numTrials, amplitude, size, this.clickSpeed]
      );
      this.clickSpeed = 0;
    },
    // TODO: called when user doesn't click the buttons
    recordError(event) {
    
      const { amplitude, size } = this.currentButtonState;

      if (!event.target.classList.contains("fitts")) {
	this.stopTimer();

	//Record Error
	this.results.push(
          [this.numTrials, amplitude, size, this.clickSpeed, "error occurred"]
        );
	this.clickSpeed = 0;


	//Show feedback of error
	this.isErrorSelected = true;
	
	// notify user that they missed the target
        // shorten the time if necessary
        setTimeout(() => {
          //Show feedback of error
	  this.isErrorSelected = false;
        }, 300);

	//Restart trial
	this.isStartSelected = false;
      }
    }
  },
  //Decide what input to use before experiment begins
  beforeMount() {
     this.randomInputDev = this.getRandomInputDev();
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
    downloadLink() {
      const csv = 'data:text/csv;charset=utf-8,' + this.results.map(result => result.join(',')).join('\n');
      return encodeURI(csv);
    },
    trialSetScreenMsg() {
      let message = 'Thank you for participating';
      let inputDevChosen;

      if(this.numTrialsSet == 0){
        message = this.inputDev[this.randomInputDev];
      }
      else if(this.numTrialsSet < this.MAX_NUM_TRIAL_SET){
	//Switch input device
	inputDevChosen = this.randomInputDev.toLowerCase().indexOf("indexFinger") == -1 ? "indexFinger" : "thumb";
        message = this.inputDev[inputDevChosen];
	this.randomInputDev = inputDevChosen;
      }

      return message;
    },
  }
});
