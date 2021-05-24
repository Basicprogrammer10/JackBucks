#!/bin/bash

version="1.0"
gitRepo="https://github.com/Basicprogrammer10/SupremeBank.git"
packages=(git nodejs npm)

function colorPrint() {
    echo -e"$3" "\e[0;$2m[*] $1"
}

function packageCheck() {
    notFound=false
    for u in "${packages[@]}"
    do
        colorPrint "Checking for $u" 36 n
        if ! command -v "$u" &> /dev/null
        then
            colorPrint " [NOT FOUND]" 31
            notFound=true
        else
            colorPrint " [FOUND]" 32
        fi
    done
    if $notFound
    then
        colorPrint "Go Get the Not Found Packages Installed and run this script again :P" 37
        exit
    fi
}

function getRepo() {
    colorPrint "" 35 n
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
        read -r "$u"
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
    read -n1 a
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

    colorPrint "Installing Node Modules" 34
    installNodeModules
    colorPrint "Modules Installed!" 32

    askRun
}

main