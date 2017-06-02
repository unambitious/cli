#!/usr/bin/env node
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

let BridgeTroll = require('./lib/bridge-troll')
let bridgeTroll = new BridgeTroll()
let NpmInit = require('./lib/npm-init')
let npmInit = new NpmInit()

bridgeTroll.say('So you want to start an unambitious project')

bridgeTroll.ask('What shall be the name?')
.then((name) => {
  npmInit.setName(name)
  return bridgeTroll.createDir(name, { cwd: true })
})
.then(() => bridgeTroll.ask('What shall be the description?'))
.then((description) => npmInit.setDescription(description))
.then(() => npmInit.write())
.then(() => bridgeTroll.affirm('Shall it be a Git Repository?'))
.then((affirmed) => {
  if (affirmed) {
    return bridgeTroll.spawn('git', ['init'])
  } else {
    return bridgeTroll.report('Skipping Git Creation')
  }
})
.then(() => bridgeTroll.stop())
.catch((e) => {
  console.log('Something bad happened')
  console.log(e)
  bridgeTroll.stop()
})
