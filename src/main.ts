import { cfg } from './config'
import * as net from 'net'
import * as crypto from 'crypto'
import * as stream from 'stream'


const client = net.createConnection({ host: cfg.host, port: cfg.port }, () => {
  console.log('connected!')
  client.end()
})

client.on('end', () => {
  console.log('connection end')
})

client.on('close', (hadError) => {
  console.log('close')
  console.log(hadError)
})


let segbuf = Buffer.allocUnsafe(0)
const segmentize = new stream.Transform({
  transform(chunk: Buffer, encoding: string, callback) {
    console.log(`chunk in... ${chunk.length} bytes`)

    segbuf = Buffer.concat([segbuf, chunk])
    while (segbuf.length >= 4) {
      const len = segbuf.readInt32BE(0)
      if (len <= segbuf.length - 4) {
        const packet = segbuf.slice(4, len + 4)
        segbuf = segbuf.slice(len + 4)
        this.push(packet)
      }
      else {
        break
      }
    }
    callback()
  }
})

segmentize.on('data', (data) => {
  console.log('data in...')
})

client.pipe(segmentize)


