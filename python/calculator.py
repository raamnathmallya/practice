
from pickle import TRUE

def addi(n1,n2):
    result = n1+n2
    return result

def subi(n1,n2):
    result = n1-n2
    return result

def multi(n1,n2):
    result = n1*n2
    return result

def divi(n1,n2):
    result= n1/n2
    return result

on = TRUE


while on:
    
    num1 = int(input('num1: '))
    num2 = int(input('num2: '))
    funck = input('enter fuction + - * / q : ')
    if funck == '+':
        res = addi(num1,num2)
        print(f'the sum is {res}')
    elif funck == '-':
        subi(num1,num2)
        print(f'the result is {subi(num1,num2)}')
    elif funck == '*':
        multi(num1,num2)
        print (f'the product: {multi(num1,num2)}')
    elif funck == '/':
        divi(num1,num2)
        print (f'the quotient: {divi(num1,num2)}')
    elif funck=='q':
        on = False
    else:
        print('invalid entry')