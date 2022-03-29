
movies = ['Batman', 'Titanic', 'inception', 'Alien', 'Patrick']
print (movies)

for i in movies:
    print(i)


for i in range(40):
    print((i+1)*2)


fruits = ['apple','orange','banana']

for i in fruits:
    print (f'i like to eat {i}')
    print ('i like to eat {}'.format(i))

temp = 37

while temp > 32:
    print (f'water is not frozen and temp is {temp}')
    temp -= 1
print ('water is frozen')

#  to demonstrate break
temp = 40
while temp > 32:
    print (f'water is not frozen and temp is {temp}')
    temp -= 1
    if temp==35:
        break
print ('water is frozen')

# to demonstrate continue
for i in range(1,10):
    if i==7:
        print('we are not printing 7')
        continue
    print(f'this is the number{i}')

# to demonstrate pass

for i in range(1,10):
    if i ==3:
        pass
    else:
        print(f'the number is {i}')


