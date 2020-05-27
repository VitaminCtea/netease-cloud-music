export const workerCode = `
     onmessage = function (e) {
        const [ data, height, width ] = e.data
        let r = 0, g = 0, b = 0

        for (let row = 0; row < height; row++) {
           for (let col = 0; col < width; col++) {
              r += data[(row * width + col) * 4]
              g += data[(row * width + col) * 4 + 1]
               b += data[(row * width + col) * 4 + 2]
           }
        }

        r /= width * height
        g /= width * height
        b /= width * height

        r = Math.round(r)
        g = Math.round(g)
        b = Math.round(b)
        postMessage([ r, g, b ])
     }
`
