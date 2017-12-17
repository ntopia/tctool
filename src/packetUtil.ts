
let buf = Buffer.allocUnsafe(0)
let pos = 0

export const initBuffer = (inpbuf: Buffer) => {
  buf = inpbuf
  pos = 0
}


const readBool = () => {
  const ret = (buf[0] == 0) ? false : true
  buf = buf.slice(1)
  pos += 1
  return ret
}

const readByte = () => {
  const ret = buf[0]
  buf = buf.slice(1)
  pos += 1
  return ret
}

const readInt16 = () => {
  const ret = buf.readInt16BE(0)
  buf = buf.slice(2)
  pos += 2
  return ret
}

const readInt32 = () => {
  const ret = buf.readInt32BE(0)
  buf = buf.slice(4)
  pos += 4
  return ret
}

const readString = () => {
  const byteLen = readInt32()
  const ret = buf.slice(0, byteLen).toString('utf8')
  buf = buf.slice(byteLen)
  pos += byteLen
  return ret
}

const readJavaChar = () => {
  return readInt16()
}

export const deserialize = () => {
  const objectType = readByte()

  switch (objectType) {
    case 1:
      return null
    case 2:
      return readString()
    case 3:
      return readBool()
    case 4:
      return readInt32()
    case 13:
      // long
    case 6:
      // double
    case 7:
      return readByte()
    case 11:
      return readJavaChar()
    case 9: // object array
    case 33:
    case 35:
    case 37: { // arraylist of object
      const ret = []
      const arrayLen = readInt32()
      for (let i = 0; i < arrayLen; ++i) {
        const obj = deserialize()
        ret.push(obj)
      }
      return ret
    }
    case 14: // object array of array
    case 8: { // byte array
      const arrayLen = readInt32()
      const ret = buf.slice(0, arrayLen)
      buf = buf.slice(arrayLen)
      pos += arrayLen
      return ret
    }
    case 5: { // java char array
      const ret = []
      const arrayLen = readInt32()
      for (let i = 0; i < arrayLen; ++i) {
        const obj = readJavaChar()
        ret.push(obj)
      }
      return ret
    }
    case 10: { // int array
      const ret = []
      const arrayLen = readInt32()
      for (let i = 0; i < arrayLen; ++i) {
        const obj = readInt32()
        ret.push(obj)
      }
      return ret
    }
    case 19: // long array
    case 16: // double array
    case 18: // double array of array
    case 12: { // string array
      const ret = []
      const arrayLen = readInt32()
      for (let i = 0; i < arrayLen; ++i) {
        const obj = readString()
        ret.push(obj)
      }
      return ret
    }
    case 17: // class name
      return readString()
    case 34:
    case 36: { // hash map
      const ret: any = {}
      const fieldCnt = readInt32()
      for (let i = 0; i < fieldCnt; ++i) {
        const obj1 = deserialize()
        const obj2 = deserialize()
        ret[obj1.toString()] = obj2
      }
      return ret
    }
    case 64: {
    }
    case 65: {
      const className = readString()
      return null
    }
  }

  return undefined
}


const writeBool = (data: boolean) => {
  buf[0] = (data ? 1 : 0)
  buf = buf.slice(1)
  pos += 1
}

const writeByte = (data: number) => {
  buf.writeInt8(data, 0)
  buf = buf.slice(1)
  pos += 1
}

const writeInt16 = (data: number) => {
  buf.writeInt16BE(data, 0)
  buf = buf.slice(2)
  pos += 2
}

const writeInt32 = (data: number) => {
  buf.writeInt32BE(data, 0)
  buf = buf.slice(4)
  pos += 4
}
