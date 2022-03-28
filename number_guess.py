import random
import time

guessed = int(input('guess a number between 1 and 10: '))

random_number  = random.randint(1,10)

count = 1

print('thinking...')
time.sleep(3)


while guessed != random_number:
    count += 1
    if guessed<random_number:

        print('you guessed wrong number, the number is more')
        guessed = int(input('guess a number: '))
        print('thinking...')
        time.sleep(3)

    elif guessed>random_number:
       
        print('you guessed wrong number, the number is less')
        guessed = int(input('guess a number: '))
        print('thinking...')
        time.sleep(3)
        
    else:
        print('invalid number')

print(f'you got the correct answer in {count} guesses')
