const fs = require('fs');

function isFile(filePath) {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function getFileSize(filePath) {
    return fs.statSync(filePath).size;
}

function countLines(fileContent) {
    return fileContent.split('\n').length-1;
}

function countCharacters(fileContent) {
    return fileContent.length;
}

function countWords(fileContent) {
    const words = fileContent.split(/\s+/);
    return words.filter(word => word !== '').length;
}

function displayInfo(filePath, fileContent, args) {
    const result = [];
    const collator = new Intl.Collator();
    const localeOptions = collator.resolvedOptions();
    
    if (args.l>-1) {
        result.push(countLines(fileContent).toString());
    }
    if (args.w>-1) {
        result.push(countWords(fileContent).toString());
    }
    if (args.c>-1 && args.m>-1) {

        if (args.c>args.m){
            result.push(getFileSize(filePath).toString());
        }else{
            if (localeOptions.usage === 'sort' && localeOptions.sensitivity === 'variant') {
                result.push(countCharacters(fileContent).toString());
            } else {
                result.push(getFileSize(filePath).toString());
            }
        }
    } else if (args.c>-1) {
        result.push(getFileSize(filePath).toString());
    } else if (args.m>-1) {
        if (localeOptions.usage === 'sort' && localeOptions.sensitivity === 'variant') {
            result.push(countCharacters(fileContent).toString());
        } else {
            result.push(getFileSize(filePath).toString());
        }
    }
    const adjustedResult = result.map(element => String(element).padStart(8, ' '));
    console.log(adjustedResult.join('')+ `${filePath.padStart(filePath.length+1,' ')}`);

    return result;
}

function main() {
    const args = process.argv.slice(2);

    const options = {
        c: args[0].indexOf('c'),
        l: args[0].indexOf('l'),
        m: args[0].indexOf('m'),
        w: args[0].indexOf('w'),
    };

    const files = args.filter(arg => !arg.startsWith('-'));

    if (Object.values(options).every(value => value === -1) && files.length > 0) {
        options.c = true;
        options.l = true;
        options.w = true;
    }

    let totResult = [];

    for (const filePath of files) {
        if (!isFile(filePath)) {
            console.log(`The file ${filePath} does not exist.`);
        } else {
            try {
                const fileContent = fs.readFileSync(filePath, 'utf-8');

                const indivResult = displayInfo(filePath, fileContent, options);

                if (totResult.length === 0) {
                    totResult = indivResult;
                } else {
                    for (let i = 0; i < indivResult.length; i++) {
                        totResult[i] = (parseInt(totResult[i]) + parseInt(indivResult[i])).toString();
                    }
                }
            } catch (e) {
                console.log(`Error: ${e.message}`);
            }
        }
    }

    if (files.length > 1) {
        const adjustedTotResult = totResult.map(element => String(element).padStart(8, ' '));
        console.log(adjustedTotResult.join('')+ ` total`);
    }
}

main();

module.exports = main