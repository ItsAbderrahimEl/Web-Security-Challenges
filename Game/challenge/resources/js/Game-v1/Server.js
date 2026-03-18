export default class Server {
    static async toTestTheGuess (guess) {
        return (await axios.get('/secret/check', {
            params: {
                guess: guess
            }
        })).data
    }

    static async generate (rules) {
        return (await axios.get('/game/store', {
            params: {
                minRange: rules.minRange,
                maxRange: rules.maxRange,
                maxAttempts: rules.maxAttempts
            }
        })).data
    }

    static getBetaGame() {
        window.location.assign('http://beta-game-v2.guessroyal.htb')
    }
}
