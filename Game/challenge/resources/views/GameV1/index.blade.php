<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎲</text></svg>">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet"/>

    @vite(['resources/js/Game-v1/app.js'])
</head>
<body
    class="min-h-screen  flex flex-col items-center justify-center gap-y-[40px] text-white"
    style="background-image: url({{ asset('./images/background3.png') }}); background-size: contain;"
>
<h1 class="text-white text-center text-5xl font-bold">
    🎲 Guess Royal
</h1>

<div id="main-container"
     class="font-bold w-2/3 flex flex-col min-h-120 items-center bg-[rgba(157,222,255,0.3)] rounded-xl px-[18px] py-[25px] gap-[30px] overflow-y-scroll pb-10">

    <form id="rules-form" class="flex w-3/4 flex-col gap-[20px]">
        <h2 class="text-3xl font-bold">
            Rules
        </h2>

        <div class="w-full">
            <div id="custom-fields" class="gap-2.5 justify-between hidden">
                <input
                    id="minRange-input"
                    name="MinRange" type="number" placeholder="Min Range"
                    class="w-1/3 py-2 pl-3 rounded-xl bg-gray-300 placeholder-gray-500 focus:outline-3 outline-gray-500 text-black"
                >
                <input
                    id="maxRange-input"
                    name="MaxRange" type="number" placeholder="Max Range"
                    class="w-1/3 py-2 pl-3 rounded-xl bg-gray-300 placeholder-gray-500 focus:outline-3 outline-gray-500 text-black"
                >
                <input
                    id="maxAttempts-input"
                    name="MaxAttempts" type="number" placeholder="Max Attempts"
                    class="w-1/3 py-2 pl-3 rounded-xl bg-gray-300 placeholder-gray-500 focus:outline-3 outline-gray-500 text-black"
                >
            </div>

            <div id="default-select" class=" relative w-full flex items-center justify-center">
                <select
                    name="pre-defined-rules"
                    id="pre-defined-rules"
                    class="w-1/2 outline-1 outline-gray-500 rounded-xl bg-[#0e0f37] inline-block py-2 pl-4 cursor-pointer appearance-none"
                >
                    <option data-min-range="1" data-max-range="10" data-max-attempts="3">Easy Game</option>
                    <option data-min-range="1" data-max-range="20" data-max-attempts="5">Medium Game</option>
                    <option data-min-range="1" data-max-range="100" data-max-attempts="5">Hard Game</option>
                </select>

                <div class="absolute inset-y-0 right-45 flex items-center pl-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
                    </svg>
                </div>
            </div>
        </div>

        <div class="flex justify-between items-center w-full">

            <div class="relative  flex rounded-xl bg-[#0e0f37] shadow-md px-3 py-2 space-x-3">
                <label class="radio cursor-pointer">
                    <input
                        type="radio"
                        value="custom"
                        class="hidden peer"
                        id="mode-custom-radio"
                        name="pre-defined-mods"
                    >
                    <span
                        class="flex items-center justify-center cursor-pointer rounded py-1 px-2 text-white peer-checked:bg-gray-500">
                        Custom
                    </span>
                </label>

                <label class="radio cursor-pointer group">
                    <input
                        checked
                        type="radio"
                        value="default"
                        class="hidden peer"
                        name="pre-defined-mods"
                        id="mode-default-radio"
                    >
                    <span
                        class="flex items-center justify-center cursor-pointer rounded py-1 px-2 text-white peer-checked:bg-gray-500">
                        Defaults
                    </span>
                </label>
            </div>

            <div class="flex gap-[15px] self-end">
                <button
                    id="play-button"
                    class="w-[140px] h-[45px] bg-[#0e0f37] rounded-xl font-bold cursor-pointer focus:outline-3 outline-gray-500"
                > Play
                </button>
            </div>
        </div>
    </form>

    <div id="guess-section" class="w-ful flex-col items-center justify-center gap-[20px] hidden">
        <p class="block font-bold text-yellow-500" id="feed-back"></p>

        <form id="guess-form" class="space-x-3">
            <input
                name="guess-input"
                type="number"
                placeholder="Take your best shot!"
                class="py-2.5 pl-4 rounded-xl bg-gray-300 placeholder-gray-500 focus:outline-3 outline-gray-500 text-black"
            />
            <button class="w-[140px] h-[45px] bg-[#0e0f37] rounded-xl font-bold cursor-pointer focus:outline-3 outline-gray-500">
                Guess
            </button>
            <button
                id="cancel-button-guess"
                class="border-3 border-red-500 w-[140px] h-[45px] rounded-xl font-bold cursor-pointer focus:outline-3 outline-red-700"
            >
                Cancel
            </button>
        </form>
    </div>

    <div class="w-3/4 h-1 bg-gray-300/50 rounded-xl"></div>

    <div class="w-3/4 max-h-fill flex flex-col gap-[20px] font-medium ">
        <h2 class="text-3xl font-bold">
            Console
        </h2>

        <div class="pl-10 ">
            <ul id="output-list" class="list-disc">
                <li class="font-bold">Do you have what it takes to take on this challenge?</li>
                <li class="font-bold">Choose a minimum, a maximum, and your number of attempts — or pick a preset:</li>
                <li class="font-bold">Easy: 1–10 • 3 attempts</li>
                <li class="font-bold">Medium: 1–20 • 5 attempts</li>
                <li class="font-bold">Hard: 1–100 • 5 attempts</li>
            </ul>
        </div>
    </div>
</div>

<footer class="w-full text-sm flex items-center justify-end font-extrabold">
    <p class="underline inline-block mr-5"><span class="inline-block mr-2">Contact:</span> admin@guessroyal.htb</p>
</footer>
</body>
</html>
