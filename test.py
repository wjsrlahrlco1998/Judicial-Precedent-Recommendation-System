import sys
import json

if __name__ == '__main__':
    input_data = sys.argv[1]
    input_json = json.loads(input_data)
    print(input_json)
