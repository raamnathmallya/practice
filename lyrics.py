text = """
abc this

def
ghi this
abc this

this
ghi abc
"""

print(text)

cats = text.split()

print(len(cats))

word_count = {}

for i in cats:
   
    if i in word_count:
        word_count[i] += 1
    else:
        word_count[i] = 1

print(word_count)


