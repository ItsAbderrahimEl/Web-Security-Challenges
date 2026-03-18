import UI from './UI.js'
import History from './History.js'


export default class Player {
    constructor (rules, username = null ) {
        this.username = username
        this.guess = null
        this.rules = rules
        this.history = new History()
    }

    toGiveGuess () {
        let guessForm = UI.getBy('#guess-form')

        return new Promise((resolve) => {
            guessForm.addEventListener('submit', (event) => {
                event.preventDefault()

                if(event.submitter.id === 'cancel-button-guess') {
                    resolve('cancel')
                    return
                }

                let guessInput = event.target.elements.namedItem('guess-input')

                let guess = Number.parseInt(guessInput.value)


                if(this.isInvalid(guess)) {
                    resolve('mistake')
                    return
                }

                guessInput.value = ''

                resolve(guess)
            }, { once: true })
        })
    }

    isInvalid(guess) {
        if (! (guess > this.rules.maxRange || guess < this.rules.minRange || Number.isNaN(guess))) {
            return false
        }

        UI.feedBack(`The number must be between ${this.rules.minRange} and ${this.rules.maxRange}.`)

        return true
    }
}
