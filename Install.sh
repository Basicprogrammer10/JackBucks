#!/bin/bash

version="1.3"
gitRepo="https://github.com/Basicprogrammer10/SupremeBank.git"
packages=(git nodejs npm)

function colorPrint() {
    echo -e"$3" "\e[0;$2m[*] $1"
}

function basicColorPrint() {
    echo -e"$3" "\e[0;$2m$1"
}

function packageCheck() {
    notFound=false
    for u in "${packages[@]}"
    do
        colorPrint "Checking for $u" 36 n
        if ! command -v "$u" &> /dev/null
        then
            basicColorPrint " [NOT FOUND]" 31
            notFound=true
        else
            basicColorPrint " [FOUND]" 32
        fi
    done
    if $notFound
    then
        colorPrint "Go Get the Not Found Packages Installed and run this script again :P" 37
        exit
    fi
}

function getRepo() {
    basicColorPrint "" 35 n
    if ! command git clone $gitRepo
    then
        colorPrint "Error Cloning Repo :(" 31
        exit
    fi
    colorPrint "Clone Success" 32
    cd SupremeBank || exit
}

function genConfig() {
    opts=(BotToken CurrencyName)
    for u in "${opts[@]}"
    do
        colorPrint "$u: " 33 n
        read -r "${u?}"
    done
    defaultConfig='{"bot":{"clientId":"'$BotToken'","botName":"Supreme Bank","adminId":["466967710685855744"],"version":"0.16.1","activity":"?help","commandPrefix":"?","disabledCommands":[]},"data":{"dataFile":"data/bank.json"},"bank":{"currency":"'$CurrencyName'","startingValue":100}}'
    if ! command echo "$defaultConfig" > src/config/config.json
    then
        colorPrint "Error Writing Config File? idk whats going on" 31
        exit
    fi
}

function installNodeModules() {
    if ! command npm i
    then
        colorPrint "Error Installing Node Modules" 31
        exit
    fi
}

function askRun() {
    colorPrint "Ready to Start Bot (Y/n): " 33 n
    read -r -n1 a
    if [[ $a == "" || $a == "Y" || $a == "y" ]]
    then
        cd src || exit
        command node .
    else
        echo -e
        colorPrint "Way to ruin the fun "$USER 31
    fi
}

function checkRun() {
    if [[ -d "SupremeBank" ]]
    then
        cd SupremeBank || exit
        askRun
        exit
    fi
}

function dockerRun() {
    colorPrint "Checking for Docker" 36 n
    if ! command -v "docker" &> /dev/null; then
        basicColorPrint " [NOT FOUND]" 31
        colorPrint "Go ahed and Install Docker. Then run this script again!" 37
        exit
    else
        basicColorPrint " [FOUND]" 32
    fi
    colorPrint "Building Docker Container" 34
    basicColorPrint "" 35 n
    sudo docker build . -t basicprogrammer10/supremebank
    if [ $? != 0 ]; then
        colorPrint "Error Building Container :/ Try running as root?" 31
        exit
    fi
    colorPrint "Success!" 32
    colorPrint "You may now run the container with 'sudo docker run -d basicprogrammer10/supremebank'"
}

function checkForArg() {
    runArgs=$1
    length=${#2}

    for i in  $(seq 0 ${#runArgs})
    do
        if [[ ${runArgs:$i:$length} == $2 ]]; then
            return 0
        fi
    done
    return 1
}

function main() {
    colorPrint "Welcome to Supreme Bank Bot Installer :P (v"$version")" 32
    colorPrint "By Connor Slade\n" 32

    checkRun

    colorPrint "Checking for Needed Packages" 34
    packageCheck
    colorPrint "All Needed Packages Found!" 32
    colorPrint "Cloning Repo" 34
    getRepo

    colorPrint "Creating Config File" 34
    genConfig
    colorPrint "Config File Created!" 32

    colorPrint "Creating Data File" 34
    echo "{}" > src/config/config.json
    colorPrint "Data File Created!" 32

    if checkForArg "$* " "--docker"; then
        dockerRun
        exit
    fi

    colorPrint "Installing Node Modules" 34
    installNodeModules
    colorPrint "Modules Installed!" 32

    askRun
}

main "$@"