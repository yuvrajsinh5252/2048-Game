import os
import random

x = [ [" ", " ", " ", " "], [" ",2," ", " "], [" ", " ", " ", " "],[" ", " ", " ", " "] ]

def clear():
    if (os.name == "posix"):
        os.system("clear")
    else:
        os.system("cls")

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
            print(f'{x[i][j] if j < 4 else ""}',end="")
            print(" " * spaces,end="")
        print()
        print('--------------------------------')

game_board() 
print()

def upper_move():
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
                x[j + 1][i] = " "
        for j in range(4):
            if (x[j][i] == " "):
                for k in range(4):
                    if (x[k][i] != " " and k > j):
                        x[j][i] = x[k][i]
                        x[k][i] = " "
                        break

def lower_move():
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
                x[3 - j - 1][3 - i] = " "
        for j in range(4):
            if (x[3 - j][3 - i] == " "):
                for k in range(4):
                    if (x[3 - k][3 - i] != " " and k > j):
                        x[3 - j][3 - i] = x[3 - k][3 - i]
                        x[3 - k][3 - i] = " "
                        break

def right_move():
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
                x[i][3 - j - 1] = " "
        for j in range(4):
            if (x[i][3 - j] == " "):
                for k in range(4):
                    if (x[i][3 - k] != " " and k > j):
                        x[i][3 - j] = x[i][3 - k]
                        x[i][3 - k] = " "
                        break

def left_move():
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
                x[i][j + 1] = " "
        for j in range(4):
            if (x[i][j] == " "):
                for k in range(4):
                    if (x[i][k] != " " and k > j):
                        x[i][j] = x[i][k]
                        x[i][k] = " "
                        break


while(True):
    direction = input("Enter the direction: ")
    if direction == 'W':
        upper_move()    
    elif direction == 'S':
        lower_move()
    elif direction == 'D':
        right_move()
    elif direction == 'A':
        left_move()
    else:
        print("Invalid direction")

    if (not empty()):
        print("YOU LOSE...")
        print("Your max score is -> ",end="")
        get_max()
        break
    if (is_win()):
        print("YOU WIN...")
        print("Your max score is -> ",end="")
        get_max()
        break
    clear()
    random_num()
    game_board()