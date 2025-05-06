

def uppi(text):
    return text.upper()

def lippi(text):
    return text.lower()

sentence = input('please enter your text here: ')

choice = input ('if you want upper case press 1 else pres 2:  ')

if int(choice) == 1:
    print(uppi(sentence))
elif int(choice) == 2:
    print(lippi(sentence))
else:
    print('pagal hai kya?')
