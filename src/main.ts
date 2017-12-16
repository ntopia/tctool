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
