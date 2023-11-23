import argparse
import os
import locale
import sys


def is_file(file_path):
    return os.path.isfile(file_path)


def get_file_size(file_path):
    return os.path.getsize(file_path)


def count_lines(file_content):
    return len(file_content.split('\n'))-1


def count_characters(file_content):
    return len(file_content)


def count_words(file_content):
    file_data = file_content.split('\n')
    words = [word for line in file_data for word in line.split()]
    return len(words)


def display_info(file_path, file_content, args):
    result = []
    filesystem_encoding = sys.getfilesystemencoding()
    if args.l:
        result.append(str(count_lines(file_content)))
    if args.w:
        result.append(str(count_words(file_content)))
    if args.c and args.m:
        if 'utf' in filesystem_encoding.lower():
            result.append(str(count_characters(file_content)))
        else:
            result.append(str(get_file_size(file_path)))
    elif args.c:
        result.append(str(get_file_size(file_path)))
    elif args.m:
        if 'utf' in filesystem_encoding.lower():
            result.append(str(count_characters(file_content)))
        else:
            result.append(str(get_file_size(file_path)))

    formatted_result = [str(element).rjust(8) for element in result]
    print(''.join(formatted_result)+" "+file_path)

    return result


def ccwc():
    parser = argparse.ArgumentParser(
        description='Count lines, words, and bytes in a file.')

    parser.add_argument('-c', action='store_true',
                        help='Count the number of bytes in the file.')
    parser.add_argument('-l', action='store_true',
                        help='Count the number of lines in the file.')
    parser.add_argument('-m', action='store_true',
                        help='Count the number of characters in the file.')
    parser.add_argument('-w', action='store_true',
                        help='Count the number of words in the file.')

    parser.add_argument('files', nargs='+', type=str,
                        help='Path to the input file(s).')

    args = parser.parse_args()

    if not any(vars(args)[flag] for flag in ('c', 'l', 'm', 'w')) and args.files:
        # Set default behavior or handle accordingly
        args.c = True
        args.l = True
        args.w = True

    tot_result = []

    for file_path in args.files:
        if not is_file(file_path):
            print(f'The file {file_path} does not exist.')
        else:
            try:
                with open(file_path, 'r') as file:
                    file_content = file.read()

                indiv_result = display_info(file_path, file_content, args)

                if len(tot_result) == 0:
                    tot_result = indiv_result
                else:
                    for i in range(0, len(indiv_result)):
                        tot_result[i] = str(
                            int(tot_result[i]) + int(indiv_result[i]))

            except Exception as e:
                print(f"Error: {e}")
    if (len(args.files) > 1):
        formatted_result = [str(element).rjust(8) for element in tot_result]
        print(''.join(formatted_result)+' total')


if __name__ == "__main__":
    ccwc()
