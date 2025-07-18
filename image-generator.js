/**
 * Art Schools Image Generator
 * This script generates images representing different schools of art and painting using Pollinations.ai and saves them locally
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

// Image definitions with prompts for different art schools and movements
const imagesToGenerate = [
    // Renaissance Period
    {
        name: 'renaissance-madonna.jpg',
        prompt: 'Renaissance painting, Madonna and Child, Leonardo da Vinci style, oil on canvas, detailed, classical, religious art, professional, high quality'
    },
    {
        name: 'renaissance-portrait.jpg',
        prompt: 'Renaissance portrait, noble woman, Raphael style, detailed facial features, rich fabrics, classical composition, professional, high quality'
    },
    {
        name: 'renaissance-architecture.jpg',
        prompt: 'Renaissance architecture, grand cathedral, classical columns, perspective, detailed stonework, golden hour lighting, professional, high quality'
    },
    
    // Baroque Period
    {
        name: 'baroque-drama.jpg',
        prompt: 'Baroque painting, dramatic lighting, Caravaggio style, chiaroscuro, religious scene, intense emotions, dark background, professional, high quality'
    },
    {
        name: 'baroque-still-life.jpg',
        prompt: 'Baroque still life, Dutch masters style, fruits, flowers, ornate vase, detailed textures, rich colors, professional, high quality'
    },
    
    // Impressionism
    {
        name: 'impressionism-garden.jpg',
        prompt: 'Impressionist painting, Monet style, water lilies, garden scene, soft brushstrokes, natural light, pastel colors, professional, high quality'
    },
    {
        name: 'impressionism-city.jpg',
        prompt: 'Impressionist cityscape, Paris streets, Renoir style, people walking, atmospheric perspective, vibrant colors, professional, high quality'
    },
    
    // Post-Impressionism
    {
        name: 'post-impressionism-starry-night.jpg',
        prompt: 'Post-impressionist painting, Van Gogh style, starry night, swirling clouds, cypress tree, expressive brushstrokes, vibrant colors, professional, high quality'
    },
    {
        name: 'post-impressionism-tahiti.jpg',
        prompt: 'Post-impressionist painting, Gauguin style, Tahitian landscape, tropical colors, primitive art influence, flat perspective, professional, high quality'
    },
    
    // Expressionism
    {
        name: 'expressionism-scream.jpg',
        prompt: 'Expressionist painting, Edvard Munch style, emotional intensity, distorted forms, bold colors, psychological art, professional, high quality'
    },
    {
        name: 'expressionism-city-night.jpg',
        prompt: 'Expressionist cityscape, night scene, Kirchner style, angular forms, intense colors, urban anxiety, professional, high quality'
    },
    
    // Cubism
    {
        name: 'cubism-portrait.jpg',
        prompt: 'Cubist portrait, Picasso style, geometric forms, multiple perspectives, fragmented composition, analytical cubism, professional, high quality'
    },
    {
        name: 'cubism-still-life.jpg',
        prompt: 'Cubist still life, Braque style, musical instruments, geometric abstraction, multiple viewpoints, professional, high quality'
    },
    
    // Surrealism
    {
        name: 'surrealism-dream.jpg',
        prompt: 'Surrealist painting, Salvador Dali style, melting clocks, dreamlike landscape, impossible objects, detailed realism, professional, high quality'
    },
    {
        name: 'surrealism-metamorphosis.jpg',
        prompt: 'Surrealist painting, Magritte style, impossible transformations, floating objects, dream logic, precise detail, professional, high quality'
    },
    
    // Abstract Expressionism
    {
        name: 'abstract-expressionism-action.jpg',
        prompt: 'Abstract expressionist painting, Jackson Pollock style, action painting, drips and splatters, energetic composition, professional, high quality'
    },
    {
        name: 'abstract-expressionism-color-field.jpg',
        prompt: 'Abstract expressionist painting, Mark Rothko style, color field painting, large blocks of color, meditative, professional, high quality'
    },
    
    // Pop Art
    {
        name: 'pop-art-campbell.jpg',
        prompt: 'Pop art painting, Andy Warhol style, Campbell soup cans, bright colors, commercial art, repetition, professional, high quality'
    },
    {
        name: 'pop-art-comic.jpg',
        prompt: 'Pop art painting, Roy Lichtenstein style, comic book style, Ben-Day dots, bold colors, popular culture, professional, high quality'
    },
    
    // Minimalism
    {
        name: 'minimalism-geometric.jpg',
        prompt: 'Minimalist painting, geometric shapes, simple composition, limited color palette, clean lines, professional, high quality'
    },
    {
        name: 'minimalism-monochrome.jpg',
        prompt: 'Minimalist painting, single color field, subtle variations, contemplative, clean composition, professional, high quality'
    },
    
    // Contemporary Art
    {
        name: 'contemporary-installation.jpg',
        prompt: 'Contemporary art installation, mixed media, conceptual art, modern gallery space, innovative materials, professional, high quality'
    },
    {
        name: 'contemporary-digital.jpg',
        prompt: 'Contemporary digital art, mixed reality, technology and art, innovative techniques, modern aesthetics, professional, high quality'
    },
    
    // Classical Greek/Roman
    {
        name: 'classical-sculpture.jpg',
        prompt: 'Classical Greek sculpture, marble statue, idealized human form, ancient art, detailed craftsmanship, professional, high quality'
    },
    {
        name: 'classical-fresco.jpg',
        prompt: 'Classical Roman fresco, wall painting, mythological scene, ancient technique, rich colors, professional, high quality'
    },
    
    // Medieval Art
    {
        name: 'medieval-illumination.jpg',
        prompt: 'Medieval illuminated manuscript, detailed borders, gold leaf, religious text, intricate patterns, professional, high quality'
    },
    {
        name: 'medieval-tapestry.jpg',
        prompt: 'Medieval tapestry, woven textile art, historical scene, rich colors, detailed narrative, professional, high quality'
    },
    
    // Art Nouveau
    {
        name: 'art-nouveau-nature.jpg',
        prompt: 'Art Nouveau painting, Mucha style, flowing organic forms, nature motifs, decorative borders, elegant composition, professional, high quality'
    },
    {
        name: 'art-nouveau-woman.jpg',
        prompt: 'Art Nouveau portrait, elegant woman, flowing hair, decorative elements, stylized forms, professional, high quality'
    },
    
    // Fauvism
    {
        name: 'fauvism-landscape.jpg',
        prompt: 'Fauvist painting, Matisse style, wild colors, simplified forms, emotional expression, non-naturalistic colors, professional, high quality'
    },
    
    // Futurism
    {
        name: 'futurism-movement.jpg',
        prompt: 'Futurist painting, dynamic movement, speed lines, modern technology, fragmented forms, professional, high quality'
    },
    
    // Dada
    {
        name: 'dada-collage.jpg',
        prompt: 'Dada art, collage composition, found objects, anti-art aesthetic, random elements, professional, high quality'
    },
    
    // Constructivism
    {
        name: 'constructivism-geometric.jpg',
        prompt: 'Constructivist art, geometric abstraction, industrial materials, modern design, architectural forms, professional, high quality'
    },
    
    // De Stijl
    {
        name: 'de-stijl-composition.jpg',
        prompt: 'De Stijl painting, Mondrian style, primary colors, geometric grid, neoplasticism, professional, high quality'
    },
    
    // Bauhaus
    {
        name: 'bauhaus-design.jpg',
        prompt: 'Bauhaus design, functional art, geometric forms, modern aesthetic, industrial design, professional, high quality'
    },
    
    // Abstract Art
    {
        name: 'abstract-composition.jpg',
        prompt: 'Abstract painting, non-representational art, color theory, dynamic composition, emotional expression, professional, high quality'
    },
    
    // Realism
    {
        name: 'realism-portrait.jpg',
        prompt: 'Realist painting, detailed portrait, naturalistic style, accurate representation, Courbet influence, professional, high quality'
    },
    
    // Romanticism
    {
        name: 'romanticism-landscape.jpg',
        prompt: 'Romantic painting, dramatic landscape, Turner style, sublime nature, emotional atmosphere, professional, high quality'
    },
    
    // Pre-Raphaelite
    {
        name: 'pre-raphaelite-beauty.jpg',
        prompt: 'Pre-Raphaelite painting, beautiful woman, medieval revival, detailed nature, rich colors, Rossetti style, professional, high quality'
    },
    
    // Symbolism
    {
        name: 'symbolism-mystical.jpg',
        prompt: 'Symbolist painting, mystical scene, dreamlike atmosphere, symbolic meaning, rich colors, professional, high quality'
    },
    
    // Art Deco
    {
        name: 'art-deco-elegance.jpg',
        prompt: 'Art Deco painting, elegant design, geometric patterns, luxury aesthetic, 1920s style, professional, high quality'
    },
    
    // Social Realism
    {
        name: 'social-realism-worker.jpg',
        prompt: 'Social Realist painting, working class scene, political art, documentary style, social commentary, professional, high quality'
    },
    
    // Photorealism
    {
        name: 'photorealism-detail.jpg',
        prompt: 'Photorealist painting, hyper-detailed, photographic accuracy, Chuck Close style, precise technique, professional, high quality'
    },
    
    // Neo-Expressionism
    {
        name: 'neo-expressionism-raw.jpg',
        prompt: 'Neo-Expressionist painting, raw emotion, gestural brushwork, intense colors, personal expression, professional, high quality'
    },
    
    // Conceptual Art
    {
        name: 'conceptual-idea.jpg',
        prompt: 'Conceptual art, idea-based, minimal visual, intellectual approach, thought-provoking, professional, high quality'
    },
    
    // Digital Art
    {
        name: 'digital-art-future.jpg',
        prompt: 'Digital art, futuristic landscape, computer-generated, innovative techniques, modern technology, professional, high quality'
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
    console.log('Starting art school image generation...');
    console.log(`Generating ${imagesToGenerate.length} images representing different art movements...`);
    
    for (const image of imagesToGenerate) {
        const encodedPrompt = encodeURIComponent(image.prompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
        const imagePath = path.join(imagesDir, image.name);
        
        console.log(`Generating: ${image.name} (${image.prompt.split(',')[0]})`);
        
        try {
            await downloadImage(imageUrl, imagePath);
            // Add a small delay to avoid overwhelming the API
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Error generating ${image.name}:`, error);
        }
    }
    
    console.log('Art school image generation complete!');
    console.log('\n🎨 Generated images represent the following art movements:');
    console.log('• Renaissance • Baroque • Impressionism • Post-Impressionism');
    console.log('• Expressionism • Cubism • Surrealism • Abstract Expressionism');
    console.log('• Pop Art • Minimalism • Contemporary • Classical');
    console.log('• Medieval • Art Nouveau • Fauvism • Futurism');
    console.log('• Dada • Constructivism • De Stijl • Bauhaus');
    console.log('• Abstract • Realism • Romanticism • Pre-Raphaelite');
    console.log('• Symbolism • Art Deco • Social Realism • Photorealism');
    console.log('• Neo-Expressionism • Conceptual Art • Digital Art');
}

// Run the image generator
generateAllImages().catch(console.error);

// Instructions for use
console.log(`
=================================================
ART SCHOOLS IMAGE GENERATOR
=================================================

This script generates images representing different schools of art and painting
throughout history, from Classical to Contemporary periods.

INSTRUCTIONS:

1. Make sure you have Node.js installed
2. Run this script with: node image-generator.js
3. Images will be downloaded to the 'images' folder
4. Once downloaded, the website will use these local images

The collection includes:
- Classical Greek/Roman Art
- Medieval Illuminated Manuscripts
- Renaissance Masterpieces
- Baroque Drama
- Impressionist Landscapes
- Post-Impressionist Expression
- Expressionist Emotion
- Cubist Geometry
- Surrealist Dreams
- Abstract Expressionism
- Pop Art Culture
- Minimalist Simplicity
- Contemporary Innovation
- And many more art movements...

Note: You may need to install Node.js if you don't have it:
https://nodejs.org/
=================================================
`);