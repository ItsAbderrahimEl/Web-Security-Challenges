export default class UI {
    static getBy (selector) {
        return document.querySelector(selector)
    }

    static show (element, mode = 'flex') {
        element.classList.add(mode)
        element.classList.remove('hidden')
    }

    static hide (element, mode = 'flex') {
        element.classList.remove(mode)
        element.classList.add('hidden')
    }

    static feedBack (text) {
        let feedBack = document.getElementById('feed-back')
        feedBack.innerHTML = text
        setTimeout(() => { feedBack.innerHTML = '' }, 3000)
    }

    static clearOutput () {
        let outputList = document.getElementById('output-list')
        outputList.innerHTML = ''
    }

    static selectDefaultMode () {
        let defaultMode = document.getElementById('mode-default-radio')
        defaultMode.checked = true
        defaultMode.dispatchEvent(new Event('input'))
    }

    static output (text) {
        let outputList = document.getElementById('output-list')
        outputList.innerHTML += `<li class="font-bold">${text}</li>`
    }

    static scrollToBottom (selector) {
        let element = document.querySelector(selector)
        element.scrollTo({
            top: element.scrollHeight,
            behavior: 'smooth'
        })
    }

    static defaultConsoleOutput () {
        let outputConsole = UI.getBy('#output-list')
        outputConsole.innerHTML = `
                <li class="font-bold">Do you have what it takes to take on this challenge?</li>
                <li class="font-bold">Choose a minimum, a maximum, and your number of attempts — or pick a preset:</li>
                <li class="font-bold">Easy: 1–10 • 3 attempts</li>
                <li class="font-bold">Medium: 1–20 • 5 attempts</li>
                <li class="font-bold">Hard: 1–100 • 5 attempts</li>`
    }

    static showGames () {

    }
}
