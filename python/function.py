
def hey():
    print('hello nick!')

for i in range(1):
    hey()

    # 

def doge(name,age):
    print(f'my name is {name} and iam {age} years old')

doge('tommy',12)

    # 

def caps(word):
    yo = word.upper()
    print(yo)

caps('another sentence in lowecase')


names = ['nick','munroe','rosalee']

for i in names:
    yo = i.upper()

    print(yo)


# here name is argument but age and city are keyword arguments-defaults
def user_info (name, age=12, city="mangalore"):  
    #  '''this is a comment'''
    print(f'my name is {name} and i am {age} years old and i live in {city}')
    print('my name is {} and i am {} years old and i live in {}'.format(name,age,city))

# example for keyword argument
user_info(age = 3, name= 'bunty')
# example for argument
user_info('arya', 23,'bangalore')
