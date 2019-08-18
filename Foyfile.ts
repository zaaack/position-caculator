import { task, desc, option, fs } from 'foy'

task('deploy', async ctx => {
  await fs.rmrf('./docs')
  await fs.rename('./build', './docs')
})
