/*var resultRecords = new Vue({
  el: '#results',
  data: {
    items: [
      { record: 'Foo' },
      { record: 'Bar' }
    ]
  }
})
*/

// var resultRecords = new Vue({
//   el: '#results',
//   data: {
//     items: [
//       { startTime: 'abc'},
//       { record: 'Foo' },
//       { record: 'Bar' }
//     ]
//   }
// })

new Vue({
  el: '#app',
  data: {
    hasExperimentStarted: false,
    hasTrialEnded: false,
    numTrials: 0,
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
    isTargetSelected: false,
    results: [{record: 'zz'}]
  },
  methods: {
    startExperiment() {
      this.hasExperimentStarted = true;
      this.numTrials++;
      this.generateRandomAmp();

      // Make the start and target button appear in random location from the start
      this.attachRandomClass();
    },
    startAnotherTrial() {
      this.hasTrialEnded = false;
      if (this.numTrials > 10) {
        this.hasExperimentStarted = false;
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
    // TODO: start timer when start button is pressed
    selectedStart() {
      this.isStartSelected = true;
      // start timer
    },
    // TODO: stop timer when target button is pressed
    selectedTarget() {
      this.isTargetSelected = true;
      // stop timer

      // notify user that they clicked successfully the target
      // shorten the time if necessary
      this.addRecord();
      setTimeout(() => {
        this.isStartSelected = false;
        this.isTargetSelected = false;

        if (Object.keys(this.randomAmp).length === 0) {
          this.numTrials++;
          this.hasTrialEnded = true;;
        } else {
          this.attachRandomClass();
        }
      }, 300);
    },
    addRecord() {
      this.results.push({ record: 'xyz' });
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
        this.targetSizeAndPosition,
        {
          'is-success': this.isTargetSelected
        }
      ]
    },
    trialScreenMsg() {
      return this.numTrials <= 10 ? `Trial ${this.numTrials} / 10` : 'Thank you for participating!';
    }
  }
});