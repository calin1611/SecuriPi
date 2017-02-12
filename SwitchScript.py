from gpiozero import Button
import requests
import threading

button = Button(21)

madeCall = False
def checkDoor():
    global madeCall
    threading.Timer(1.0, checkDoor).start()
    if button.is_pressed:
        madeCall = False;    
    else:
        if madeCall == True:
            print("Door OPEN +++++++++++++++++++++++++")
        else:
            print('made the call>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            r = requests.get('http://localhost:8080/door-opened')
            madeCall = True
checkDoor()
