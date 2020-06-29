export class Song {
    DEFAULT_VOLUME: number = 0.01
    totalVolume: number = 0
    audio: HTMLAudioElement
    constructor(el: HTMLAudioElement) {
        this.audio = el
    }
    songFadeInPlay() {
        if (!this.audio.src) return
        return new Promise((resolve) => {
            const frame = () => {
                this.totalVolume += this.DEFAULT_VOLUME
                if (this.totalVolume > 1) {
                    this.totalVolume = 1
                    this.audio.volume = this.totalVolume
                    resolve(true)
                }
                this.audio.volume = this.totalVolume
                if (this.totalVolume < 1) {
                    window.requestAnimationFrame(frame)
                }
            }
            this.audio.volume = 0
            window.requestAnimationFrame(frame)
        })
    }
    songFadeOutPause() {
        if (!this.audio.src) return
        return new Promise((resolve) => {
            const frame = () => {
                this.totalVolume -= this.DEFAULT_VOLUME
                if (this.totalVolume < 0) {
                    this.totalVolume = 0
                    this.audio.volume = this.totalVolume
                    resolve(true)
                }
                this.audio.volume = this.totalVolume
                if (this.totalVolume > 0) {
                    window.requestAnimationFrame(frame)
                }
            }
            this.totalVolume = 1
            window.requestAnimationFrame(frame)
        })
    }
}
