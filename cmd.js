#!/usr/bin/env node
const program = require('commander')
const lib = require('./lib')
const { dSeed, dAddress, dDepth, dMinWeightMagnitude, dProvider } = require('./defaults')

program
  .command('hash <file>')
  .option('-b, --binary', 'Binary input rather than Path')
  .action(function (file, options) {
    const hashVal = lib.hash(file, options.binary)
    console.log(file, 'hash = ',hashVal)
  })

  program
    .command('publish <data>')
    .option('-p, --provider [provider]', `Provider, defaults: ${dProvider}`)
    .option('-s, --seed [seed]', `Seed, defaults: ${dSeed}`)
    .option('-a, --address [address]', `Provider, defaults: ${dAddress}`)
    .option('-m, --magnitude [magnitude]', `MinWeightMagnitude, defaults: ${dMinWeightMagnitude}`)
    .option('-d, --depth [depth]', `Depth, defaults: ${dDepth}`)
    .action((data, options) => {
      const provider = options.provider ? options.provider : dProvider
      const seed = options.seed ? options.seed : dSeed
      const address = options.address ? options.address : dAddress
      const depth = options.depth ? options.depth : dDepth
      const minWeightMagnitude = options.magnitude ? options.magnitude : dMinWeightMagnitude

      lib.publish({ provider,
                    data,
                    seed,
                    address,
                    minWeightMagnitude,
                    depth
                  }, function(res) {
          console.log(`https://thetangle.org/transaction/${res[0].hash}`)
      })

    })


program
  .command('fetch <hash>')
  .option('-a, --address <address>', 'Address of the channel')
  .option('-c, --convert', 'Convert to String after fetching')
  .option('-p, --provider [provider]', `Provider, defaults: ${dProvider}`)
  .option('-s, --seed [seed]', `Seed, defaults: ${dSeed}`)
  .option('-m, --magnitude [magnitude]', `MinWeightMagnitude, defaults: ${dMinWeightMagnitude}`)
  .option('-d, --depth [depth]', `Depth, defaults: ${dDepth}`)
  .action(async (hash, options) => {
    const address = options.address ? options.address : dAddress
    const provider = options.provider ? options.provider : dProvider
    const seed = options.seed ? options.seed : dSeed
    const depth = options.depth ? options.depth : dDepth
    const minWeightMagnitude = options.magnitude ? options.magnitude : dMinWeightMagnitude
      try {
        const message = await lib.fetch({ provider,
            seed,
            address,
            hash,
            minWeightMagnitude,
            depth
          })
        console.log('tx value =', message)
        return message
      } catch(e) {
        console.log(e)
      }
  })

program
  .command('verify <docpath>')
  .option('-b, --binary', 'Binary input rather than Path')
  .option('-a, --address <address>', 'Address of the channel')
  .option('-h, --hash <hash>', 'Transaction Hash of the channel')
  .option('-p, --provider [provider]', `Provider, defaults: ${dProvider}`)
  .option('-s, --seed [seed]', `Seed, defaults: ${dSeed}`)
  .option('-m, --magnitude [magnitude]', `MinWeightMagnitude, defaults: ${dMinWeightMagnitude}`)
  .option('-d, --depth [depth]', `Depth, defaults: ${dDepth}`)
  .action(function (docpath, options) {
    console.log(docpath, options.address, options.binary)
    const provider = options.provider ? options.provider : dProvider
    const seed = options.seed ? options.seed : dSeed
    const depth = options.depth ? options.depth : dDepth
    const address = options.address ? options.address : dAddress
    const minWeightMagnitude = options.magnitude ? options.magnitude : dMinWeightMagnitude
    lib.verify({
      provider,
      seed,
      depth,
      address,
      hash: options.hash,
      minWeightMagnitude
    }, options.binary, docpath, (verified) => console.log(verified))
  })


program.parse(process.argv)