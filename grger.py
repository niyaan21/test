import pyautogui
import time
print("the file is running ")
while True:
    time.sleep(2)
    pyautogui.typewrite("make the website better")
    pyautogui.press("enter")
    print("the command has been entered")
    time.sleep(250)
    pyautogui.keyDown("ctrl")
    pyautogui.keyDown("enter")
    pyautogui.keyUp("enter")
    pyautogui.keyUp("ctrl")
    print("the task is completred")