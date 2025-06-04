import assert from 'assert'
import { createRequire } from 'module'
import path from 'path'

const requireTS = createRequire(import.meta.url)
requireTS('ts-node/register/transpile-only')

function load(env) {
  const modulePath = path.resolve('lib/config/upload.ts')
  delete requireTS.cache[modulePath]
  if (env === undefined) delete process.env.NEXT_PUBLIC_UPLOAD_MAX_SIZE
  else process.env.NEXT_PUBLIC_UPLOAD_MAX_SIZE = env
  return requireTS(modulePath)
}

assert.equal(load(undefined).MAX_UPLOAD_SIZE_BYTES, 1048576)
assert.equal(load('bad').MAX_UPLOAD_SIZE_BYTES, 1048576)
console.log('tests passed')
