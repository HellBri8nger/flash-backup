import win32api
import subprocess
import sys
import requests
import threading


def main():
    process = subprocess.Popen(f"{sys.argv[2]}", shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()

    if process.returncode != 0:
        win32api.MessageBox(0, stderr.decode().strip(), 'Flash-Backup Error Launching Game', 0x00000000)


def sendRequest():
    x = requests.post("http://localhost:14004", {"id": sys.argv[1]})
    print(x.content)


if __name__ == '__main__':
    backup_thread = threading.Thread(target=sendRequest)
    main_thread = threading.Thread(target=main)

    backup_thread.run()
    main_thread.run()
