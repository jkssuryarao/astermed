import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const logoPath = path.join(root, 'public/images/astermed-logo.png')

const sizes = [16, 72, 96, 128, 144, 152, 180, 192, 384, 512]

await mkdir(path.join(root, 'public/icons'), { recursive: true })

for (const size of sizes) {
  let outPath
  if (size === 16) {
    outPath = path.join(root, 'public/favicon-16x16.png')
  } else if (size === 180) {
    outPath = path.join(root, 'public/apple-touch-icon.png')
  } else {
    outPath = path.join(root, 'public/icons', `icon-${size}x${size}.png`)
  }

  await sharp(logoPath)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(outPath)

  console.log(`Generated ${outPath}`)
}

await sharp(logoPath)
  .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .toFile(path.join(root, 'public/favicon.ico'))

console.log('Generated favicon.ico')

const ogWidth = 1200
const ogHeight = 630
const logoSize = 280

const logoBuffer = await sharp(logoPath)
  .resize(logoSize, logoSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
  .png()
  .toBuffer()

await sharp({
  create: {
    width: ogWidth,
    height: ogHeight,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  },
})
  .composite([{ input: logoBuffer, gravity: 'centre' }])
  .png()
  .toFile(path.join(root, 'public/images/og-image.png'))

console.log('Generated og-image.png')
