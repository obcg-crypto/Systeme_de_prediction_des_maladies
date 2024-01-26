from flask import Flask, render_template, request, jsonify
import json
import random
import numpy as np
import pickle
from flask_cors import CORS, cross_origin
from collections import OrderedDict
from itertools import product
import math
import pandas as pd
import pyAgrum as gum



app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# Spécifiez le chemin vers votre fichier CSV
chemin_fichier_csv = "./dataset.csv"

# Chargez le fichier CSV dans un dataframe pandas
dataframe = pd.read_csv(chemin_fichier_csv)

# Récupérez toute la première colonne sans doublons
disease = dataframe.iloc[:, 0].unique()

# Création du dictionnaire initial
disease_list = dataframe['Disease'].unique()
disease_list = [element.lstrip() for element in disease_list]

disease_symptoms = [{"maladie": maladie, "symptomes": []} for maladie in disease_list]

# Dictionnaire pour un accès rapide
disease_dict = {d['maladie']: d for d in disease_symptoms}

# Parcourir le DataFrame
for index, row in dataframe.iterrows():
    maladie = row['Disease']
    for i in range(1, 18):  # Pour chaque colonne de symptôme
        symptome = row.get(f'Symptom_{i}')
        # Vérifier si le symptôme n'est pas NaN avant de l'ajouter
        if pd.notna(symptome) and symptome not in disease_dict[maladie]['symptomes']:
            disease_dict[maladie]['symptomes'].append(symptome)


# Ensemble pour stocker les valeurs uniques
nodes_set = set()

# Parcourir l'objet initial
for item in disease_symptoms:
    maladie = item['maladie']
    symptomes = item['symptomes']

    # Ajouter la maladie et les symptômes à l'ensemble
    nodes_set.add(maladie)
    nodes_set.update(symptomes)

# Créer une liste finale sans doublons
nodes_list = list(nodes_set)
nodes_list = [element.lstrip() for element in nodes_list]
nodes_list = [element.rstrip() for element in nodes_list]

# Creation du réseau bayésien

bn = gum.BayesNet()


# Ajout des noeuds

nodes = {}
for node in nodes_list:
    node_id = bn.add(gum.LabelizedVariable(node,node,2))
    nodes[node] = node_id
    
for dictionnaire in disease_symptoms:
    maladie = dictionnaire['maladie']
    maladie = maladie.rstrip()
    symptomes = dictionnaire['symptomes']
    symptomes = [element.lstrip() for element in symptomes]
    for valeur in symptomes:
        bn.addArc(valeur,maladie)




tableau_symptome = []
tableau_reduit_symptome = []

for dictionnaire in disease_symptoms:
    symptomes = dictionnaire['symptomes']
    tableau_symptome.extend(symptomes)
    tableau_reduit_symptome = list(OrderedDict.fromkeys(tableau_symptome))

tableau_symptome = [element.lstrip() for element in tableau_symptome]
tableau_reduit_symptome = [element.lstrip() for element in tableau_reduit_symptome]



for f in tableau_reduit_symptome:
    
    tmp = tableau_symptome.count(f)/len(tableau_symptome)
    bn.cpt(nodes[f]).fillWith([1-tmp,tmp])


tableau_maladie = []
tableau_maladie_unique = []
tableau_filtre = []
ci = []
m = 0.0

def generate_binary_combinations(variables):
    num_vars = len(variables)
    combinations = list(product([0, 1], repeat=num_vars))
    
    dict_combinations = []
    for combo in combinations:
        combination_dict = {var: state for var, state in zip(variables, combo)}
        dict_combinations.append(combination_dict)

    return dict_combinations

# Fonction pour récupérer les symptômes en fonction de la maladie
def get_symptomes_by_maladie(maladie, tableau):
    for entry in tableau:
        if entry['maladie'] == maladie:
            entry['symptomes'] = [element.lstrip() for element in entry['symptomes']]
            return entry['symptomes']
    # Si la maladie n'est pas trouvée, vous pouvez gérer cela comme vous le souhaitez
    return []


tableau_maladie = dataframe['Disease'].tolist()
tableau_maladie_unique = list(OrderedDict.fromkeys(tableau_maladie))
tableau_maladie_unique = [element.rstrip() for element in tableau_maladie_unique]
#print(tableau_maladie_unique)

for maladie in tableau_maladie_unique:
    
    # Calcul de m

    
    tmp = [chaine for chaine in tableau_maladie if chaine == maladie]
    m = len(tmp)
    
    
    
    # Filtrer le DataFrame pour la maladie choisie
    df_maladie = dataframe[dataframe['Disease'] == maladie]

    
    #print(df_maladie)
    

    tableau_reduit_symptome = get_symptomes_by_maladie(maladie,disease_symptoms)
    tableau_reduit_symptome = [element.lstrip() for element in tableau_reduit_symptome]
    

    for compteur in tableau_reduit_symptome:
    
        # Aplatissez le dataset et comptez le nombre d'occurrences de la valeur
        
        tab = df_maladie.values.flatten().tolist()
        tab = [x for x in tab if not (isinstance(x, float) and math.isnan(x))]
        tab = [element.lstrip() for element in tab]

        nombre_occurrences = tab.count(compteur)


        ci.append(nombre_occurrences/m)
        
    symptomes_correspondants = get_symptomes_by_maladie(maladie,disease_symptoms)
    symptomes_correspondants = [element.lstrip() for element in symptomes_correspondants]
    binary_combinations  = generate_binary_combinations(symptomes_correspondants)
    

    for binary_combination in binary_combinations:

        valeurs = binary_combination.values()
        valeurs = list(valeurs)

        #print(ci)

        index = 0
        s1 = 0.0
        s2 = 0.0
        p = 0.0
        while(index != len(valeurs)):
            s1 = s1 + valeurs[index]*ci[index]
            s2 = s2 + ci[index]
            index = index + 1
        
        if(s2 !=0):
            p = s1/s2                                
            bn.cpt(nodes[maladie])[binary_combination]= [1-p,p]

        
    ci = []


# ie = moteur d'inférence (Inference Engine)

ie = gum.LazyPropagation(bn) #inférence exacte

ie.makeInference()


# Fonction finale pour determiner les probabiltés 
# Prend en parametre les différents symptomes recenti par les malades
# Retourne les maladies dont peut souffrir le malade avec les différentes probabilités

def calculer_probabilites_maladies(symptomes_du_patient):

    resultats = []
    # Trouver les maladies correspondant aux symptômes du patient
    maladies_correspondantes = []

    for maladie in disease_symptoms:
        # Vérifier si un symptôme de la maladie est dans les symptômes du patient
        if any(symptome in symptomes_du_patient for symptome in maladie['symptomes']):
            maladies_correspondantes.append(maladie['maladie'])

    #print("Maladies potentielles basées sur les symptômes du patient:", maladies_correspondantes)
        
    for maladie in disease_symptoms:
        for m in maladies_correspondantes:
            if(maladie['maladie'] == m):
                symptomes_maladie_recherchee = maladie['symptomes']
                #print('Symptomes de la maladie '+str(m)+' : '+str(symptomes_maladie_recherchee))# Liste de tous les symptômes
            
                # Création du dictionnaire
                dictionnaire_symptomes = {symptome: 1 if symptome in symptomes_du_patient else 0 for symptome in symptomes_maladie_recherchee}

                ie.setEvidence(dictionnaire_symptomes)
                ie.makeInference()
                probabilite = ie.posterior(nodes[m])
                valeur1 = probabilite[1]
                valeur2 = probabilite[0]
                objet_maladie = {
                    "proba_0": valeur2,
                    "proba_1": valeur1,
                    "maladie": m
                }

                resultats.append(objet_maladie)
    
    return resultats
                

# Les routes pour l'API

@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
    # Assurez-vous que la requête est de type POST et contient des données JSON
    if request.method == 'POST' and request.is_json:
        # Récupérer les données JSON de la requête
        data = request.get_json()
        data = data['symptomes']

        resultat = calculer_probabilites_maladies(data)


        sorted_data = sorted(resultat, key=lambda x: x['proba_1'], reverse=True)

    return jsonify({'status': 'success', 'data_received': sorted_data})


if __name__ == '__main__':
    app.run(debug=True)