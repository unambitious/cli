/*
Copyright 2017 Lucas Dohmen

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

let readline = require('readline')
let fs = require('fs')
let spawn = require('child_process').spawn

// TODO: Determine if the BridgeTroll should only do the q/a stuff
// and the fs stuff should be done elsewhere
class BridgeTroll {
  constructor () {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
  }

  say (msg) {
    console.log(msg)
  }

  report (msg) {
    console.log(`  ${msg}`)
  }

  ask (question) {
    return new Promise((resolve) => {
      this.rl.question(`${question} `, resolve)
    })
  }

  affirm (question) {
    return this.ask(`${question} (Y/n)`)
    .then((answer) => answer.toLowerCase() === 'y' || answer === '')
  }

  stop () {
    this.rl.close()
  }

  // TODO: Handle Error
  // Could take a second argument that says "ignore error"
  createDir (name, opts = {}) {
    return new Promise((resolve) => {
      fs.mkdir(name, (error) => {
        if (error) {
          console.log(error)
          this.stop()
          process.exit()
        }

        if (opts.cwd) {
          this.cwd = name
        }

        this.report(`Directory ${name} created`)
        resolve()
      })
    })
  }

  spawn (command, args) {
    return new Promise((resolve) => {
      let runningCommand = spawn(command, args, { cwd: this.cwd })

      runningCommand.stdout.on('data', (data) => {
        this.report(`  ${data}`)
      })

      runningCommand.stderr.on('data', (data) => {
        this.report(`  ${data}`)
      })

      runningCommand.on('close', (code) => {
        resolve()
      })
    })
  }
}

module.exports = BridgeTroll
