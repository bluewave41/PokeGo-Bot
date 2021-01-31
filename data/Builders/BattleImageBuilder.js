const sharp = require('sharp');
const TextToSVG = require('text-to-svg');
const textToSVG = TextToSVG.loadSync();

const attributes = { stroke: 'black'};
const options = { x: 0, y: 0, fontSize: 36, anchor: 'top', attributes: attributes };

/*const health = `<svg xmlns="http://www.w3.org/2000/svg">

    <defs>
      <linearGradient id="MyGradient" x2="100%" y2="0%">
        <stop offset="50%" stop-color="green" />
		<stop offset="50%" stop-color="black" />
      </linearGradient>
    </defs>

    <rect fill="url(#MyGradient)" stroke="black" stroke-width="1"  
          x="0" y="0" width="150" height="10"/>
</svg>`;*/

/*const charge = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200">
<linearGradient id="lg" x1="0.5" y1="1" x2="0.5" y2="0">
    <stop offset="0%" stop-opacity="1" stop-color="royalblue"/>
    <stop offset="40%" stop-opacity="1" stop-color="royalblue"/>
    <stop offset="40%" stop-opacity="0" stop-color="royalblue"/>
    <stop offset="100%" stop-opacity="0" stop-color="royalblue"/>
</linearGradient>
<circle cx="50" cy="50" r="45" fill="url(#lg)" stroke="crimson" stroke-width="5"/>
</svg>`;*/

module.exports = {
    async build(pokemon1, pokemon2) {
        const p1Name = textToSVG.getSVG(pokemon1.name, options);
        const p2Name = textToSVG.getSVG(pokemon2.name, options);
        const p1Metrics = textToSVG.getMetrics(pokemon1.name, options);
        const p2Metrics = textToSVG.getMetrics(pokemon2.name, options);
        const background = sharp('images/battle/background.png');
        const shield = await sharp('images/battle/shield.png')
            .resize({ width: 35, height: p1Metrics.height })
            .toBuffer();
        
        const leftPokemon = await sharp(pokemon1.path)
            .flop()
            .toBuffer();

        const rightPokemon = await sharp(pokemon2.path)
            .toBuffer();

        const metadata = await background.metadata();
        const leftMargin = metadata.width-p2Metrics.width;

        const finishedImage = background.composite([
            { input: leftPokemon, top: 300, left: 100 },
            { input: rightPokemon, top: 300, left: leftMargin },
            { input: Buffer.from(p1Name), top: 0, left: 0 },
            { input: Buffer.from(p2Name), top: 0, left: leftMargin },
            { input: shield, top: 0, left: p1Metrics.width+10 },
            { input: shield, top: 0, left: p1Metrics.width+55 },
            { input: shield, top: 0, left: leftMargin-35-10 },
            { input: shield, top: 0, left: leftMargin-35-55 }])
            //{ input: Buffer.from(health), top: p2Metrics.height+10, left: 5 },
            //{ input: Buffer.from(health), top: p2Metrics.height+10, left: leftMargin }])
            .toBuffer();
        
        return finishedImage;
    }
}