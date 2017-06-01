let fs = require('fs')
let path = require('path')

// I don't like where this is going
class NpmInit {
  setName (name) {
    this.name = name
  }

  setDescription (description) {
    this.description = description
  }

  write () {
    return new Promise((resolve, reject) => {
      fs.writeFile(path.resolve(`${this.name}/package.json`), JSON.stringify(this.config, null, 2), (err) => {
        if (err) {
          reject(err)
        }

        resolve()
      })
    })
  }

  get config () {
    return {
      name: this.name,
      version: this.description,
      description: '',
      main: 'index.js',
      scripts: {
        test: 'eslint index.js'
      },
      // TODO:
      author: 'Lucas Dohmen <lucas@dohmen.io> (https://lucas.dohmen.io)',
      // TODO
      license: 'Apache-2.0'
    }
  }
}

module.exports = NpmInit
