from flask import Flask, request, jsonify
import random
import json
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from keras.models import load_model
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app) 



# print("Base path:", base_path)

base_path = os.path.dirname(os.path.abspath(__file__))
script = base_path.split("/")[:-1]
script_path = '/'.join(script)  
print()

lemmatizer = WordNetLemmatizer()
intents = json.loads(open(f'{script_path}/enya-model/intents.json').read())
words = pickle.load(open(f'{script_path}/enya-model/words.pkl', 'rb'))
classes = pickle.load(open(f'{script_path}/enya-model/classes.pkl', 'rb'))
model = load_model(f'{script_path}/enya-model/chatbot.h5')

def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words]
    return sentence_words

def bag_of_words(sentence):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence):
    bow = bag_of_words(sentence)
    res = model.predict(np.array([bow]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = [{'intent': classes[r[0]], 'probability': str(r[1])} for r in results]
    return return_list

def get_response(intents_list, intents_json):
    tag = intents_list[0]['intent']
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if i['tag'] == tag:
            result = random.choice(i['responses'])
            break
    return result

@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.json
        message = data['message']
        ints = predict_class(message)

        res = get_response(ints, intents)
        return jsonify({'response': res})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/recommendation', methods=['POST'])
def recommendation():
    try:
        data = request.json
        message = data['message']
        ints = predict_class(message)

        res = get_response(ints, intents)
        return jsonify({'response': res})
    except Exception as e:
        return jsonify({'error': str(e)}), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081)
