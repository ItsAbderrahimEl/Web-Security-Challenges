import '../bootstrap.js'
import '../../css/app.css'
import Game from './Game.js'
import UI from '../General/UI.js'

document.addEventListener('DOMContentLoaded', function () {
    UI.selectDefaultMode()

    let rulesForm = UI.getBy('#rules-form')
    let customFields = UI.getBy('#custom-fields')
    let guessSection = UI.getBy('#guess-section')
    let defaultSelect = UI.getBy('#default-select')
    let minRangeInput = UI.getBy('#minRange-input')
    let maxRangeInput = UI.getBy('#maxRange-input')
    let modeCustomRadio = UI.getBy('#mode-custom-radio')
    let maxAttemptsInput = UI.getBy('#maxAttempts-input')
    let modeDefaultRadio = UI.getBy('#mode-default-radio')


    modeCustomRadio.addEventListener('input', function () {
        UI.show(customFields)
        UI.hide(defaultSelect)
    })

    modeDefaultRadio.addEventListener('input', function () {
        UI.show(defaultSelect)
        UI.hide(customFields)
    })

    rulesForm.addEventListener('submit', function (event) {
        event.preventDefault()

        UI.show(guessSection)

        UI.clearOutput()

        UI.hide(rulesForm)

        if (rulesForm.elements.namedItem('pre-defined-mods').value === 'custom') {
            (new Game(
                minRangeInput.value, maxRangeInput.value, maxAttemptsInput.value
            )).play()
            return
        }

        let select = rulesForm.elements.namedItem('pre-defined-rules')
        let rules = { ...select.options[select.selectedIndex].dataset }

        for (let key in rules) {
            rules[key] = rules[key]
        }

        (new Game(
            rules.minRange,
            rules.maxRange,
            rules.maxAttempts
        )).play()
    })
})
