export const createWorker = (funcString: string) => {
    const blob = new Blob([funcString])
    const blobURL = URL.createObjectURL(blob)
    const worker = new Worker(blobURL)

    const killWorker = () => {
        worker.terminate()
        URL.revokeObjectURL(blobURL)
    }

    return [worker, killWorker] as const
}
