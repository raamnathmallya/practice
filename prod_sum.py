

num1 = int(input('give num1: '))

num2 = int(input('give num2: '))

def prod(number1,number2):
    pro = number1*number2
    return pro

def sum(number1,number2):
    su = number1+number2
    return su

product =prod(num1,num2)
addition =sum(num1,num2)


if product > 1000:
    print(product)
else:
    print(addition) 