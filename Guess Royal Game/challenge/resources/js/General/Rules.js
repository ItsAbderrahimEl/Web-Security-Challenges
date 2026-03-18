export default class Rules
{
	constructor(minRange, maxRange, maxAttempts)
	{
		minRange = Number(minRange)
		maxRange = Number(maxRange)
		maxAttempts = Number(maxAttempts)

		if(this.invalidRules(minRange, maxRange, maxAttempts)) {
			throw new Error('Invalid rules, try again.')
		}

		this.rules = {
			minRange: minRange,
			maxRange: maxRange,
			maxAttempts: maxAttempts,
		}
	}

	get minRange()
	{
		return this.rules.minRange
	}

	get maxRange()
	{
		return this.rules.maxRange
	}

	get maxAttempts()
	{
		return this.rules.maxAttempts
	}

	invalidRules(minRange, maxRange, maxAttempts)
	{
		if(Number.isNaN(minRange) || Number.isNaN(maxRange) || Number.isNaN(maxAttempts))
		{
			return true
		}
		return minRange <= 0 || minRange > maxRange || maxAttempts <= 0;
	}
}
