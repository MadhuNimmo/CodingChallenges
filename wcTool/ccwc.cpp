#include <iostream>
#include <fstream>
#include <sys/stat.h>
#include <unistd.h>
#include <sstream>
#include <filesystem>
#include <map>


enum Options {
    COUNT_LINES,
    COUNT_CHARACTERS,
    COUNT_BYTES,
    COUNT_WORDS
};

bool isFile(std::string filePath) {
    struct stat fileStat;
    if (stat(filePath.c_str(), &fileStat) != 0) {
        // Error accessing file information
        return false;
    }

    return S_ISREG(fileStat.st_mode);
}

int getFileSize(std::string filePath) {
    struct stat stat_buf;
    int rc = stat(filePath.c_str(), &stat_buf);
    return rc == 0 ? stat_buf.st_size : -1;
}

int countLines(std::string fileContent) {
    int cnt=0;
    std::istringstream iss(fileContent);
    std::string line;
    while (std::getline(iss, line)) {
        cnt++;
    }
    return cnt-1;
}

int countCharacters(std::string fileContent) {
    return fileContent.length();
}

int countWords(std::string fileContent) {

    // Create a stringstream to tokenize the string
    std::istringstream iss(fileContent);
    // Vector to store individual words
    std::vector<std::string> words;

    // Tokenize the string and store words in the vector
    std::string word;
    while (iss >> word) {
        words.push_back(word);
    }

    // Remove empty strings from the vector
    words.erase(std::remove(words.begin(), words.end(), ""), words.end());


    // Return the length of the vector
    return static_cast<int>(words.size());
}

std::vector<std::string> displayInfo(std::string filePath, std::string fileContent,std::map<Options, int> args) {
    std::vector<std::string> result;
    
    if (args[COUNT_LINES] > -1) {
        result.push_back(std::to_string(countLines(fileContent)));
    }
    if (args[COUNT_WORDS] > -1) {
        result.push_back(std::to_string(countWords(fileContent)));
    }
     if (args[COUNT_BYTES] > -1 && args[COUNT_CHARACTERS] > -1) {
        if (args[COUNT_BYTES] > args[COUNT_CHARACTERS]) {
            result.push_back(std::to_string(getFileSize(filePath)));
        } else {
            // Assuming localeOptions is equivalent to localeOptions in JavaScript
            // This part may need modification based on your actual logic
            // Replace with your actual implementation
            if (true /* condition based on localeOptions */) {
                result.push_back(std::to_string(countCharacters(fileContent)));
            } else {
                result.push_back(std::to_string(getFileSize(filePath)));
            }
        }
    } else if (args[COUNT_BYTES] > -1) {
        result.push_back(std::to_string(getFileSize(filePath)));
    } else if (args[COUNT_CHARACTERS] > -1) {
        // Assuming localeOptions is equivalent to localeOptions in JavaScript
        // This part may need modification based on your actual logic
        // Replace with your actual implementation
        if (true /* condition based on localeOptions */) {
            result.push_back(std::to_string(countCharacters(fileContent)));
        } else {
            result.push_back(std::to_string(getFileSize(filePath)));
        }
    }

    // Adjusted result with padding
    for (auto& element : result) {
        element = std::string(8 - element.length(), ' ') + element;
    }

    // Concatenate results and print
    std::string adjustedResult = "";
    for (const auto& element : result) {
        adjustedResult += element;
    }

    std::cout << adjustedResult << " " << std::setw(filePath.length() + 1) << filePath << std::endl;
    return result;
}

void printUsage() {
    std::cerr << "Usage: ccwc [-l] [-c] [-m] [-w] file1 file2 ... fileN\n";
}

std::string readFile(const std::string& filePath) {
    std::ifstream file(filePath);

    if (!file.is_open()) {
        std::cerr << "Error opening file: " << filePath << std::endl;
        return ""; // Return an empty string to indicate an error
    }

    std::ostringstream fileContentStream;
    fileContentStream << file.rdbuf();

    return fileContentStream.str();
}

int main(int argc, char* argv[]) {

   if (argc < 3) {
        // At least three arguments are required: program name, flag(s), and one file
        printUsage();
        return 1; // Return an error code
    }

    std::map<Options, int> flagOptions;
        // Process flags
    flagOptions[COUNT_LINES] = -1;
    flagOptions[COUNT_CHARACTERS] = -1;
    flagOptions[COUNT_BYTES] = -1;
    flagOptions[COUNT_WORDS] = -1;

        std::string arg(argv[1]);
        if (arg[0] == '-') {
                for (size_t j = 1; j < arg.size(); ++j) {
                        switch (arg[j]) {
                        case 'l':
                                flagOptions[COUNT_LINES] = j;
                                break;
                        case 'c':
                                flagOptions[COUNT_BYTES] = j;
                                break;
                        case 'm':
                                flagOptions[COUNT_CHARACTERS] = j;
                                break;
                        case 'w':
                                flagOptions[COUNT_WORDS] = j;
                                break;
                        default:
                                std::cerr << "Unknown option: " << arg[j] << '\n';
                                printUsage();
                                return 1; // Return an error code
                        }
                }
        }else{
                flagOptions[COUNT_LINES] = 0;
                flagOptions[COUNT_CHARACTERS] = 0;
                flagOptions[COUNT_BYTES] = 0;
        }

    std::vector<std::string> totResult;

    for (int i = 2; i < argc; i++) {
        std::string filePath(argv[i]);
        if (!isFile(filePath)) {
            std::cout << "The file " << filePath << " does not exist." << std::endl;
        } else {
              try {
                std::string fileContent = readFile(filePath);

                const std::vector<std::string> indivResult = displayInfo(filePath, fileContent, flagOptions);

                if (totResult.empty()) {
                    totResult = indivResult;
                } else {
                    for (size_t i = 0; i < indivResult.size(); ++i) {
                        totResult[i] = std::to_string(std::stoi(totResult[i]) + std::stoi(indivResult[i]));
                    }
                }
            } catch (const std::exception& e) {
                std::cout << "Error: " << e.what() << std::endl;
            }
        }
    }

    if ( (argc-2) > 1) {
                // Adjusted result with padding
        for (auto& element : totResult) {
                element = std::string(8 - element.length(), ' ') + element;
        }

        // Concatenate results and print
        std::string adjustedResult = "";
        for (const auto& element : totResult) {
                adjustedResult += element;
        }

       std::cout << adjustedResult << " " << std::setw(std::strlen("total") + 1) << "total" << std::endl;

    }
return 0;
}