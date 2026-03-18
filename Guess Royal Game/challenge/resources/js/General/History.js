import Server from '../Game-v2/Server.js'
import UI from './UI.js'

export default class History {
    constructor () {
        this.value = []
    }

    static async getHistory () {
        let PreviousGamesSection = UI.getBy('#games-section')
        let PreviousGamesList = UI.getBy('#previous-games-list')
        PreviousGamesList.innerHTML = ''

        UI.show(PreviousGamesSection)
        let games = await Server.getGames()

        let index = 0

        let HTMLContent = ''

        games.forEach(game => {
            HTMLContent += `
                <div class="mb-10 p-5 bg-gray-300 rounded-xl shadow-md text-gray-500">
                    <div class="font-bold text-3xl mb-2 text-blue-950">In the ${++index} Game you ${game.result === 'winner' ? 'won' : 'lost'}</div>
                    <div>Rules: Min Range: ${game.rules.minRange}, Max Range: ${game.rules.maxRange}, Max Attempts: ${game.rules.maxAttempts}</div>
                    <div>Attempts History: ${game.history}</div>
                    <div>The secret was ${game.secret}</div>
                </div>
            `})

        PreviousGamesList.innerHTML = HTMLContent
    }

    length () {
        return this.value.length
    }

    add (value) {
        if (typeof value === 'number') {
            this.value.push(value)
        }
    }

    get () {
        return this.value.join(', ')
    }
}
