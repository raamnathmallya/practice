import random

magic_number_is = random.randint(1,4)

if magic_number_is == 1:
    print('YES')
elif magic_number_is == 2:
    print('NO')
elif magic_number_is == 3:
    print('MAYBE')
else:
    print('better luck next time')



lucky_number = random.randint(1,99)

print (f"your lucky number is {lucky_number}")