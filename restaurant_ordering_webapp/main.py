
# import nltk
# from nltk.stem.lancaster import LancasterStemmer
# import numpy as np
# import tensorflow as tf
# import tflearn
# import random
# import json
# import sys

# stemmer = LancasterStemmer()

# with open('intents.json') as f:
#     data = json.load(f)

# # print(data['intents'])
 
# words = []
# labels = []
# docs_x = []
# docs_y = []

# for x in data['intents']:
#     for y in x['patterns']:
#         wrds = nltk.word_tokenize(y)
#         words.extend(wrds)
#         docs_x.append(wrds)
#         docs_y.append(x['tag'])
    
#     if x['tag'] not in labels:
#         labels.append(x['tag'])

# words = [stemmer.stem(w.lower()) for w in words if w != '?']
# words = sorted(list(set(words)))

# labels = sorted(labels)

# training = []
# output = []

# out_empty = [0 for _ in range(len(labels))]

# for x, doc in enumerate(docs_x):
#     bag = []

#     wrds = [stemmer.stem(w.lower()) for w in doc]

#     for w in words:
#         if w in wrds:
#             bag.append(1)
#         else:
#             bag.append(0)

#     output_row = out_empty[:]
#     output_row[labels.index(docs_y[x])] = 1

#     training.append(bag)
#     output.append(output_row)

# training = np.array(training)
# output = np.array(output)

# tf.reset_default_graph()

# net = tflearn.input_data(shape=[None, len(training[0])])
# net = tflearn.fully_connected(net, 8)
# net = tflearn.fully_connected(net, 8)
# net = tflearn.fully_connected(net, len(output[0]), activation="softmax")
# net = tflearn.regression(net)

# model = tflearn.DNN(net)

# model.fit(training, output, n_epoch=500, batch_size=8, show_metric=True)
# model.save("model.tflearn")


# def bag_of_words(s, words):
#     bag = [0 for _ in range(len(words))]

#     s_words = nltk.word_tokenize(s)
#     s_words = [stemmer.stem(w.lower()) for w in s_words]

#     for se in s_words:
#         for i, w in enumerate(words):
#             if w == se:
#                 bag[i] = 1
        
#     return np.array(bag)

# # @eel.expose
# # def chat(userInp):
# #     print("Start talking with the bot (type bye to stop)!")
    
# #     inp = userInp
   
        

# #     results = model.predict([bag_of_words(inp, words)])
# #     results_index = np.argmax(results)
# #     tag = labels[results_index]

# #     for x in data['intents']:
# #         if x['tag'] == tag:
# #             responses = x['responses']

# #     print(random.choice(responses))

# def chat():
#     # print("Start talking with the bot (type bye to stop)!")
#     arg = sys.argv
#     len_arg = len(arg)
#     for x in range(1, len_arg):
#         inp = arg[x]
#         print("YOU: " + inp)
#         if inp.lower() == "bye":
#          break

#         results = model.predict([bag_of_words(inp, words)])
#         results_index = np.argmax(results)
#         tag = labels[results_index]

#         for x in data['intents']:
#             if x['tag'] == tag:
#                 responses = x['responses']

#         print (random.choice(responses))
        
        

# chat()

import nltk
from nltk.stem.lancaster import LancasterStemmer
import numpy as np
import tensorflow as tf
import tflearn
import random
import json
import sys
import pickle

stemmer = LancasterStemmer()

with open('intents.json') as f:
    data = json.load(f)

# print(data['intents'])
try:
    with open("data.pickle", "rb") as f:
        words, labels, training, output = pickle.load(f)
except:
    words = []
    labels = []
    docs_x = []
    docs_y = []

    for x in data['intents']:
        for y in x['patterns']:
            wrds = nltk.word_tokenize(y)
            words.extend(wrds)
            docs_x.append(wrds)
            docs_y.append(x['tag'])
        
        if x['tag'] not in labels:
            labels.append(x['tag'])

    words = [stemmer.stem(w.lower()) for w in words if w != '?']
    words = sorted(list(set(words)))

    labels = sorted(labels)

    training = []
    output = []

    out_empty = [0 for _ in range(len(labels))]

    for x, doc in enumerate(docs_x):
        bag = []

        wrds = [stemmer.stem(w.lower()) for w in doc]

        for w in words:
            if w in wrds:
                bag.append(1)
            else:
                bag.append(0)

        output_row = out_empty[:]
        output_row[labels.index(docs_y[x])] = 1

        training.append(bag)
        output.append(output_row)

    training = np.array(training)
    output = np.array(output)

    with open("data.pickle", "wb") as f:
        pickle.dump((words, labels, training, output), f)



tf.reset_default_graph()

net = tflearn.input_data(shape=[None, len(training[0])])
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, 8)
net = tflearn.fully_connected(net, len(output[0]), activation="softmax")
net = tflearn.regression(net)

model = tflearn.DNN(net)
try:
    model.load("model.tflearn")
except:
    model.fit(training, output, n_epoch=500, batch_size=8, show_metric=True)
    model.save("model.tflearn")


def bag_of_words(s, words):
    bag = [0 for _ in range(len(words))]

    s_words = nltk.word_tokenize(s)
    s_words = [stemmer.stem(w.lower()) for w in s_words]

    for se in s_words:
        for i, w in enumerate(words):
            if w == se:
                bag[i] = 1
        
    return np.array(bag)


def chat():
    print("Start talking with the bot (type bye to stop)!")
    arg = sys.argv
    len_arg = len(arg)
    for x in range(1, len_arg):
        inp = arg[x]
        print("YOU: " + inp)
        if inp.lower() == "bye":
         break

        results = model.predict([bag_of_words(inp, words)])
        results_index = np.argmax(results)
        tag = labels[results_index]

        for x in data['intents']:
            if x['tag'] == tag:
                responses = x['responses']

        print (random.choice(responses))


        
        

chat()







# def chat():
#     print("Start talking with the bot (type bye to stop)!")
#     while True:
#         inp = input("YOU: ")
#         if inp.lower() == "bye":
#             break

#         results = model.predict([bag_of_words(inp, words)])
#         results_index = np.argmax(results)
#         tag = labels[results_index]

#         for x in data['intents']:
#             if x['tag'] == tag:
#                 responses = x['responses']

#         print(random.choice(responses))


    
    







