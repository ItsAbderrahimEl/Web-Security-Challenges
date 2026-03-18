import '../bootstrap.js'
import '../../css/app.css'
import UI from '../General/UI.js'
import Game from './Game.js'

document.addEventListener('DOMContentLoaded', function () {
    let rulesForm = UI.getBy('#rules-form')
    let customFields = UI.getBy('#custom-fields')
    let guessSection = UI.getBy('#guess-section')
    let defaultSelect = UI.getBy('#default-select')
    let minRangeInput = UI.getBy('#minRange-input')
    let maxRangeInput = UI.getBy('#maxRange-input')
    let modeCustomRadio = UI.getBy('#mode-custom-radio')
    let maxAttemptsInput = UI.getBy('#maxAttempts-input')
    let modeDefaultRadio = UI.getBy('#mode-default-radio')
    let nameInput = UI.getBy('#name-input')
    let nameSection = UI.getBy('#name-section')

    UI.selectDefaultMode()
    UI.hide(UI.getBy('#games-section'))

    modeCustomRadio.addEventListener('input', function () {
        UI.show(customFields, 'grid')
        UI.hide(defaultSelect)
    })

    modeDefaultRadio.addEventListener('input', function () {
        UI.show(defaultSelect)
        UI.hide(customFields, 'grid')
    })

    rulesForm.addEventListener('submit', function (event) {
        event.preventDefault()

        if (nameInput.value === '' || nameInput.value === null || nameInput.value === undefined) {
            UI.feedBack('' +
                '<div class="font-bold bg-amber-700/50 px-3 py-1.5 text-amber-400">' +
                'Enter your username. If you don’t have one, choose one now' +
                '</div>'
            )
            return
        }

        UI.show(guessSection)

        UI.clearOutput()

        UI.hide(rulesForm)

        UI.hide(nameSection)

        if (rulesForm.elements.namedItem('pre-defined-mods').value === 'custom') {
            (new Game(
                nameInput.value, minRangeInput.value, maxRangeInput.value, maxAttemptsInput.value
            )).play()
            return
        }

        let select = rulesForm.elements.namedItem('pre-defined-rules')
        let rules = { ...select.options[select.selectedIndex].dataset }

        for (let key in rules) {
            rules[key] = rules[key]
        }

        (new Game(
            nameInput.value,
            rules.minRange,
            rules.maxRange,
            rules.maxAttempts
        )).play()
    })
})
