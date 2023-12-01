const fs = require('fs');

function isFile(filePath) {
        return fs.existsSync(filePath) && fs.statSync(filePath).isFile() && filePath.split('.').pop() == 'json';
}

function getContents(filePath) {
        return fs.readFileSync(filePath, 'utf-8');
}

function main() {
        if (process.argv.length < 3) {
                throw new Error("File Needed");
        }

        const filePath = process.argv[2];

        if (!isFile(filePath)) {
                throw new Error("Not a JSON File");
        }

        const fileContents = getContents(filePath);

        if (fileContents.length === 0) {
                throw new Error("Empty File");
        }

        if (!(fileContents.startsWith("{") && fileContents.endsWith("}"))) {
                throw new Error("Improper JSON formatting");
        }

        try {
                parseJSON(fileContents.slice(1, -1));
                console.log("Valid JSON");
        } catch (error) {
                console.error("Invalid JSON:", error.message);
        }
}

function parseJSON(jsonString) {
        const keyValuePairs = jsonString.split(",");

        for (const item of keyValuePairs) {
                if (!checkIfValidKeyValuePair(item.trim())) {
                        throw new Error("Invalid key-value pair");
                }
        }
}

function checkIfValidKeyValuePair(pair) {
        let [key, value] = [undefined, undefined];

        if (pair.includes(":")) {
                key = pair.slice(0, pair.indexOf(":")).trim();
                value = pair.slice(pair.indexOf(":") + 1).trim();
        }

        if (key == undefined || value == undefined || value.length == 0) {
                throw new Error("Invalid key-value pair");
        }

        if (!isValidKey(key)) {
                throw new Error("Invalid key");
        }

        if (value.startsWith("{") && value.endsWith("}")) {
                parseJSON(value.slice(1, -1));
        }

        return true;
}

function isValidKey(key) {
        return key !== undefined && key.length > 0 && key.startsWith("\"") && key.endsWith("\"");
}

main();

module.exports = main;