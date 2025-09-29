const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')

const root = process.cwd()
const pub = path.join(root, 'public')

async function run() {
  await fse.ensureDir(pub)
  for (const dir of ['images', 'logo']) {
    const src = path.join(root, dir)
    if (fs.existsSync(src)) {
      await fse.copy(src, path.join(pub, dir))
    }
  }
  for (const f of ['favicon.svg']) {
    const src = path.join(root, f)
    if (fs.existsSync(src)) await fse.copy(src, path.join(pub, f))
  }
}
run().catch((e) => { console.error(e); process.exit(1) })
