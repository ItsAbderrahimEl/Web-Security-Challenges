import Rules from '../General/Rules.js'
import Server from './Server.js'
import Player from '../General/Player.js'
import UI from '../General/UI.js'
import History from '../General/History.js'

export default class Game {
    static  rulesForm = UI.getBy('#rules-form')
    static guessSection = UI.getBy('#guess-section')
    static nameSection = UI.getBy('#name-section')

    constructor (username, minRange, maxRange, maxAttempts) {
        this.rules = new Rules(minRange, maxRange, maxAttempts)
        this.player = new Player(this.rules, username)
        this.secret = null
    }

    async play () {
        await Server.generate(this.player)

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

            this.secret = await Server.toTestTheGuess(this.player)

            this.player.history.add(this.player.guess)

            if (this.secret.guessed) {
                await this.winner()
                return
            }
            this.toGiveHint()
        }
        await this.losser()
    }

    async winner () {
        UI.output(`🎉 Congratulations ${this.player.username}! You guessed the secret number (${this.secret.value}).`)
        await History.getHistory()
        this.gameEnd()
    }

    async losser () {
        UI.output(`😢 Game over! The secret number was ${this.secret.value}.`)
        await History.getHistory()
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
        console.log(Game.rulesForm)
        UI.show(Game.rulesForm)
        UI.show(Game.nameSection)
        UI.hide(Game.guessSection)
        UI.selectDefaultMode()
        UI.scrollToBottom('#main-container')
    }

    cancelGame () {
        this.gameEnd()
        UI.clearOutput()
        UI.defaultConsoleOutput()
    }
}
