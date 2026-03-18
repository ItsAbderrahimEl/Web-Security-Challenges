export default class Server {
    static async toTestTheGuess (player) {
        return (await axios.get('/secret/check', {
            params: {
                guess: player.guess,
            }
        })).data
    }

    static async generate (player) {
        return (await axios.get('/game/store', {
            params: {
                minRange: player.rules.minRange,
                maxRange: player.rules.maxRange,
                maxAttempts: player.rules.maxAttempts,
                username: player.username,
            }
        })).data
    }

    static async getGames() {
        return (await axios.get('/games/history')).data
    }
}
