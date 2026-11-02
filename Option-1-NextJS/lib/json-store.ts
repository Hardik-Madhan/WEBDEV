import { randomUUID } from "node:crypto"
import { mkdir, readFile, rename, writeFile } from "node:fs/promises"
import path from "node:path"

let writeQueue: Promise<void> = Promise.resolve()

/** Append a record to a local JSON array without losing simultaneous submissions. */
export function appendJsonRecord<T extends { id: string }>(fileName: string, record: T) {
  if (path.basename(fileName) !== fileName) throw new Error("Invalid data file name.")
  const dataDirectory = path.join(process.cwd(), "data")
  const filePath = path.join(dataDirectory, fileName)
  const operation = writeQueue.then(async () => {
    await mkdir(dataDirectory, { recursive: true })
    let records: T[] = []
    try {
      const stored = JSON.parse(await readFile(filePath, "utf8"))
      if (!Array.isArray(stored)) throw new Error(`${fileName} must contain a JSON array.`)
      records = stored as T[]
    } catch (error) {
      if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error
    }
    records.push(record)
    const temporaryPath = `${filePath}.${randomUUID()}.tmp`
    await writeFile(temporaryPath, `${JSON.stringify(records, null, 2)}\n`, { encoding: "utf8", flag: "wx" })
    await rename(temporaryPath, filePath)
  })
  writeQueue = operation.catch(() => undefined)
  return operation
}
