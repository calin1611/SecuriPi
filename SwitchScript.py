from gpiozero import Button
import requests

button = Button(21)
makeCall = False
while True:
    if button.is_pressed:
        makeCall = False;
        print('door closed')
    else:
        if makeCall == True:
            print("Door OPEN +++++++++++++++++++++++++")
        else:
            print('make the call>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            r = requests.get('http://localhost:8080/page1')
            makeCall = True
