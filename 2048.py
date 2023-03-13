import os
import random
from rich.console import Console
from pynput import keyboard

x = [ [" ", " ", " ", " "], [" ",2," ", " "], [" ", " ", " ", " "],[" ", " ", " ", " "] ]

def clear():
    if (os.name == "posix"):
        os.system("clear")
    else:
        os.system("cls")

def game_board():
    print(' -------------------------------')
    for i in range(4):
        for j in range(5):
            if (j < 4):
                l = len(str(x[i][j]))
            print('|',end="")
            if (l == 1 or l == 2):
                spaces = 3
            if (l == 3 or l == 4):
                spaces = 2
            print(" " * spaces,end="")
            if (l == 2 or l == 4):
                spaces -= 1
            print(f'[bold cyan]{x[i][j] if j < 4 else ""}[/]',end="")
            print(" " * spaces,end="")
        print()
        print('--------------------------------')

clear()
score = 0
c = Console()
print = c.print
clear()

print("""[bold red]   
 ___ ___ ___ ___ 
|_  |   | | | . |
|  _| | |_  | . |
|___|___| |_|___|

[/]""")
print(" [bold white]Use A,B,C,D to move the tiles [/]\n")
print(" [bold green]Press Enter to start[/]\n")

with keyboard.Events() as events:
    events.get()

clear()
game_board()

def is_win():
    for i in range(4):
        for j in range(4):
            if (x[i][j] == 2048):
                return True
            
def get_max():
    max = x[0][0]
    for i in range(4):
        for j in range(4):
            if(x[i][j] > max):
                max = x[i][j]
    print(max)

def empty():
    for i in range(4):
        for j in range(4):
            if (x[i][j] == " "):
                return True

def random_num():
    if (empty()):
        num = 0
        ans = False
        index1 = random.randint(0,3)
        index2 = random.randint(0,3)
        for i in range(4):
            for j in range(4):
                if (i == index1 and j == index2 and x[i][j] == " "):
                    num = random.choice([2,4])
                    x[i][j] = num
                    ans = True
                    break
            if (ans):
                break
        if (ans == False):
            random_num()

def upper_move():
    add = 0
    for i in range(4):
        for j in range(4):
            if (x[j][i] == " "):
                for k in range(4):
                    if (x[k][i] != " " and k > j):
                        x[j][i] = x[k][i]
                        x[k][i] = " "
                        break
        for j in range(3):
            if (x[j][i] == x[j + 1][i] and x[j][i] != " "):
                x[j][i] = x[j][i] + x[j + 1][i]
                add += x[j][i]
                x[j + 1][i] = " "
        for j in range(4):
            if (x[j][i] == " "):
                for k in range(4):
                    if (x[k][i] != " " and k > j):
                        x[j][i] = x[k][i]
                        x[k][i] = " "
                        break
    return add

def lower_move():
    add = 0
    for i in range(4):
        for j in range(4):
            if (x[3 - j][3 - i] == " "):
                for k in range(4):
                    if (x[3 - k][3 - i] != " " and k > j):
                        x[3 - j][3 - i] = x[3 - k][3 - i]
                        x[3 - k][3 - i] = " "
                        break
        for j in range(3):
            if (x[3 - j][3 - i] == x[3 - j - 1][3 - i] and x[3 - j][3 - i] != " "):
                x[3 - j][3 - i] = x[3 - j][3 - i] + x[3 - j - 1][3 - i]
                add += x[3 - j][3 - i]
                x[3 - j - 1][3 - i] = " "
        for j in range(4):
            if (x[3 - j][3 - i] == " "):
                for k in range(4):
                    if (x[3 - k][3 - i] != " " and k > j):
                        x[3 - j][3 - i] = x[3 - k][3 - i]
                        x[3 - k][3 - i] = " "
                        break
    return add

def right_move():
    add = 0
    for i in range(4):
        for j in range(4):
            if (x[i][3 - j] == " "):
                for k in range(4):
                    if (x[i][3 - k] != " " and k > j):
                        x[i][3 - j] = x[i][3 - k]
                        x[i][3 - k] = " "
                        break
        for j in range(3):
            if (x[i][3 - j] == x[i][3 - j - 1] and x[i][3 - j] != " "):
                x[i][3 - j] = x[i][3 - j] + x[i][3 - j - 1]
                add += x[i][3 - j]
                x[i][3 - j - 1] = " "
        for j in range(4):
            if (x[i][3 - j] == " "):
                for k in range(4):
                    if (x[i][3 - k] != " " and k > j):
                        x[i][3 - j] = x[i][3 - k]
                        x[i][3 - k] = " "
                        break
    return add

def left_move():
    add = 0
    for i in range(4):
        for j in range(4):
            if (x[i][j] == " "):
                for k in range(4):
                    if (x[i][k] != " " and k > j):
                        x[i][j] = x[i][k]
                        x[i][k] = " "
                        break
        for j in range(3):
            if (x[i][j] == x[i][j + 1] and x[i][j] != " "):
                x[i][j] = x[i][j] + x[i][j + 1]
                add += x[i][j]
                x[i][j + 1] = " "
        for j in range(4):
            if (x[i][j] == " "):
                for k in range(4):
                    if (x[i][k] != " " and k > j):
                        x[i][j] = x[i][k]
                        x[i][k] = " "
                        break
    return add

while(True):
    print("[bold white]Your Score Is--------> [/]",score)
    direction = input("\nEnter the direction: ")
    if direction == 'W':
        score += upper_move()    
    elif direction == 'S':
        score += lower_move()
    elif direction == 'D':
        score += right_move()
    elif direction == 'A':
        score += left_move()
    else:
        if (direction != ""):
            clear()
            game_board()
            print("[bold red]Invalid direction[/]\n")
            continue

    if (not empty()):
        print("[bold red]YOU LOSE...[/]")
        print("\n[bold brown]Your max score is -> [/]\n")
        print(f"[bold white]The max value achieved is {get_max()}[/]")
        break
    if (is_win()):
        print("[bold green]YOU WIN...\n[/]")
        print("\n[bold brown]Your max score is -> [/]\n")
        print(f"[bold white]The max value achieved is {get_max()}[/]")
        break
    clear()
    if (direction != ""):
        random_num()
    game_board()