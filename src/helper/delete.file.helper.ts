import { promises as fs } from 'fs'
import path from 'path'
import loggerConfig from '../config/logger.config'

export const removeFileIfExists = async (
  filePath: string,
  retry = 3,
  delay = 500
): Promise<void> => {
  if (!filePath) return

  const fullPath = path.resolve('public', filePath)

  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      await fs.access(fullPath) // Cek file ada
      await fs.unlink(fullPath) // Hapus file
      loggerConfig.info('Delete file', 'File berhasil dihapus', 'File')
      return
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        // File tidak ada, selesai
        return
      } else if (err.code === 'EBUSY' && attempt < retry) {
        loggerConfig.warn(
          'Delete file',
          `File sedang digunakan, coba lagi dalam ${delay}ms (${retry - attempt} retry tersisa)`,
          'File'
        )
        await new Promise(res => setTimeout(res, delay))
      } else {
        loggerConfig.error('Delete file', `Gagal menghapus file: ${err.message}`, 'File')
        return
      }
    }
  }
}
