# sum of current number and previous number

print('Printing current and previous number within 10')
previous_num = 0
for i in range (0,10):
    print (f'current number',i,
            'previous number', previous_num,
            'sum is',previous_num+i)
    previous_num = i
