import Server from './Server.js'
import UI from '../General/UI.js'
import Rules from '../General/Rules.js'
import Player from '../General/Player.js'

export default class Game {
    static rulesForm = UI.getBy('#rules-form')
    static guessSection = UI.getBy('#guess-section')

    constructor (minRange, maxRange, maxAttempts) {
        this.rules = new Rules(minRange, maxRange, maxAttempts)
        this.player = new Player(this.rules)
        this.secret = null
    }

    async play () {
        Server.generate(this.rules)

        UI.output(`🎮 New game started! You have ${this.rules.maxAttempts} attempts.`)

        UI.output(`🎯 Enter a number between ${this.rules.minRange} and ${this.rules.maxRange}:`)

        while (this.player.history.length() < this.rules.maxAttempts) {
            this.player.guess = await this.player.toGiveGuess()

            if (this.player.guess === 'mistake') {
                continue
            }

            if (this.player.guess === 'cancel') {
                this.cancelGame()
                return
            }

            this.player.history.add(this.player.guess)

            this.secret = await Server.toTestTheGuess(this.player.guess)

            if (this.secret.guessed) {
                this.winner()
                return
            }

            this.toGiveHint()
        }

        this.losser()
    }

    winner () {
        UI.output(`🎉 Congratulations! You guessed the secret number (${this.secret.value}) in ${this.player.history.length()} attempt${this.player.history.length() > 1 ? 's' : ''}.`)
        this.gameEnd()
    }

    losser () {
        UI.output(`😢 Game over! The secret number was ${this.secret.value}.`)
        this.gameEnd()
    }

    toGiveHint () {
        if (this.secret.is === 'greater') {
            UI.output(`📈 ${this.player.guess} is too high. Try a smaller number!`)
        }

        if (this.secret.is === 'lower') {
            UI.output(`📉 ${this.player.guess} is too low. Try a bigger number!`)
        }

        UI.scrollToBottom('#main-container')
    }

    gameEnd () {
        UI.show(Game.rulesForm)
        UI.hide(Game.guessSection)
        UI.selectDefaultMode()
        UI.scrollToBottom('#main-container')
        UI.output(`📜 Your history: ${this.player.history.get()}`)
    }

    cancelGame () {
        this.gameEnd()
        UI.clearOutput()
        UI.defaultConsoleOutput()
    }
}
