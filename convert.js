const { promisify } = require('util');
const fs = require('fs');
const convert = require('heic-convert');
const argv = require('yargs').argv;

const input = argv.input;
const output = argv.output || './output';

if (!input) {
    console.error('Error: --heic_folder parameter is required.');
    process.exit(1);
}

if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
}

fs.readdir(input, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        process.exit(1);
    }

    files.forEach(file => {
        (async () => {
            const inputBuffer = await promisify(fs.readFile)(input + '/' + file);

            const outputBuffer = await convert({
                buffer: inputBuffer,
                format: 'JPEG',
                quality: 1
            });
            const outputFileName = file.replace(/\.HEIC$/i, '');

            await promisify(fs.writeFile)(output + '/' + outputFileName + '.jpg', outputBuffer);
        })();
    });
});

//node convert.js --input ".\input" --output ".\output"

