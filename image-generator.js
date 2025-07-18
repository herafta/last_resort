/**
 * Celtic Image Generator
 * This script generates Celtic-themed images using Pollinations.ai and saves them locally
 * 
 * To use:
 * 1. Run this script with Node.js
 * 2. Images will be downloaded to the 'images' folder
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { promisify } = require('util');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
    console.log('Created images directory');
}

// Image definitions with prompts
const imagesToGenerate = [
    {
        name: 'imbolc-symbol.jpg',
        prompt: 'Celtic Imbolc symbol, spring, rebirth, Brigid cross, candles, mystical, ancient, detailed, gold on dark purple background, professional, high quality'
    },
    {
        name: 'beltane-symbol.jpg',
        prompt: 'Celtic Beltane symbol, fire, maypole, fertility, mystical, ancient, detailed, gold on dark purple background, professional, high quality'
    },
    {
        name: 'lughnasadh-symbol.jpg',
        prompt: 'Celtic Lughnasadh symbol, harvest, wheat, abundance, mystical, ancient, detailed, gold on dark purple background, professional, high quality'
    },
    {
        name: 'samhain-symbol.jpg',
        prompt: 'Celtic Samhain symbol, death, rebirth, spirits, mystical, ancient, detailed, gold on dark purple background, professional, high quality'
    },
    {
        name: 'celtic-knot.jpg',
        prompt: 'Celtic knot pattern, intricate, eternal, mystical, ancient, detailed, gold on dark purple background, professional, high quality'
    },
    {
        name: 'stars.jpg',
        prompt: 'Night sky, stars, mystical, dark purple background with small bright stars, cosmic, professional, high quality'
    },
    {
        name: 'celtic-tile1.jpg',
        prompt: 'Celtic standing stones, ancient, mystical, moonlight, professional, high quality'
    },
    {
        name: 'celtic-tile2.jpg',
        prompt: 'Celtic tree of life, ancient, mystical, detailed, professional, high quality'
    },
    {
        name: 'celtic-tile3.jpg',
        prompt: 'Celtic spiral pattern, ancient, mystical, carved stone, professional, high quality'
    },
    {
        name: 'celtic-tile4.jpg',
        prompt: 'Celtic forest ritual, druids, ancient, mystical, professional, high quality'
    },
    {
        name: 'celtic-tile5.jpg',
        prompt: 'Celtic cauldron, ancient, mystical, magical, professional, high quality'
    },
    {
        name: 'celtic-tile6.jpg',
        prompt: 'Celtic sacred well, ancient, mystical, water, stones, professional, high quality'
    }
];

/**
 * Downloads an image from a URL and saves it to the specified path
 */
async function downloadImage(url, imagePath) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download image: ${response.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(imagePath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Downloaded: ${imagePath}`);
                resolve();
            });

            fileStream.on('error', (err) => {
                fs.unlink(imagePath, () => {}); // Delete the file if there's an error
                reject(err);
            });
        }).on('error', reject);
    });
}

/**
 * Generate and download all images
 */
async function generateAllImages() {
    console.log('Starting image generation...');
    
    for (const image of imagesToGenerate) {
        const encodedPrompt = encodeURIComponent(image.prompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
        const imagePath = path.join(imagesDir, image.name);
        
        console.log(`Generating: ${image.name}`);
        
        try {
            await downloadImage(imageUrl, imagePath);
            // Add a small delay to avoid overwhelming the API
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Error generating ${image.name}:`, error);
        }
    }
    
    console.log('Image generation complete!');
}

// Run the image generator
generateAllImages().catch(console.error);

// Instructions for use
console.log(`
=================================================
INSTRUCTIONS:

1. Make sure you have Node.js installed
2. Run this script with: node image-generator.js
3. Images will be downloaded to the 'images' folder
4. Once downloaded, the website will use these local images

Note: You may need to install Node.js if you don't have it:
https://nodejs.org/
=================================================
`);